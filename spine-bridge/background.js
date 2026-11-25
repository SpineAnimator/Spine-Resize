// Background service worker: talks to native messaging host "spinebridge".
let nativePort = null;
let nextId = 1;
const pending = new Map();

function ensurePort() {
  if (nativePort) return nativePort;
  try {
    nativePort = chrome.runtime.connectNative("spinemaskbridge");
    nativePort.onMessage.addListener((msg) => {
      const p = pending.get(msg.id);
      if (p) {
        pending.delete(msg.id);
        if (msg.error) p.reject(new Error(msg.error));
        else p.resolve(msg.result);
      }
    });
    nativePort.onDisconnect.addListener(() => {
      nativePort = null;
      for (const p of pending.values()) p.reject(new Error("native host disconnected"));
      pending.clear();
    });
  } catch (e) {
    nativePort = null;
  }
  return nativePort;
}

async function callNative(method, params) {
  const port = ensurePort();
  if (!port) throw new Error("native host not available");
  const id = nextId++;
  const p = new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); });
  port.postMessage({ id, method, params });
  return Promise.race([
    p,
    new Promise((_, reject) => setTimeout(() => reject(new Error("native timeout")), 45000))
  ]);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "MASK_NATIVE") return false;
  (async () => {
    try {
      let result;
      switch (msg.type) {
        case "GET_OPEN_FILE_PATH":
          result = await callNative("get_open_file_path", {});
          break;
        case "GET_OPEN_SPINE_FILE":
          result = await callNative("get_open_spine_file", {});
          break;
        case "GET_SIBLING_IMAGES":
          result = await callNative("get_sibling_images", { projectPath: msg.projectPath, session: msg.session });
          break;
        case "READ_PROJECT_CHUNK":
          result = await callNative("read_project_chunk", { session: msg.session, offset: msg.offset });
          break;
        case "READ_FILE_CHUNK":
          result = await callNative("read_file_chunk", { session: msg.session, path: msg.path, offset: msg.offset });
          break;
        case "BEGIN_SAVE":
          result = await callNative("begin_resize_save", { session: msg.session, path: msg.path, size: msg.size });
          break;
        case "WRITE_SAVE_CHUNK":
          result = await callNative("write_resize_save_chunk", { stage: msg.stage, offset: msg.offset, base64: msg.base64 });
          break;
        case "FINISH_SAVE":
          result = await callNative("finish_resize_save", { stage: msg.stage });
          break;
        case "PING":
          result = await callNative("get_open_file_path", {});
          break;
        default:
          throw new Error("unknown method " + msg.type);
      }
      sendResponse({ ok: true, result });
    } catch (e) {
      sendResponse({ ok: false, error: String(e && e.message ? e.message : e) });
    }
  })();
  return true;
});

// Separate locked-down Spine Mask host, never the legacy arbitrary file bridge.
const MASK_ROOT="https://spineanimator.github.io/Spine-Mask-Tool/";
const MASK_METHODS=new Set(["ping","open_project","choose_project","begin_import","import_chunk","finish_import","read_import_chunk","read_chunk","begin_result","write_chunk","commit_result"]);
let maskPort=null, maskNextId=1;
const maskPending=new Map();
function ensureMaskPort(){
  if(maskPort)return maskPort;
  const port=chrome.runtime.connectNative("spinemaskbridge");
  maskPort=port;
  port.onMessage.addListener(message=>{
    const pending=maskPending.get(message?.id);
    if(!pending)return;
    clearTimeout(pending.timer);maskPending.delete(message.id);
    if(message.error)pending.reject(new Error(String(message.error).slice(0,180)));
    else pending.resolve(message.result);
  });
  port.onDisconnect.addListener(()=>{
    if(maskPort===port)maskPort=null;
    const error=chrome.runtime.lastError?.message||"Spine Mask native host disconnected";
    for(const item of maskPending.values()){clearTimeout(item.timer);item.reject(new Error(error));}
    maskPending.clear();
  });
  return port;
}
function maskCall(method,params){
  const port=ensureMaskPort(), id=maskNextId++;
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{
      maskPending.delete(id);reject(new Error("Spine Mask native host timeout"));
    },method==="commit_result"||method==="open_project"||method==="choose_project"||method==="finish_import"?210000:25000);
    maskPending.set(id,{timer,resolve,reject});
    try{port.postMessage({id,method,params:params||{}});}
    catch(error){clearTimeout(timer);maskPending.delete(id);reject(error);}
  });
}
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if(message?.type!=="MASK_NATIVE")return false;
  const url=sender.url||"";
  if(!url.startsWith(MASK_ROOT)||sender.frameId!==0||!sender.tab){
    sendResponse({ok:false,error:"Spine Mask origin is not authorized"});
    return false;
  }
  if(!MASK_METHODS.has(message.action)){
    sendResponse({ok:false,error:"Unsupported Spine Mask action"});
    return false;
  }
  (async()=>{
    try{sendResponse({ok:true,result:await maskCall(message.action,message.params)});}
    catch(error){sendResponse({ok:false,error:String(error?.message||error).slice(0,180)});}
  })();
  return true;
});

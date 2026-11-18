// Native Spine Mask tunnel for the exact Spine Mask Tool origin.
// Isolated-world bridge: page <-> extension messages with request-id correlation.
(()=>{
  if(location.origin!=="https://spineanimator.github.io"||
     !["/Spine-Mask-Tool/","/Spine-Mask-Tool/index.html"].includes(location.pathname))return;
  const ALLOWED=new Set(["ping","open_project","read_chunk","begin_result","write_chunk","commit_result"]);
  const CHANNEL="spine-mask-native-v1";
  window.addEventListener("message",event=>{
    if(event.source!==window||event.origin!==location.origin)return;
    const m=event.data;
    if(!m||m.channel!==CHANNEL||m.type!=="request"||!ALLOWED.has(m.method))return;
    if(typeof m.id!=="string"||!/^[-a-zA-Z0-9_]{1,90}$/.test(m.id))return;
    chrome.runtime.sendMessage({type:"MASK_NATIVE",action:m.method,params:m.params||{}},answer=>{
      const error=chrome.runtime.lastError?.message;
      window.postMessage({channel:CHANNEL,type:"response",id:m.id,
        ok:!error&&answer?.ok===true,result:answer?.result,
        error:error||answer?.error||"Spine Mask bridge not connected"},location.origin);
    });
  });
  window.postMessage({channel:CHANNEL,type:"ready",version:1},location.origin);
})();

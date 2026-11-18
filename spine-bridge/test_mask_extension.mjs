import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const folder = new URL("./", import.meta.url);
const get = name => fs.readFileSync(new URL(name,folder),"utf8");
const manifest = JSON.parse(get("manifest.json"));
assert.ok(manifest.permissions.includes("nativeMessaging"));
assert.deepEqual(manifest.content_scripts
  .filter(x => x.matches.includes("https://spineanimator.github.io/Spine-Mask-Tool/*"))
  .map(x => x.js), [["mask-content.js"]]);
assert.equal(manifest.manifest_version,3);

const listeners=[],portMessages=[],windowEvents={},windowPosts=[];
const nativeOnMessage=[],nativeOnDisconnect=[];
const nativePort={
  postMessage:message=>{
    portMessages.push(message);
    queueMicrotask(()=>{
      for(const handler of nativeOnMessage)handler({
        id:message.id,result:message.method==="ping"
          ?{connected:true,protocol:"spinemask/1"}:{echo:message.method}
      });
    });
  },
  onMessage:{addListener:fn=>nativeOnMessage.push(fn)},
  onDisconnect:{addListener:fn=>nativeOnDisconnect.push(fn)}
};
const runtime={
  onMessage:{addListener:fn=>listeners.push(fn)},
  connectNative(name){assert.equal(name,"spinemaskbridge");return nativePort;},
  lastError:null,
  sendMessage(message,callback){
    const sender={url:"https://spineanimator.github.io/Spine-Mask-Tool/?utm_source=test",
      frameId:0,tab:{id:17}};
    for(const listener of listeners)listener(message,sender,callback);
  }
};
const background={chrome:{runtime},setTimeout,clearTimeout,console,Map,Set};
vm.runInNewContext(get("background.js"),background,{filename:"background.js"});
assert.equal(listeners.length,2,"both Resize and Mask listeners should be installed");
const origin="https://spineanimator.github.io";
const windowMock={
  addEventListener:(name,handler)=>{(windowEvents[name]??=[]).push(handler);},
  postMessage:(payload,targetOrigin)=>{
    assert.equal(targetOrigin,origin);
    windowPosts.push(payload);
    queueMicrotask(()=>{
      for(const handler of windowEvents.message||[])
        handler({source:windowMock,origin,data:payload});
    });
  }
};
const context={window:windowMock,location:{origin,pathname:"/Spine-Mask-Tool/"},
  chrome:{runtime},Promise,Error,console};
vm.runInNewContext(get("mask-content.js"),context,{filename:"mask-content.js"});
await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error("Mask Native Messaging roundtrip timed out")),1500);
  (windowEvents.message||[]).push(event=>{
    if(event.data?.type!=="response"||event.data?.id!=="test_1")return;
    clearTimeout(timer);
    try{
      assert.equal(event.data.ok,true);
      assert.equal(event.data.result.protocol,"spinemask/1");
      assert.equal(portMessages[0].method,"ping");
      resolve();
    }catch(e){reject(e);}
  });
  windowMock.postMessage({channel:"spine-mask-native-v1",type:"request",id:"test_1",
    method:"ping",params:{}},origin);
});
let blocked=null;
listeners[1]({type:"MASK_NATIVE",action:"read_file",params:{path:"/private"}},
  {url:"https://spineanimator.github.io/Spine-Mask-Tool/",frameId:0,tab:{id:2}},x=>{blocked=x;});
assert.equal(blocked.ok,false);
assert.match(blocked.error,/Unsupported/);
let badOrigin=null;
listeners[1]({type:"MASK_NATIVE",action:"ping",params:{}},
  {url:"https://evil.example/Spine-Mask-Tool/",frameId:0,tab:{id:3}},x=>{badOrigin=x;});
assert.equal(badOrigin.ok,false);
assert.match(badOrigin.error,/not authorized/);
console.log("SPINE_MASK_EXTENSION_NATIVE_ROUNDTRIP_PASS",{
  maskRequests:portMessages.length,chromeHandlers:listeners.length,
  defaultProjectWrites:false
});

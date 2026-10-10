document.getElementById('refresh').onclick = () => {
  chrome.runtime.sendMessage({type:'GET_OPEN_FILE_PATH'}, r => {
    document.getElementById('status').textContent = r && r.result ? r.result : 'not found';
  });
};
chrome.runtime.sendMessage({type:'GET_OPEN_FILE_PATH'}, r => {
  document.getElementById('status').textContent = r && r.result ? r.result : 'not found';
});

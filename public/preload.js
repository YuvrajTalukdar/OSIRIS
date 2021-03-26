const { ipcRenderer } = require('electron');
const electron = require('electron');

process.once('loaded', () => 
{
    global.ipcRenderer = electron.ipcRenderer;
  
    window.addEventListener('message', event => 
    {
        const message = event.data;
        if (message.close_settings === 1) 
        {   ipcRenderer.send('cancelButton:pressed', message);}
    });

    /*ipcRenderer.on('testmsg:electron',(event,todo)=>{
        console.log('testing565656');
        window.postMessage({testmsg: 'test_message'});
    });*/
});

function init() 
{
    // add global variables to your web page
    window.isElectron = true
    window.ipcRenderer = ipcRenderer
}
  
init();

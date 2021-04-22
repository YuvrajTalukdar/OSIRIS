const { ipcRenderer } = require('electron');
const electron = require('electron');

process.once('loaded', () => 
{ 
    window.addEventListener('message', event => 
    {
        const message = event.data;
        if (message.close_settings === 1) 
        {   ipcRenderer.send('cancelButton:pressed', message);}
    });
});

function init() 
{
    // add global variables to your web page
    window.isElectron = true
    window.ipcRenderer = ipcRenderer
}
  
init();

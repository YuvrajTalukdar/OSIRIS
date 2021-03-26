//test code
/*
const cpp=require('../build/Release/AvyuktaEngine');
const obj1=cpp.initialize_data(2.52,3.45);
console.log('\nMsg From js= ',obj1.msg);
console.log('\nresult from js=',obj1.result); 
cpp.dis_f();*/

const electron = require('electron')
const path=require('path');
const is_dev=require('electron-is-dev');
const {app,BrowserWindow,Menu,ipcMain,ipcRenderer} = electron;

let mainWindow;
let settingsWindow=null;

app.on('ready', () => 
{
    mainWindow = new BrowserWindow(
    {   
        width:800, 
        height:600,
        title:'OSIRIS',//nitle need to be changes in the html page. It is redundant here.
        webPreferences:
        {   nodeIntegration:true}
    });
    mainWindow.loadURL(is_dev? 'http://localhost:3000':`file://${path.join(__dirname,"../build/index.html")}`);
    mainWindow.on('closed',()=>app.quit());
    mainWindow.setTitle("OSIRIS");

    const mainMenu=Menu.buildFromTemplate(mainmenuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

function startSettingsWindow()
{   
    if(settingsWindow===null)
    {
        settingsWindow=new BrowserWindow(
        {
            width:800,
            height:600,
            alwaysOnTop: true,
            title: 'Settings',
            webPreferences:
            {   nodeIntegration:true,
                preload: path.join(__dirname, './preload.js'),
                contextIsolation: false 
            }
        });
        settingsWindow.loadURL(is_dev? 'http://localhost:3000/Settings':`file://${path.join(__dirname,"../build/index.html#/settings")}`);
        settingsWindow.on('closed',()=>settingsWindow=null);
        settingsWindow.setTitle("Settings");
        if(process.env.NODE_ENV==='production')
        {   settingsWindow.setMenu(null);}
        //mainWindow.hide();
    }
    //window.postMessage({testmsg: 'test_message'});
}

ipcMain.on('cancelButton:pressed',(event,todo)=>{
    settingsWindow.close();
});

const mainmenuTemplate=[
    {
        label:'File',
        submenu:[
            {
                label:'New Node',
                click()
                {   
                    data_list=[];
                    data_list.push("text1");
                    data_list.push("text2");
                    settingsWindow.webContents.send('settings:data',data_list);
                }
            },
            {
                label:'Settings',
                click()
                {   startSettingsWindow();}
            },
            {
                label:'Quit',
                accelerator:(()=>{
                    if(process.platform==='darwin')
                    {   return 'Command+Q';}
                    else
                    {   return 'Ctrl+Q';}
                })(),
                click()
                {   app.quit();}
            }
        ],
    },
    {
        label:'Help',
        submenu:[
            {
                label:'Documentation',
                click()
                {}
            },
            {
                label:'About',
                click()
                {}
            }
        ]
    }
];
if(process.platform==='darwin')
{
    mainmenuTemplate.unshift();
}
if(process.env.NODE_ENV!=='production')
{
    mainmenuTemplate.push({
        label:'DEVELOPER',
        submenu:[
            {role:'reload'},
            {
                label:'Toggle Developer Tools',
                accelerator:process.platform==='darwin'?'Command+Alt+I':'Ctrl+Shift+I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}
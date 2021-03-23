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
const {app,BrowserWindow,Menu,ipcMain} = electron;
const url = require('url');

let mainWindow;
let settingsWindow;

url.format({
    pathname:path.join(__dirname,'../build/index.html'),
    hash:'/',
    protocol:'file:',
    slashes:true
});

app.on('ready', () => 
{
    mainWindow = new BrowserWindow(
    {   
        width:800, 
        height:600,
        title:'OSIRIS',//nitle need to be changes in the html page. It is redundant here.
        webPreferences:
        {    nodeIntegration:true}
    });
    mainWindow.loadURL(is_dev? 'http://localhost:3000':`file://${path.join(__dirname,"../build/index.html")}`);
    //mainWindow.loadURL('http://localhost:3000');
    mainWindow.on('closed',()=>app.quit());
    mainWindow.setTitle("OSIRIS");

    const mainMenu=Menu.buildFromTemplate(mainmenuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

function startSettingsWindow()
{
    settingsWindow=new BrowserWindow(
    {
        width:800,
        height:600,
        title: 'Settings',
        webPreferences:
        {   nodeIntegration:true}
    });
    settingsWindow.loadURL(is_dev? 'http://localhost:3000/Settings':`file://${path.join(__dirname,"../build/index.html#/settings")}`);
    settingsWindow.on('closed',()=>addWindow=null);
    settingsWindow.setTitle("Settings");
    if(process.env.NODE_ENV==='production')
    {   settingsWindow.setMenu(null);}
    
}

const mainmenuTemplate=[
    {
        label:'File',
        submenu:[
            {
                label:'New Node',
                click()
                {   }
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
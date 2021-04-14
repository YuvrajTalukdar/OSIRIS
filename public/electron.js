const AvyuktaEngine=require('../build/Release/AvyuktaEngine');

const electron = require('electron')
const path=require('path');
const is_dev=require('electron-is-dev');
const {app,BrowserWindow,Menu,ipcMain,screen} = electron;

let mainWindow;
let settingsWindow=null;

function initialize_engine()
{   AvyuktaEngine.initialize_engine();}

app.on('ready', () => 
{
    const {height,width} = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow(
    {   
        width:width, 
        height:height,
        title:'OSIRIS',//nitle need to be changes in the html page. It is redundant here.
        webPreferences:
        {   nodeIntegration:true,
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: false 
        }
    });
    mainWindow.loadURL(is_dev? 'http://localhost:3000':`file://${path.join(__dirname,"../build/index.html")}`);
    mainWindow.on('closed',()=>app.quit());
    mainWindow.setTitle("OSIRIS");

    const mainMenu=Menu.buildFromTemplate(mainmenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    initialize_engine();
})

/*Main window functions*/
ipcMain.on('get_main_window_data',(event,todo)=>{
    let obj1=AvyuktaEngine.get_type_data();
    var data={
        'node_type_list':obj1.node_type_list,
        'relation_type_list':obj1.relation_type_list
    };
    mainWindow.webContents.send('main_window_data_received',data);
});

ipcMain.on('delete_node_relation_type',(enent,data)=>{
    AvyuktaEngine.delete_node_relation_type(data.id,data.node_or_relation);
});

ipcMain.on('add_node_relation_type',(enent,data)=>{
    AvyuktaEngine.add_node_relation_type(data.type,data.node_or_relation,"");
});

/*Settings window functions and variables*/ 
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
            },
            resizable:false
        });
        settingsWindow.loadURL(is_dev? 'http://localhost:3000/Settings':`file://${path.join(__dirname,"../build/index.html#/settings")}`);
        settingsWindow.on('closed',()=>settingsWindow=null);
        settingsWindow.setTitle("Settings");
        if(process.env.NODE_ENV==='production')
        {   settingsWindow.setMenu(null);}
        //mainWindow.hide();
    }
}

ipcMain.on('cancelButton:pressed',(event,todo)=>{
    settingsWindow.close();
});

ipcMain.on('get_settings_data',(event,todo)=>{
    var settings_obj=AvyuktaEngine.load_settings();
    var data={
        'nodes_in_one_nodefile':settings_obj.nodes_in_one_nodefile,
        'relation_in_one_file':settings_obj.relation_in_one_file,
        'percent_of_nodes_in_mem':settings_obj.percent_of_nodes_in_mem,
        'encryption_status':settings_obj.encryption_status
    };
    settingsWindow.webContents.send('settings_data_received',data);
});

ipcMain.on('new_settings',(event,data)=>
{
    settingsWindow.close();
    AvyuktaEngine.change_settings(data.nodes_in_one_nodefile,data.relation_in_one_file,data.percent_of_nodes_in_mem,data.encryption_status);
});

/*Menu stuff*/
const mainmenuTemplate=[
    {
        label:'File',
        submenu:[
            {
                label:'New Node',
                click()
                {   
                    /*data_list=[];
                    data_list.push("text1");
                    data_list.push("text2");
                    settingsWindow.webContents.send('settings:data',data_list);*/
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
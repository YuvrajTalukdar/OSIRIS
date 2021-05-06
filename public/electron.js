const AvyuktaEngine=require('../build/Release/AvyuktaEngine');

const electron = require('electron')
const path=require('path');
const is_dev=require('electron-is-dev');
const {app,BrowserWindow,Menu,ipcMain,screen,dialog} = electron;
const fs = require('fs');

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
});

/*Main window functions*/
ipcMain.on('get_main_window_data',(event,todo)=>{
    let obj1=AvyuktaEngine.get_type_data();
    let obj2=AvyuktaEngine.get_node_relation_data();
    var data={
        'node_type_list':obj1.node_type_list,
        'relation_type_list':obj1.relation_type_list,
        'node_list':obj2.node_list,
        'relation_list':obj2.relation_list
    };
    mainWindow.webContents.send('main_window_data_received',data);
});

ipcMain.on('delete_node_relation_type',(enent,data)=>{
    AvyuktaEngine.delete_node_relation_type(data.id,data.node_or_relation);
});

ipcMain.on('add_node_relation_type',(enent,data)=>{
    AvyuktaEngine.add_node_relation_type(data.type,data.node_or_relation,data.color_code,data.vectored);
});

ipcMain.on('edit_node_relation_type',(enent,data)=>{
    AvyuktaEngine.edit_node_relation_type(data.node_or_relation,data.id,data.type,data.color_code,data.vectored);
});

ipcMain.on('edit_node',(enent,data)=>{
    AvyuktaEngine.edit_node(data.node_id,data.node_type_id,data.node_name);
});

ipcMain.on('add_new_node',(enent,data)=>{
    AvyuktaEngine.add_new_node(data.node_name,data.node_type_id);
    let obj=AvyuktaEngine.get_last_entered_node_data();
    //send the data to top
    var last_entered_node={
        'node_id':obj.node_id,
        'node_type_id':obj.node_type_id,
        'node_name':obj.node_name,
        'show':true,
        'relation_id_list':obj.relation_id_list
    }
    mainWindow.webContents.send('last_entered_node',last_entered_node);
});

ipcMain.on('edit_relation',(enent,data)=>{
    var source_local=[];
    for(var a=0;a<data.source_local.length;a++)
    {   
        copy_files(data.source_local[a].file_dir,data.source_local[a].new_file_dir);
        source_local.push(data.source_local[a].new_file_dir);
    }
    AvyuktaEngine.edit_relation(data.source_node_id,data.destination_node_id,data.relation_type_id,data.source_url_list,source_local,data.relation_id);
    console.log("relation_edited");
});

ipcMain.on('delete_node',(enent,data)=>{
    AvyuktaEngine.delete_node(data);
});

ipcMain.on('delete_relation',(enent,data)=>{
    AvyuktaEngine.delete_relation(data);
});

function get_filename_from_path(path)
{
    var file_name="";
    for(var a=path.length-1;a>=0;a--)
    {
        if(path[a].localeCompare("/")!=0)
        {   file_name=path[a]+file_name;}
        else
        {   break;}
    }
    return file_name;
}
function copy_files(source_path,destination_path)
{
    fs.copyFile(source_path,destination_path, 
    fs.constants.COPYFILE_EXCL, (err) => {
        if(err) 
        {   console.log("Copy Error Found:", err);}
        else 
        {}
    });
}
ipcMain.on('add_new_relation',(event,data)=>{
    var source_local=[];
    for(var a=0;a<data.source_local.length;a++)
    {   
        copy_files(data.source_local[a].file_dir,data.source_local[a].new_file_dir);
        source_local.push(data.source_local[a].new_file_dir);
    }
    AvyuktaEngine.add_new_relation(data.source_node_id,data.destination_node_id,data.relation_type_id,data.source_url_list,source_local);
    let obj=AvyuktaEngine.get_last_entered_relation_data();
    mainWindow.webContents.send('last_entered_relation',obj);
});
ipcMain.on('open_file_picker',(event,todo)=>{
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
    },
    ).then(function (response) 
    {   
        if (!response.canceled) 
        {
            for(var a=0;a<response.filePaths.length;a++)    
            {
                var file_name=get_filename_from_path(response.filePaths[a]);
                var new_file_dir="database/documents/"+file_name
                var data={
                    'file_name':file_name,
                    'new_file_dir':new_file_dir,
                    'file_dir':response.filePaths[a]
                }
                mainWindow.webContents.send('add_file_dir',data);
            }
        } 
    });
});

/*Testing functions*/
ipcMain.on('test_lower',(event,data)=>{
    //console.log("test_lower");
    mainWindow.webContents.send('test_upper',"check67");
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
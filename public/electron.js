const version=1.0;
process.env.NODE_ENV = 'production';
//const AvyuktaEngine=require('../build/Release/AvyuktaEngine');
const AvyuktaEngine=require('AvyuktaEngine');

const electron = require('electron')
const path=require('path');
const is_dev=require('electron-is-dev');
const {app,BrowserWindow,Menu,ipcMain,screen,dialog} = electron;
const fs = require('fs');

let mainWindow;
let settingsWindow=null;
let aboutWindow=null;

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
        },
        icon:electron.nativeImage.createFromPath(__dirname+'/osiris_icon2.png')
    });
    mainWindow.loadURL(is_dev? 'http://localhost:3000/Login':`file://${path.join(__dirname,"../build/index.html#/Login")}`);
    mainWindow.on('closed',()=>
    {
        AvyuktaEngine.shutdown_engine();
        app.quit()
    });
    mainWindow.setTitle("OSIRIS");

    const mainMenu=Menu.buildFromTemplate(mainmenuTemplate);
    Menu.setApplicationMenu(mainMenu);
    //Menu.getApplicationMenu().getMenuItemById(0).enabled=false;
    Menu.getApplicationMenu().getMenuItemById(1).enabled=false;
    Menu.getApplicationMenu().getMenuItemById(2).enabled=false;
});

/*Main window functions*/
ipcMain.on('change_password',(enent,data)=>{
    let obj1=AvyuktaEngine.change_password(data.current_pass,data.new_pass);
    mainWindow.webContents.send('password_change_status',obj1);
});

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

ipcMain.on('close_db',(enent,data)=>{
    AvyuktaEngine.shutdown_engine();
    mainWindow.loadURL(is_dev? 'http://localhost:3000/Login':`file://${path.join(__dirname,"../build/index.html#/Login")}`);
    //Menu.getApplicationMenu().getMenuItemById(0).enabled=false;
    Menu.getApplicationMenu().getMenuItemById(1).enabled=false;
    Menu.getApplicationMenu().getMenuItemById(2).enabled=false;
});

/*Login Page functions*/

ipcMain.on('login_create',(enent,data)=>{
    if(data.login_create_code==0)
    {   
        var error=AvyuktaEngine.initialize_engine(data.db_dir,data.password);
        if(error.error_code==-1)
        {   
            mainWindow.loadURL(is_dev? 'http://localhost:3000':`file://${path.join(__dirname,"../build/index.html")}`);
            //Menu.getApplicationMenu().getMenuItemById(0).enabled=true;
            Menu.getApplicationMenu().getMenuItemById(1).enabled=true;
            Menu.getApplicationMenu().getMenuItemById(2).enabled=true;
        }
        else
        {   mainWindow.webContents.send('login_create_error',error);}
    }
    else if(data.login_create_code==1)
    {   
        var error=AvyuktaEngine.create_new_odb(data.db_dir,data.file_name,data.password);
        if(error.error_code==1)
        {   mainWindow.webContents.send('login_create_error',error);}
    }
});

ipcMain.on('open_db_picker',(event,todo)=>{
    dialog.showOpenDialog({
        title:'Open Database',
        properties:['openFile'],
        filters: [{ name: 'OSIRIS Database', extensions: ['odb','ODB'] },]
    },
    ).then(function (response) 
    {   
        if (!response.canceled) 
        {
            var file_name=get_filename_from_path(response.filePaths);
            var data={
                'file_name':get_filename_from_path(file_name),
                'file_dir':response.filePaths[0]
            }
            mainWindow.webContents.send('odb_dir',data);
        } 
    });
});

ipcMain.on('open_save_folder_picker',(event,todo)=>{
    dialog.showSaveDialog({
        title:'Save Database',
        filters: [{ name: '.odb OSIRIS Database', extensions: ['odb','ODB'] },]
    },
    ).then(function (response) 
    {   
        if (!response.canceled) 
        {
            console.log(response);
            
            var data={
                'file_name':get_filename_from_path(response.filePath)+".odb",
                'file_dir':response.filePath+".odb"
            }
            mainWindow.webContents.send('odb_dir',data);
        } 
    });
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
            resizable:false,
            icon:electron.nativeImage.createFromPath(__dirname+'/osiris_icon2.png')
        });
        settingsWindow.loadURL(is_dev? 'http://localhost:3000/Settings':`file://${path.join(__dirname,"../build/index.html#/settings")}`);
        settingsWindow.on('closed',()=>settingsWindow=null);
        settingsWindow.setTitle("Settings");
        if(process.env.NODE_ENV==='production')
        {   settingsWindow.setMenu(null);}
    }
}

ipcMain.on('cancelButton:pressed',(event,todo)=>{
    settingsWindow.close();
});

ipcMain.on('get_settings_data',(event,todo)=>{
    var settings_obj=AvyuktaEngine.load_settings();
    settingsWindow.webContents.send('settings_data_received',settings_obj);
});

ipcMain.on('new_settings',(event,data)=>
{
    settingsWindow.close();
    AvyuktaEngine.change_settings(data.nodes_in_one_nodefile,data.relation_in_one_file,data.percent_of_nodes_in_mem,data.encryption_status);
});

/*About window functions and variables*/ 
function startAboutWindow()
{   
    if(aboutWindow===null)
    {
        aboutWindow=new BrowserWindow(
        {
            width:580,//580
            height:360,
            alwaysOnTop: true,
            title: 'Settings',
            webPreferences:
            {   nodeIntegration:true,
                preload: path.join(__dirname, './preload.js'),
                contextIsolation: false 
            },
            resizable:false,
            icon:electron.nativeImage.createFromPath(__dirname+'/osiris_icon2.png')
        });
        aboutWindow.loadURL(is_dev? 'http://localhost:3000/About':`file://${path.join(__dirname,"../build/index.html#/About")}`);
        aboutWindow.on('closed',()=>aboutWindow=null);
        aboutWindow.setTitle("About");
        if(process.env.NODE_ENV==='production')
        {   aboutWindow.setMenu(null);}
    }
}

ipcMain.on('get_about_data',(event,data)=>
{   
    var data={
        version:version.toPrecision(2),
        electron_version:process.versions.electron,
        chrome_version:process.versions.chrome,
        node_version:process.versions.node,
        v8_version:process.versions.v8,
    }
    aboutWindow.webContents.send('get_about_data',data);

});

ipcMain.on('close_about',(event,data)=>
{   aboutWindow.close();});

ipcMain.on('open_link',(event,data)=>
{   electron.shell.openExternal(data);});

/*Menu stuff*/
const mainmenuTemplate=[
    {
        label:'File',
        submenu:[
            /*{
                label:'Settings',
                id:0,
                accelerator:(()=>{
                    if(process.platform==='darwin')
                    {   return 'Command+S';}
                    else
                    {   return 'Ctrl+S';}
                })(),
                click()
                {   startSettingsWindow();}
            },*/
            {
                label:'Change Database Password',
                id:1,
                accelerator:(()=>{
                    if(process.platform==='darwin')
                    {   return 'Command+P';}
                    else
                    {   return 'Ctrl+P';}
                })(),
                click()
                {   mainWindow.webContents.send('change_pass_dialog',"");}
            },
            {
                label:'Close Database',
                id:2,
                accelerator:(()=>{
                    if(process.platform==='darwin')
                    {   return 'Command+C';}
                    else
                    {   return 'Ctrl+C';}
                })(),
                click()
                {  
                    AvyuktaEngine.shutdown_engine();
                    mainWindow.loadURL(is_dev? 'http://localhost:3000/Login':`file://${path.join(__dirname,"../build/index.html#/Login")}`);
                    //Menu.getApplicationMenu().getMenuItemById(0).enabled=false;
                    Menu.getApplicationMenu().getMenuItemById(1).enabled=false;
                    Menu.getApplicationMenu().getMenuItemById(2).enabled=false;
                }
            },
            {
                label:'Quit Application',
                id:3,
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
            /*{
                label:'Documentation',
                id:4,
                click()
                {}
            },*/
            {
                label:'About',
                id:5,
                click()
                {
                    startAboutWindow();
                }
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
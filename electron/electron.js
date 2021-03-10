//test code

//const cpp=require('cppTest');
//const obj1=cpp.initialize_data(2.52,3.45)
//console.log('\nMsg From js= ',obj1.msg);
//console.log('\nresult from js=',obj1.result);

const electron = require('electron')
const path=require('path');
const is_dev=require('electron-is-dev');
const {app, BrowserWindow} = electron;
//console.log('text from js');
app.on('ready', () => {
 let win = new BrowserWindow({width:800, height:600})
 win.loadURL(is_dev? 'http://localhost:3000':`file://${path.join(__dirname,"../build/index.html")}`);
})
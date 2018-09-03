const {app, BrowserWindow} = require('electron');
const path=require('path');
const fs = require("fs");
const os = require("os");
const PDFWindow = require('electron-pdf-window')
const autoUpdater = require('./update');
const ipcMain = require('electron').ipcMain;
var Sails = require('sails').constructor;
var sailsApp = new Sails();
var socket = require('socket.io-client').connect('http://127.0.0.1:1349', { reconnect: true });
 socket.on('connect', function() {
console.log('Connected to server.');
})
var mainWindow;
var print_win;
let type = ''
let pdfname
async function createWindow () {
  app.on('ready',function(){
    const{screen}= require('electron');
    var mainScreen = screen.getPrimaryDisplay();
     var dimensions = mainScreen.size;
     var shouldQuit = makeSingleInstance()
      if (shouldQuit) return app.quit()
      mainWindow = new BrowserWindow({
        width: dimensions.width,
        height: dimensions.height,
        title: "Gstbilling",
        center: true
      });
      mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));
      mainWindow.focus();
      mainWindow.on('closed', function () {
        mainWindow = null
        print_win.close()
      });
  /*mainWindow.webContents.openDevTools();*/
  mainWindow.setMenu(null);
})
  initialize()
}

async function initialize(){
   sailsApp.lift({
    "paths": {
         "public": "assets"
        },
        "appPath":__dirname
     }, function (err) {
  if (err) {
    console.log('Error occurred loading Sails app:', err);
    return;
  }
   console.log('Sails app loaded successfully!');


  subWindow = new BrowserWindow({
    show: false
  });
   subWindow.loadURL('http://localhost:1349')
   subWindow.webContents.on('did-finish-load', function() {
       mainWindow.loadURL('http://localhost:1349')
       subWindow.close()
       print_win = new BrowserWindow({show:false});
   })
});
 }

app.disableHardwareAcceleration();

 app.on('quit', function () {

    sailsApp.lower(
  function (err) {
    if (err) {
      return console.log("Error occurred lowering Sails app: ", err);
    }
     process.exit(err ? 1 : 0);
    console.log("Sails app lowered successfully!");
  }
)
});



app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});


app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});


socket.on('loadurl',function(data){
  console.log(data.url)
   print_win.loadURL(data.url);
})

//print
  ipcMain.on('asynchronous-message', function(event, arg) {
    console.log(arg)
      print_win.webContents.print({silent:true});

})
ipcMain.on('posloadurl', function(event, arg,data,name) {
      print_win.loadURL(arg);
      type = data
      pdfname = name

})


ipcMain.on('printordownload', function(event,arg,data,name) {
  console.log('-----------')
  console.log(name)
  if(data){
    console.log('datais present')
    print_win.loadURL(data);
    type = arg
    pdfname = name
  }
  else if(type!='' && arg === 'done'){
    console.log('its done')
    if(type ==='print'){print_win.webContents.print({silent:true})}else{
      print_win.webContents.printToPDF({pageSize: "Letter", printBackground: true}, function(err, data) {
        const destName = app.getPath("desktop")+ "/" + pdfname+".pdf";

        console.log("Generated PDF at " + destName);
        fs.writeFileSync(destName, data, 'utf8');
        // currentWorker.end( destName );
      });
    }
    type=''
    }

})



function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function () { app.quit() })
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function () { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    createWindow()
}

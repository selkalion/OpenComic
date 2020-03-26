const {app, BrowserWindow, Menu, nativeImage} = require('electron');
const path = require('path');
const url = require('url');
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win, appClosing;

function createWindow () {
	// Create the browser window.

	var mainWindowState = windowStateKeeper({
		defaultWidth: 1200,
		defaultHeight: 880
	});

	var image = nativeImage.createFromPath(path.join(__dirname, '../images/logo.png')); 

	win = new BrowserWindow({
		show: false,
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 320,
		minHeight: 200,
		icon: image,
		webPreferences: {
			nodeIntegration: true
		},
		frame: false,
		titleBarStyle: 'hidden'
		//icon: __dirname + '/icon.svg',
	});

	/*
	var menuTemplate = [
		{
			label: '...',
			submenu: [
				{role: 'reload'},
				{role: 'forceReload'},
				{role: 'toggleDevTools'},
			]
		}
	];

	var menu = Menu.buildFromTemplate(menuTemplate);
	win.setMenu(menu);

	win.removeMenu();
*/
	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, '../templates/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Open the DevTools.
 	// win.webContents.openDevTools()

	win.on('close',	function(event) {

		if(!appClosing)
		{
			appClosing = true;
				
			win.webContents.executeJavaScript('reading.saveReadingProgress();', false).then(function(value) {

				if(!value)
					win.close();
				else // Wait for it to save
					setTimeout(function(win){win.close();}, 200, win);

			});

			event.preventDefault();
		}

	});

	// Emitted when the window is closed.
	win.on('closed',	function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.

		win = null
	});

	win.once('ready-to-show', () => {
		
		win.show();

	})

	mainWindowState.manage(win);
}
	
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

	createWindow();

})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q

	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// Menu
/*
const menuTemplate = [{}];

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)*/
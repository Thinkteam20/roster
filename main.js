const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const connectDb = require("./config/db");
const Log = require("./models/log");
const Cusb = require("./models/customer");

// db connect
connectDb();
let mainWindow;

let isDev = false;

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  isDev = true;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    icon: "./assets/icons/icon.png",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createMainWindow);

// IPC MONGO DB

async function sendLogs() {
  try {
    const logs = await Log.find().sort({ created: 1 });
    mainWindow.webContents.send("logs:get", JSON.stringify(logs));
  } catch (err) {
    console.log(err);
  }
}

async function sendCusb() {
  try {
    const cusb = await Cusb.find().sort({ created: 1 });
    mainWindow.webContents.send("cusb:get", JSON.stringify(cusb));
  } catch (err) {
    console.log(err);
  }
}

ipcMain.on("logs:load", sendLogs);
ipcMain.on("cusb:load", sendCusb);

// create emp
ipcMain.on("logs:emp", async (e, item) => {
  console.log(item);
  try {
    await Log.create(item);
    sendLogs();
  } catch (err) {
    console.log(err);
  }
});
// create cusb
ipcMain.on("cusb:add", async (e, item) => {
  console.log(item);
  try {
    await Cusb.create(item);
    sendCusb();
  } catch (err) {
    console.log(err);
  }
});
// delete emp
ipcMain.on("logs:delete", async (e, _id) => {
  try {
    console.log(_id);
    await Log.findOneAndDelete({ id: _id });
  } catch (err) {
    console.log(err);
  }
});
// update emp
ipcMain.on("logs:update", async (e, _deleteTarget, updated) => {
  try {
    console.log(`delete target id is `, _deleteTarget);
    console.log(`new updates details`, updated);
    await Log.findOneAndUpdate({ id: _deleteTarget }, updated);
  } catch (err) {
    console.log(err);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;

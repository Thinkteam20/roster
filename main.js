const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const connectDb = require("./config/db");
const Log = require("./models/log");
const Log2 = require("./models/log2");
const Cusb = require("./models/customer");
const Event = require("./models/events");
const { constants } = require("buffer");
const { nextTick } = require("process");

// db connect
connectDb().then(console.log("MongoDB connected!")).catch(console.error);
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

// EMPLOY********************************Brisbane = log / Sydney = log2

async function sendLogs() {
  try {
    const logs = await Log.find().sort({ created: 1 });
    mainWindow.webContents.send("logs:get", JSON.stringify(logs));
  } catch (err) {
    console.log(err);
  }
}

async function sendLogs2() {
  try {
    const logs = await Log2.find().sort({ created: 1 });
    mainWindow.webContents.send("logs2:get", JSON.stringify(logs));
  } catch (err) {
    console.log(err);
  }
}

ipcMain.on("logs:load", sendLogs);
ipcMain.on("logs2:load", sendLogs2);

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

ipcMain.on("logs2:emp", async (e, item) => {
  console.log(item);
  try {
    await Log2.create(item);
    sendLogs2();
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

// delete emp2
ipcMain.on("logs2:delete", async (e, _id) => {
  try {
    console.log(_id);
    await Log2.findOneAndDelete({ id: _id });
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on("logs:delete2", async (e, selected) => {
  try {
    console.log(selected);
    await Log.findOneAndDelete(selected);
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

ipcMain.on("logs2:update", async (e, _deleteTarget, updated) => {
  try {
    console.log(`delete target id is `, _deleteTarget);
    console.log(`new updates details`, updated);
    await Log2.findOneAndUpdate({ id: _deleteTarget }, updated);
  } catch (err) {
    console.log(err);
  }
});

// CUSTOMER******************************** Brisbane = cusb / Sydney = cusc
async function sendCusb() {
  try {
    const cusb = await Cusb.find();
    mainWindow.webContents.send("cusb:get", JSON.stringify(cusb));
  } catch (err) {
    console.log(err);
  }
}
ipcMain.on("cusb:load", sendCusb);

// delete cusb
ipcMain.on("cusb:delete", async (e, _id) => {
  try {
    console.log(_id);
    await Cusb.findOneAndDelete({ id: _id });
  } catch (err) {
    console.log(err);
  }
});

// update cusb
ipcMain.on("cusb:update", async (e, _deleteTarget, updated) => {
  try {
    console.log(`delete target id is `, _deleteTarget);
    console.log(`new updates details`, updated);
    await Log.findOneAndUpdate({ id: _deleteTarget }, updated);
  } catch (err) {
    console.log(err);
  }
});

const run = async function (args1, args2) {
  let cusb = await createCusb(args1);
  cusb = await createEvent(cusb._id, args2);
  console.log("\n>> full cusb:\n", cusb);
};

// functions one to many
async function createCusb(customerb) {
  return Cusb.create(customerb).then((docTutorial) => {
    console.log(" Created initial customerb:\n", docTutorial);
    return docTutorial;
  });
}

async function createEvent(customerbId, event) {
  console.log(`Add events`);
  return Cusb.findByIdAndUpdate(
    customerbId,
    {
      $push: {
        event: {
          resourceId: event.resourceId,
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor: event.backgroundColor,
        },
      },
    },
    { new: true, useFindAndModify: false }
  );
}

// find event
ipcMain.on("createCustomer", async function (e, args) {
  // console.log(args);
  // console.log(typeof args[0]);
  // console.log(typeof args[1]);
  run(args[0], args[1]);
  // return Cusb.findById(id).then((event) => {
  //   new Cusb({
  //     event,
  //   }).save();
  // });
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
//

// ********************************************
// run();

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

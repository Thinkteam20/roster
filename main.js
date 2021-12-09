const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const connectDb = require("./config/db");
const Log = require("./models/log");
const Cusb = require("./models/customer");
const Event = require("./models/events");
const { constants } = require("buffer");

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

// EMPLOY********************************

async function sendLogs() {
  try {
    const logs = await Log.find().sort({ created: 1 });
    mainWindow.webContents.send("logs:get", JSON.stringify(logs));
  } catch (err) {
    console.log(err);
  }
}

ipcMain.on("logs:load", sendLogs);

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

// CUSTOMER********************************
async function sendCusb() {
  try {
    const cusb = await Cusb.find().sort({ created: 1 });
    mainWindow.webContents.send("cusb:get", JSON.stringify(cusb));
  } catch (err) {
    console.log(err);
  }
}
ipcMain.on("cusb:load", sendCusb);

// find event
ipcMain.on("createCustomer", async function (e, args) {
  console.log(args);

  // return Cusb.findById(id).then((event) => {
  //   new Cusb({
  //     event,
  //   }).save();
  // });
});

// functions one to many
async function createCusb(customerb) {
  return Cusb.create(customerb).then((docTutorial) => {
    console.log(" Created customerb:\n", docTutorial);
    return docTutorial;
  });
}

async function createEvent(customerbId, event) {
  console.log(event);
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

const run = async function () {
  let cusb = await createCusb({
    site: "LVIIII",
    roles: "Auditorium O",
    location: "123CBD",
    id: "0",
  });

  cusb = await createEvent(cusb._id, {
    resourceId: "0",
    title: "지원,창수",
    start: "2021-12-09T11:30:00Z",
    end: "2021-12-09T12:30:00Z",
    backgroundColor: "red",
  });
  console.log("\n>> full cusb:\n", cusb);

  cusb = await createEvent(cusb._id, {
    resourceId: "1",
    title: "Mina",
    start: "2021-12-09T11:30:00Z",
    end: "2021-12-09T12:30:00Z",
    backgroundColor: "blue",
  });
};

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
run();

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

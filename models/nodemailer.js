const nodemailer = require("nodemailer");
const path = require("path");

const sendEmail = () => {
  let stmpTransport = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "tankteam20@outlook.com",
      pass: "mxmxMaster2s1223@",
    },
  });

  let mailOptions = {
    from: "tankteam20@outlook.com", // sender address
    to: "tankteam20@gmail.com", // my mail
    subject: `Iffice Roster This Week`, // Subject line
    text: "Please check your Roster", // plain text body
    // html: params.html, // html body
    attachments: [
      {
        filename: "weekly-roster-iffice.pdf", // <= Here: made sure file name match
        path: path.join(
          "/Users/sangpiljung/Downloads/weekly-roster-iffice.pdf"
        ), // <= Here
        contentType: "application/pdf",
      },
    ],
  };

  stmpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error while sending mail: " + error);
    } else {
      console.log("Message sent: %s", info.messageId);
    }
    stmpTransport.close(); // shut down the connection pool, no more messages.
  });
};

module.exports = { sendEmail };

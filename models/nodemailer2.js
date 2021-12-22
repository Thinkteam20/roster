const nodemailer = require("nodemailer");
const path = require("path");

const sendEmail2 = (email) => {
  let stmpTransport = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "tankteam20@outlook.com",
      pass: "mxmxMaster2s1223@",
    },
  });

  let mailOptions = {
    from: "tankteam20@outlook.com", // sender address
    to: email, // my mail
    subject: `Iffice Roster This Week`, // Subject line
    text: "Please check your Roster", // plain text body
    // html: params.html, // html body
    attachments: [
      {
        filename: "weekly-roster-iffice-Sydney.pdf", // <= Here: made sure file name match
        path: path.join(
          "/Users/sangpiljung/Downloads/weekly-roster-iffice-Sydney.pdf"
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

module.exports = { sendEmail2 };

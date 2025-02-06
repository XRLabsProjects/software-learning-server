import express from "express";
import cors from "cors";
import {
  getSoftwareData,
  getFilteredSoftwareData,
  checkAccessKeyValidity,
  addData,
} from "./mongoConnection.js";

import isEmail from "validator/lib/isEmail.js";
import nodemailer from "nodemailer";
// TODO: CREATE A TABLE THAT GETS UPDATED ON DATA ENTRY

const app = express();
const port = process.env.DB_PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Server received call to path /");
  res.send("Server is ready");
});

app.get("/api/getSoftwareData", async (req, res) => {
  console.log("Server received call to path /api/getSoftwareData");
  const data = await getSoftwareData();
  const outputData = [];
  data.forEach((doc) => {
    outputData.push({
      companyName: doc.companyName,
      capacityForUse: doc.capacityForUse,
      country: doc.country,
      field: doc.field,
      softwareUsed: doc.softwareUsed,
      otherSoftwareUsed: doc.otherSoftwareUsed,
      year: doc.year,
    });
  });
  res.send(outputData);
});

app.post("/api/getFilteredSoftwareData", async (req, res) => {
  console.log("Server received call to path /api/getFilteredSoftwareData");
  const data = await getFilteredSoftwareData(req.body);
  const outputData = [];
  data.forEach((doc) => {
    outputData.push({
      companyName: doc.companyName,
      capacityForUse: doc.capacityForUse,
      country: doc.country,
      field: doc.field,
      softwareUsed: doc.softwareUsed,
      otherSoftwareUsed: doc.otherSoftwareUsed,
      year: doc.year,
    });
  });
  res.send(outputData);
});

app.post("/api/checkAccessKey", async (req, res) => {
  console.log("Server received call to path /api/checkAccessKey");
  const isKeyValid = await checkAccessKeyValidity(req.body.key.toUpperCase());
  res.send(isKeyValid);
});

app.post("/api/addData", async (req, res) => {
  console.log("Server received call to path /api/addData");
  const response = await addData(req.body);
  res.send(true);
});

app.post("/api/sendEmail", async (req, res) => {
  console.log("Server received call to path /api/sendEmail");
  const { name, email, message } = req.body;
  if (!name || !email || !message || !isEmail(email)) {
    res.send(false);
  } else {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // use false for STARTTLS; true for SSL on port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Software Learning Contact Form: ${name}`,
      text: `Sender: ${name}\nEmail: ${email}\n\nContents: ${message}`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Failed to send email due to server error");
        res.send(false);
      } else {
        console.log("Successfully sent email");
        return res.send(true);
      }
    });

    res.send(true);
  }
});

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});

import express from "express";
import cors from "cors";
import {
  getSoftwareData,
  getFilteredSoftwareData,
  checkAccessKeyValidity,
  addData,
} from "./mongoConnection.js";

// TODO: CREATE A TABLE THAT GETS UPDATED ON DATA ENTRY

const app = express();
const port = process.env.PORT;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.get("/api/getSoftwareData", async (req, res) => {
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
  const isKeyValid = await checkAccessKeyValidity(req.body.key.toUpperCase());
  res.send(isKeyValid);
});

app.post("/api/addData", async (req, res) => {
  const response = await addData(req.body);
  res.send(true);
});

app.listen(port, () => {
  console.log(`Server at https://209.38.30.213:${port}`);
});

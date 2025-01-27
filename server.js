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
const port = process.env.DB_PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
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

app.listen(port, () => {
  console.log(`Server at https://209.38.30.213:${port}`);
});

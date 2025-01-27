import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const databaseName = process.env.DB_NAME;
const uri = process.env.DB_URI;

export async function getSoftwareData() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    const connection = await client.connect();
    const database = await connection.db(databaseName);
    return await database
      .collection("softwareusers")
      .find({
        softwareUsed: { $exists: true },
      })
      .toArray();
  } catch {
    console.log(
      `Failed to connect -- ${databaseName}  whilst trying to get software data`,
    );
    await client.close();
  }
}

export async function getFilteredSoftwareData(query) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // console.log(query);
    const queryObject = Object.assign({}, ...query);
    const connection = await client.connect();
    const database = await connection.db(databaseName);
    return await database
      .collection("softwareusers")
      .find(queryObject)
      .toArray();
  } catch {
    console.log(
      `Failed to connect -- ${databaseName}  whilst trying to get software data`,
    );
    await client.close();
  }
}

export async function checkAccessKeyValidity(keyToQuery) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    const connection = await client.connect();
    const database = await connection.db(databaseName);
    const result = await database
      .collection("accesskeys")
      .findOne({ key: keyToQuery });
    return result != null;
  } catch {
    console.log(
      `Failed to connect -- ${databaseName} whilst trying to check key validity`,
    );
    await client.close();
  }
}

export async function addData(data) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    const connection = await client.connect();
    const database = await connection.db(databaseName);
    await database.collection("softwareusers").insertOne({
      companyName: data.companyName,
      capacityForUse: data.capacityForUse,
      country: data.country,
      field: data.field,
      softwareUsed: data.softwareUsed,
      otherSoftwareUsed: data.otherSoftwareUsed,
      year: data.year,
    });
    return true;
  } catch {
    console.log(
      `Failed to connect -- ${databaseName} whilst trying to check key validity`,
    );
    await client.close();
  }
  return false;
}

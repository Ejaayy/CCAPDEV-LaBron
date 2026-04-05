import { MongoClient } from "mongodb";

async function test() {
  const client = new MongoClient(
    "mongodb+srv://painganedrienejames_db_user:Test1234%21@labkoto.aj20gaj.mongodb.net/LabKoToDB?retryWrites=true&w=majority"
  );
  try {
    await client.connect();
    console.log("✅ Connected to Atlas!");
  } catch (e) {
    console.error("❌ Connection failed:", e);
  } finally {
    await client.close();
  }
}

test();
// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data = initData.data.map((obj) => ({...obj, owner: "6565acbfeb1edd0a08a4c619"}));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");
}

main().catch((err) => console.error(err));

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("🗑️ All old listings removed");

    const USER_ID = "68283d3023dd4afe4452b7c2"; // ✅ your real user ID

    const listingsWithOwner = initData.data.map((listing) => ({
      ...listing,
      owner: USER_ID,
      geometry: {
        type: "Point",
        coordinates: [77.209, 28.6139], // dummy coordinates (Delhi, India)
      },
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔒 MongoDB connection closed");
  }
};

initDB();


const { MongoClient } = require("mongodb");
 
const url = "mongodb+srv://sarasegel:NY%253z%26EN%402k%23S5T1@yelpcamp.owjlv.mongodb.net/yelpcamp?retryWrites=true";

const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

run().catch(console.dir);
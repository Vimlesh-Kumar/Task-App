const { MongoClient, ObjectId } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        // Establish and verify connection
        await client.db("task-manager").collection('user').updateOne({
            _id: new ObjectId("63f5ded07382fc6f15e153f2")
        },
            {
                $set: { name: 'Ram Shyam' }
            }           
        ).then((result)=>
        {
            console.log(result)
        }).catch((error)=>
        {
            console.log(error)
        })
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

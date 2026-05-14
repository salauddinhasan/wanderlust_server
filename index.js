const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URL;

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    
    const db = client.db('wanderlust')
    const destinationCollection = db.collection('destination')
    const bookingCollection = db.collection('booking')

    app.get('/destination', async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    })

    app.post('/destination', async (req, res) => {
      const destinationData = req.body
      console.log(destinationData)
      const result = await destinationCollection.insertOne(destinationData)
      res.json(result);
    });

    app.get('/destination/:id', async (req, res) => {
      const {id} = req.params
      const result = await destinationCollection.findOne({_id: new ObjectId(id)});
      res.json(result);
    })

    app.patch('/destination/:id', async(req, res) => {
      const {id} = req.params;
      const updateData = req.body

      const result = await destinationCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updateData})

      res.json(result);
    })

    app.delete('/destination/:id', async(req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
      res.json(result);
    })

    app.post('/booking', async(req, res) => {
      const bookingData = req.body
      const result= await bookingCollection.insertOne(bookingData)
      res.json(result);
    })

    app.get('/booking/:userid', async(req, res) => {
      const {userid} = req.params;

      const result = await bookingCollection.find({userid: userid}).toArray();
      res.json(result);
    })
     app.delete('/booking/:bookingId', async(req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)})
      res.json(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello dev World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

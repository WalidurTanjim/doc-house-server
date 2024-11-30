const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('./cloudinary/cloudinary');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.a1a1zbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collections
    const usersCollection = client.db('DocHouse').collection('users');
    const doctorsCollection = client.db('DocHouse').collection('doctors');

    // users related api
    app.get('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    })

    app.get('/users', async(req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })

    // doctors related api
    app.get('/doctors/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await doctorsCollection.findOne(query);
        res.send(result);
    });

    app.get('/doctors', async(req, res) => {
        const result = await doctorsCollection.find().toArray();
        res.send(result);
    });

    app.post('/doctors', async(req, res) => {
      const doctor = req.body;
      const result = await doctorsCollection.insertOne(doctor);
      res.send(result);
    })

    app.delete('/doctors/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await doctorsCollection.deleteOne(query);
        res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Doc House server is running...');
})

app.post('/', async(req, res) => {
  const { image } = req.body;
  cloudinary.uploader
      .upload(image, {
          upload_preset: "images_preset",
          allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp']
      })
      .then(result => {
          console.log(result);
          res.status(200).send(result);
      })
});


app.listen(port, () => {
    console.log(`Doc House server is running...`);
});
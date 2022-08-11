const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4wajp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// middleware
app.use(cors());
app.use(express.json());


async function run() {
  try {
    const database = client.db('camera_essential');
    const ProductsCollection = database.collection('products');
    const reviewsCollection = database.collection('reviews');
    const purchasesCollection = database.collection("purchase");
    const usersCollection = database.collection("users");
    // const ordersCollection = database.collection("orders");

    //   GET PRODUCT 
    app.get("/products", async (req, res) => {
      const cursor = ProductsCollection.find({})
      const products = await cursor.toArray()
      res.json(products)

    })

    app.get("/products/query", async (req, res) => {
      const limit = req.query.limit;
      // console.log(limit)
      const number = parseInt(limit);
      const cursor = ProductsCollection.find({});
      const result = await cursor.limit(number).toArray();
      res.json(result);

    })
    // GET REVIEWS
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })
  
    // specific get find single service/purchase
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const purchaseProduct = await ProductsCollection.findOne(query);
      res.json(purchaseProduct);
    })

    //   POST PRODUCT
    app.post("/products", async (req, res) => {
      const product = req.body;
      // console.log("hit the post",product);
      const result = await ProductsCollection.insertOne(product);

      res.json(result);
      // console.log(result);

    })
    // POST REVIEWS
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      // console.log("post review the hitted", reviews);
      const result = await reviewsCollection.insertOne(reviews);
      // console.log(result);
      res.json(result);
    })
    // POST PURCHASE
    app.post("/purchase", async (req, res) => {
      const order = req.body;
      // console.log("post the hitted", purchase)
      const result = await purchasesCollection.insertOne(order);
      res.json(result);
    })

    app.get("/purchase", async (req, res) => {
      const result = await purchasesCollection.find({}).toArray();
      res.send(result);
    })

    // specific Get PURCHASE

    app.get("/purchase/:email", async (req, res) => {
      const cursor = await purchasesCollection.find({ email: req.params.email }).toArray();
      res.send(cursor);
    })
    //  delete api
    app.delete("/purchase/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await purchasesCollection.deleteOne(query);
      console.log("deleting order with id", result);
      res.json(result);;
    })

// =============================== admin level access try============================


app.post('/users', async (req, res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  console.log('hit the post')
  console.log(result);
  res.json(result)
})





    console.log("database connected");
  }

  finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('This is my server')
})

app.listen(port, () => {
  console.log(`Running the server on port ${port}`)
})
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsnxkgc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const laptopBrandsCollection = client.db('resellia').collection('laptopBrands')
        const usersCollection = client.db('resellia').collection('users')

        app.get('/laptopBrands', async(req, res) =>{
            const query = {};
            const options = await laptopBrandsCollection.find(query).toArray();
            res.send(options);
        });

        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        
    }
    finally{

    }

}
run().catch(console.log);

app.get('/', async(req, res) =>{
    res.send('resellia server is running');
})

app.listen(port, () => console.log(`Resellia server is running on ${port}`));
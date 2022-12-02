const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next){
    console.log('token', req.headers.authorization);
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).sent('unauthorized access')
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
}


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

        app.get('/jwt', async(req, res) =>{
            const email= req.query.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '2days'})
                return res.send({accessToken: token});
            }
            console.log(user);
            res.status(403).send({accessToken: ''})
        })

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
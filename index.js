const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zvviljv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'unAuthorized access' })
    }
    const token = query.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, function (err, decoded) {
        if (err) {
            res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next()
    })
}

async function run() {
    try {
        const servicesCollection = client.db('serviceReview').collection('services');
        const serviceTypeCollection = client.db('serviceReview').collection('serviceType');
        const UserReviewCollection = client.db('serviceReview').collection('UserReview');
        const addServiceCollection = client.db('serviceReview').collection('addService');


        app.post('/jwt', (req, res) => {
            const user = req.body;

            const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1h' })
            res.send({ token });
        })


        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const result = await cursor.limit(3).toArray()
            res.send(result);
        })


        app.get('/allServices', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })
        app.get('/allServices/:id', async (req, res) => {
            const id = req.params.id;
            const objectId = { _id: ObjectId(id) }
            const cursor = await servicesCollection.findOne(objectId);
            res.send(cursor);
        })

        app.post('/allServices/:id', async (req, res) => {
            const query = req.body;
            const cursor = await UserReviewCollection.insertOne(query);
            res.send(cursor);
        })

        app.get('/serviceType', async (req, res) => {
            const query = {}
            const cursor = serviceTypeCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })
        app.get('/reviewAdd', async (req, res) => {
            const query = {};
            const cursor = UserReviewCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/reviewAdd/:id', async (req, res) => {
            const id = req.params.id;
            const objectId = { _id: ObjectId(id) }
            const cursor = UserReviewCollection.deleteOne(objectId);
            res.send(cursor)
        })

        app.post('/reviewAdd', async (req, res) => {
            const query = req.body;
            const result = await UserReviewCollection.insertOne(query);
            res.send(result)
        })

        app.get('/addService', async (req, res) => {
            const query = {};
            const cursor = addServiceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/addService', async (req, res) => {
            const query = req.body;
            const cursor = await addServiceCollection.insertOne(query)
            res.send(cursor)
        })
    }
    catch (error) {
        console.log(error);
    }
}

run().catch(e => console.error(e))


app.get('/', (req, res) => {
    res.send('server start');
})

app.listen(port, () => {
    console.log(`server open the port ${port}`);
})


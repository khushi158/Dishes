const express=require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const {run,client}=require('./database');
const bodyParser = require('body-parser');

const uri = "mongodb+srv://khushibanchhor21:k2nOGNriuWW6Caih@cluster0.ruqg5zq.mongodb.net/";

const app=express();
app.use(cors());
const PORT=8000;


app.listen(PORT)


// establishing the database connection

run();
app.use(bodyParser.json());


app.get('/',async (req,res)=>{
    console.log("home");
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("Alldishes");
        const collection = database.collection("dish");

        // Fetch data from the collection
        const data = await collection.find({}).toArray();

        console.log(data);
        res.status(200).json(data); // Send data as JSON response

    } catch (error) {
        console.error("Error connecting to the database or fetching data:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
})

app.post('/postdata',async function(req,res){
    const client = new MongoClient(uri);
    let a = req.body;


    try {
        await client.connect();
        const database = client.db("Alldishes");
        const collection = database.collection("dish");
        let food=await collection.insertMany(a);
        let b = await (collection.find({}).toArray());
        console.log(b);
        res.send(food);
        
    }
    catch(err){
    console.log(err);
    res.status(500).send("Internal Server Error");
    }

})



app.post('/update/:dishId', async function(req, res) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("Alldishes");
        const collection = database.collection("dish");

        // Get dish ID from request parameters
        const dishId = req.params.dishId;
        console.log(dishId, "disssssssssh id");
        // Find the dish by ID
        const dish = await collection.findOne({dishId:dishId});

        if (!dish) {
            return res.status(404).send("Dish not found");
        }

        // Toggle the isPublished status
        const updatedDish = await collection.updateOne(
            { dishId:dishId },
            { $set: { isPublished: !dish.isPublished } }
        );

        res.status(200).json(updatedDish); // Send result as JSON response

    } catch (error) {
        console.error("Error connecting to the database or updating data:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});


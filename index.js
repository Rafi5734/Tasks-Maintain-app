const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 2000;
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

app.use(cors());
app.use(express.json());

//user = My-Tasks-Manager
//password = 4qbVAx3W7muFRLoL

//MongoDb Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8cqdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const TasksDatabase = client.db("Tasks");
        const AllTasksCollection = TasksDatabase.collection("all-tasks");
        // create a document to insert
        app.post("/tasks", async (req, res) => {
            const myTask = req.body;
            // console.log(req);
            const result = await AllTasksCollection.insertOne(myTask);
            res.json(result);
        });

        //GET API requests
        app.get("/tasks", async (req, res) => {
            const status = req.query.status;
            const query = { status: status };
            // if (status) {
            // }
            const cursor = await AllTasksCollection.find(query).toArray();
            res.json(cursor);
        });

        // get specific id

        app.get("/update/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateItem = await AllTasksCollection.findOne(query);
            res.send(updateItem);
        });

        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(req);
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status,
                },
            };
            const result = await AllTasksCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("i am from node");
});

app.listen(port, () => {
    console.log("listening on port " + port);
});

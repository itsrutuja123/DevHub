const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
var ObjectId = require('mongodb').ObjectId;

dotenv.config();
const uri = process.env.MONGO_URL;

if (!uri) {
    console.error("MONGO_URL not found in environment variables.");
    process.exit(1);
}

// To set up connection
let client;
async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
}

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db('Devhub'); // To access the database
        const usersCollection = db.collection("users");
        const users = await usersCollection.find({}).toArray(); // Returns collection of array
        res.json(users);
    } catch (err) {
        console.error("Ohh No! Error during fetching ", err.message,":(");
        res.status(500).send("Oops! Server error");
    }
}

const signup = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        await connectClient();
        const db = client.db('Devhub'); // To access the database
        const usersCollection = db.collection("users");

        // Check if user already exists
        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Opps! User already exists!"});
        }

        // Encrypt user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starredRepos: [],
        };

        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.send({ token, userId: result.insertedId  });
    } catch (err) {
        console.error("Ohh No! Error during signup", err.message);
        res.status(500).send("Oops! Server error");
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db('Devhub'); // To access the database
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Sorry! Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
        if (!isMatch) {
            return res.status(404).json({ message: "Sorry! Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error("Ohh No! Error during login:", err.message,":(");
        res.status(500).send("Oops! Server Error");
    }
}

async function getUserProfile(req, res) {
    const currentID = req.params.id; // Corrected req.param.id to req.params.id
    try {
        await connectClient();
        const db = client.db('Devhub'); // To access the database
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID), // Convert string ID to MongoDB ObjectId
        });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" }); // Stop further execution
        }

        // Send the response as a success message after user is found
        res.send(user); // Return the "Profile fetched" message
    } catch (err) {
        console.error("Ohh No! Error during login:", err.message,":(");
        res.status(500).send("Oops! Server Error");
    }
}

async function updateUserProfile (req, res) {
    const currentID=req.param.id;
    const {email,password}=req.body;
    try{
        await connectClient();
        const db = client.db('Devhub'); // To access the database
        const usersCollection = db.collection("users");
        let updateField={email};
        if(password){
            const salt =await bcrypt.genSalt(10);
            const hashedPassword =await bcrypt.hash(password,salt);
            updateField.password=hashedPassword;
        }
        const result = await usersCollection.findOneAndUpdate({
            _id: new ObjectId(currentID) 
        },{$set:updateField},
        {returnDocument:"after"});
        if(!result.value){
            return res.status(404).json({message:"User Not Found"});
        }
        res.send(result.value);
    }
    catch(err){
        console.error("Ohh No! Error during login:",err.message,":(");
        res.status(500).send("Oops! Server Error!");
    }
    
};

async function deleteUserProfile (req, res) {
    
    try{
        await connectClient();
        const db = client.db('Devhub'); // To access the database
        const usersCollection = db.collection("users");
        const currentID=req.param.id;
        const result = await usersCollection.deleteOne({_id: new ObjectId(currentID) });
        if(!result.deleteCount==0){
            return res.status(404).json({message:"User not Found"});
        }
        res.json({message:"User Profile Deleted"});



    }
    catch(err){
        console.error("Ohh No! Error during login:",err.message,":(");
        res.status(500).send("Oosp! Server Error!");
    }

};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};

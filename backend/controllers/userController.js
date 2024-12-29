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
        console.error("Error during fetching ", err.message);
        res.status(500).send("Server error");
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
            return res.status(400).json({ message: "User already exists" });
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

        res.send({ token });
    } catch (err) {
        console.error("Error during signup", err.message);
        res.status(500).send("Server error");
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
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server Error");
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
        console.error("Error during login:", err.message);
        res.status(500).send("Server Error");
    }
}

const updateUserProfile = (req, res) => {
    res.send("Profile updated");
};

const deleteUserProfile = (req, res) => {
    res.send("Profile deleted");
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};
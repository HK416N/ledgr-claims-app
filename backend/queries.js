/*-------------------------------- Starter Code --------------------------------*/

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { faker } = require("@faker-js/faker");

const User = require("./models/User");
const Category = require("./models/Category");
const Receipt = require("./models/Receipt");

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    await runQueries();

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit();
};

connect();
/*-------------------------------- Query Functions --------------------------------*/

// Create a demo user
const createUser = async () => {
    const user = await User.create({
        name: "Demo User",
        email: "demo@example.com",
        hashedPassword: bcrypt.hashSync("Password123", 10),
    });
    console.log("User created: ", user);
    return user;
};

//create categories
const createCategories = async (user) => {
    const categories = await Category.create([
        {
            name: "Meals",
            userId: user._id,
        },
        {
            name: "Travel",
            userId: user._id,
        },
        {
            name: "Software Subscriptions",
            userId: user._id,
        },
    ]);
    console.log("Categories created: ", categories);
    return categories;
}

//create receipt
const createReceipts = async (user, categories) => {
    const [meals, travel, software] = categories; //relook at this

    const receipts = await Receipt.insertMany([
        {
            userId: user._id,
            receiptNumber: "INV-8801",
            date: new Date("2026-04-01"),
            totalOriginal: 320.00,
            currencyOriginal: "MYR",
            description: "Client lunch",
            location: "OVERSEAS",
            categoryId: meals._id,
            exchange: {
                fxRate: 0.2980,
                convertedAmount: 95.36,
                fxSource: "API",
                conversionDate: new Date("2026-04-01"),
            },
        },
        {
            userId: user._id,
            receiptNumber: "5678912",
            date: new Date("2026-03-28"),
            totalOriginal: 892.80,
            currencyOriginal: "SGD",
            description: "Office supplies",
            location: "SINGAPORE",
            categoryId: software._id,
            exchange: {
                fxRate: 1.0000,
                convertedAmount: 892.80,
                fxSource: "MANUAL",
                conversionDate: new Date("2026-03-28"),
            },
        },
        {
            userId: user._id,
            receiptNumber: "1234567",
            date: new Date("2026-03-26"),
            totalOriginal: 699.00,
            currencyOriginal: "USD",
            description: "AWS subscription",
            location: "OVERSEAS",
            categoryId: software._id,
            exchange: {
                fxRate: 1.2858,
                convertedAmount: 898.78,
                fxSource: "API",
                conversionDate: new Date("2026-03-26"),
            },
        },
        {
            userId: user._id,
            receiptNumber: "INV-8802",
            date: new Date("2026-03-30"),
            totalOriginal: 24.50,
            currencyOriginal: "SGD",
            description: "Grab to airport",
            location: "SINGAPORE",
            status: "COMPLETE",
            categoryId: travel._id,
            exchange: {
                fxRate: 1.0000,
                convertedAmount: 24.50,
                fxSource: "MANUAL",
                conversionDate: new Date("2026-03-30"),
            },
        },
        {
            userId: user._id,
            receiptNumber: "INV-8803",
            date: new Date("2026-04-03"),
            totalOriginal: 210.00,
            currencyOriginal: "MYR",
            description: "Team dinner",
            location: "OVERSEAS",
            categoryId: meals._id,
            exchange: {
                fxRate: 0.2980,
                convertedAmount: 62.58,
                fxSource: "API",
                conversionDate: new Date("2026-04-03"),
            },
        },
    ]);
    console.log("Receipts created: ", receipts);
    return receipts;
};


const runQueries = async () => {
    //delete existing data
    await Receipt.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({ email: "demo@example.com" });


    console.log("Queries running.");

    //create new data
    const newUser = await createUser();
    const categories = await createCategories(newUser);
    await createReceipts(newUser, categories);
};
/*-------------------------------- Starter Code --------------------------------*/

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

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

const createUser = async () => {
    const user = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        hashedPassword: "hashedpassword123",
    });
    console.log("User created: ", user);
    return user;
}


const createCategories = async (user) => {
    const categories = await Category.create([
        {
            name: "Travel",
            userId: user._id,
        },
        {
            name: "Food",
            userId: user._id,
        },
        {
            name: "Office Supplies",
            userId: user._id,
        },
    ]);
    console.log("Categories created: ", categories);
    return categories;
}

const createReceipt = async (user, categories) => {

    const totalOriginal = faker.finance.amount({ min: 10, max: 1000, dec: 2 });
    const fxRate = faker.finance.amount({ min: 0.5, max: 1.5, dec: 4 });

    const receipts = await Receipt.create(
        {
            userId: user._id,
            receiptNumber: faker.string.numeric(10),
            date: faker.date.past(),
            totalOriginal: totalOriginal,
            currencyOriginal: faker.finance.currencyCode(),
            tax: faker.finance.amount({ min: 0, max: 100, dec: 2 }),
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(['PENDING', 'COMPLETE']),
            categoryId: categories[faker.number.int({ min: 0, max: categories.length - 1 })]._id,
            exchange: {
                fxRate: fxRate,
                fxSource: faker.helpers.arrayElement(['API', 'MANUAL']),
                convertedAmount: totalOriginal * fxRate,
                conversionDate: faker.date.past(),
            }
        }
    );
    console.log("Receipts created: ", receipts);
    return receipts;
}


const runQueries = async () => {
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log("Queries running.");

    const newUser = await createUser();
    const categories = await createCategories(newUser);
    await createReceipt(newUser, categories);
};
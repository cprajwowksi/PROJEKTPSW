const PORT = 8000

const express = require('express')
const { MongoClient, ObjectId  } = require('mongodb')
const  {v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require('cors')
const app = express()

app.use(cors());
app.use(express.json());


const uri = 'mongodb+srv://smaczniutkietosty:mypassword@cluster0.oxudjvz.mongodb.net/?retryWrites=true&w=majority'
app.get('/', (req, res) => {
    res.json('Hello to my app')
})
app.post('/signup', async (req, res) => {

    const client = new MongoClient(uri)
    const { email, password } = req.body
    const generatedUserId = uuidv4()
    const hashedpassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const existingUser = await users.findOne({email})
        if (existingUser){
            return res.status(409).send('User already exists. Please login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id:generatedUserId,
            email:sanitizedEmail,
            hashed_password:hashedpassword
        }
        console.log(data, "lool")
        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,
        })
        res.status(201).json({token, userId: generatedUserId, email: sanitizedEmail})
    } catch (err) {
        console.log(err)
    }
})

app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

    try {
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const user = await users.findOne({email})

        const correctPassword = await bcrypt.compare(password, user.hashed_password)
        console.log("Raczej nikogo takiego ine ma ale chociaz sie wysyla")
        if (user && correctPassword) {
            const token = jwt.sign(
                user,
                email,
                {expiresIn: 60 * 24})
            console.log(token)
            return res.status(201).json({token, userId: user.user_id, email})
        }
        return res.status(400).send('Invalid')

    } catch (err) {
        console.log(err)
    }


})
app.get('/users',async (req, res) => {
    const client = new MongoClient(uri)

    try{
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)

    } finally {
        await client.close()
    }
})

app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId
    try{
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const query = { user_id: userId }
        const user = await users.findOne(query)
        res.send(user)
    } finally {
        await client.close()
    }
})

app.get('/users/search', async (req, res) => {
    const client = new MongoClient(uri)
    const regex = req.query.pattern;
    console.log(regex)
    try{
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const regexQuery = { first_name: { $regex: regex, $options: 'i' } };
        const user = await users.find(regexQuery).toArray()
        console.log(user)
        res.send(user)
    } finally {
        await client.close()
    }
});
app.delete('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId
    console.log(userId)
    try{
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const query = { user_id: userId }
        const user = await users.deleteOne(query)
        console.log('deleted', user)
        res.send(user)
    } finally {
        await client.close()
    }
})
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.values
    try {

        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')

        const query = { user_id: formData.user_id }
        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                gender_identity: formData.gender_identity,
                adres: {
                    ulica: formData.ulica,
                    miasto: formData.miasto,
                    numer: formData.numer
                }
            }
        }
        const insertedUser = await users.updateOne(query, updateDocument)
        res.send(insertedUser)
    } finally {
        await client.close()
    }
})

app.patch('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.values
    console.log(formData)
    try {

        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')

        const query = { user_id: formData.user_id }
        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                gender_identity: formData.gender_identity,
                adres: {
                    ulica: formData.ulica,
                    miasto: formData.miasto,
                    numer: formData.numer
                }
            }
        }
        const modifiedUser = await users.updateOne(query, updateDocument)
        res.send(modifiedUser)
    } finally {
        await client.close()
    }
})

app.get('/opinie', async (req, res) => {
    const client = new MongoClient(uri)
    const foodId = req.query.foodId
    if (foodId !== undefined){
    try{
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('food')
        const query = { _id: new ObjectId(foodId) };
        const opinie = await users.findOne(query, { projection: { "_id": 0, "opinie": 1 } });
        res.send(opinie.opinie)
    } finally {
        await client.close()
    }
    }
})

app.post('/opinia', async (req, res) => {
    const client = new MongoClient(uri)
    const formattedOpinia = req.body.params.formattedOpinia
    if (formattedOpinia !== undefined){
        try{
            await client.connect()
            const database = client.db('Panda')
            const foods = database.collection('food')
            const opiniaBezFoodId = { ...formattedOpinia };
            delete opiniaBezFoodId.foodId;
            const result = await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $push: { opinie: opiniaBezFoodId } }
            );            // res.send(opinie.opinie)

            console.log(result)
        } finally {
            await client.close()
        }
    }
})

app.delete('/opinia', async (req, res) => {
    const client = new MongoClient(uri)
    const formattedOpinia = req.body.formattedOpinia
    if (formattedOpinia !== undefined){
        try{
            await client.connect()
            const database = client.db('Panda')
            const foods = database.collection('food')
            console.log(formattedOpinia)
            const opiniaBezFoodId = { ...formattedOpinia };
            delete opiniaBezFoodId.foodId;
            const result = await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $pull: { opinie: opiniaBezFoodId } }
            );            // res.send(opinie.opinie)

            console.log(result)
        } finally {
            await client.close()
        }
    }
})

app.put('/opinia', async (req, res) => {
    const client = new MongoClient(uri)
    const formattedOpinia = req.body.data.formattedOpinia
    const drugaOpinia = req.body.data.drugaOpinia
    console.log(formattedOpinia, drugaOpinia)
    if (formattedOpinia !== undefined){
        try{
            await client.connect()
            const database = client.db('Panda')
            const foods = database.collection('food')
            console.log(formattedOpinia)
            const opiniaBezFoodId = { ...formattedOpinia };
            delete opiniaBezFoodId.foodId;
            const opinia2 = { ...drugaOpinia}
            delete opinia2.foodId;

            await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $pull: { opinie: opiniaBezFoodId } }
            );

            const dodaj = await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $push: { opinie: opinia2 } }
            );
            // res.send(opinie.opinie)

            console.log(dodaj)
        } finally {
            await client.close()
        }
    }
})
app.get('/food', async (req, res) => {
    const client = new MongoClient(uri)
    const type = req.query.type
    try{
        await client.connect()
        const database = client.db('Panda')
        const foods = database.collection('food')
        const query = { type: type }
        const opinie = await foods.find(query).toArray()

        res.send(opinie)
    } finally {
        await client.close()
    }
})


app.post('/zamowienie', async (req, res) => {
    const client = new MongoClient(uri)
    const zamowienie = req.body.data
    try{
        await client.connect()
        const database = client.db('Panda')
        const zamowienia = database.collection('Zamowienia')
        const insertedZamowienie = await zamowienia.insertOne(zamowienie)
        console.log(insertedZamowienie)
        res.send(insertedZamowienie)

    } finally {
        await client.close()
    }
})

app.get('/messages',async (req, res) => {
        const client = new MongoClient(uri)
        const userId = req.query.userId
        const toId = req.query.toId
        try{
            await client.connect()
            const database = client.db('Panda')
            const messages = database.collection('messages')

            const query = {
                from_id: userId,
                to_id:toId
            }

            const foundMessages = await messages.find(query).toArray()
            res.send(foundMessages)
        } finally {
            await client.close()
        }
    }
)

app.post('/messages', async(req ,res) => {
    const client = new MongoClient(uri)
    const message = req.body.data.message
    console.log(message)
    try {
        await client.connect()
        const database = client.db('Panda')
        const messages = database.collection('messages')
        const insertedmessage = await messages.insertOne(message)
        res.send(insertedmessage)

    } finally {
        await client.close()
    }
})

app.delete('/message', async (req, res) => {
    const client = new MongoClient(uri);
    const messageId = req.body.message._id;

    try {
        await client.connect();
        const database = client.db('Panda');
        const messages = database.collection('messages');
        const deletedMessage = await messages.deleteOne({ _id: new ObjectId(messageId) });

        res.send(deletedMessage);
    } finally {
        await client.close();
    }
});

app.put('/message', async (req, res) => {
    const client = new MongoClient(uri);
    const editedMessage = req.body.data.edited
    const messageId = req.body.data.message._id;
    try {
        await client.connect();
        const database = client.db('Panda');
        const messages = database.collection('messages');
        await messages.deleteOne({ _id: new ObjectId(messageId) });
        const edited = await messages.insertOne(editedMessage)
        res.send(edited);
    } finally {
        await client.close();
    }
});

app.listen(PORT,
    () => console.log(`Server running on port ${PORT}`))




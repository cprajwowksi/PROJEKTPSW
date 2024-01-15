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

app.put('/user', async (req, res) => {
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
        const insertedUser = await users.updateOne(query, updateDocument)
        res.send(insertedUser)
    } finally {
        await client.close()
    }
})





app.listen(PORT,
    () => console.log(`Server running on port ${PORT}`))




const PORT = 8000

const express = require('express')
const { MongoClient, ObjectId  } = require('mongodb')
const cors = require('cors')
const app = express()
let session = require('express-session');
let { NodeAdapter} = require("ef-keycloak-connect");
const config = require(`./keycloak.json`);
const keycloak = new NodeAdapter(config)

app.use(cors())

app.use(session({
    secret: 'secret1',
    resave: false,
    saveUninitialized: true,
}));

app.use( keycloak.middleware({ logout: '/logout' }))
app.use(express.json());
app.get('/hello', keycloak.protect(), (req, res) => {
    console.log('Home accessed..');
    res.send('Hello World');
});

const uri = 'mongodb+srv://smaczniutkietosty:mypassword@cluster0.oxudjvz.mongodb.net/?retryWrites=true&w=majority'

// app.post('/signup', async (req, res) => {
//
//     const client = new MongoClient(uri)
//     const { email, password } = req.body
//     const generatedUserId = uuidv4()
//     const hashedpassword = await bcrypt.hash(password, 10)
//
//     try {
//         await client.connect()
//         const database = client.db('Panda')
//         const users = database.collection('users')
//         const existingUser = await users.findOne({email})
//         if (existingUser){
//             return res.status(409).send('User already exists. Please login')
//         }
//
//         const sanitizedEmail = email.toLowerCase()
//
//         const data = {
//             user_id:generatedUserId,
//             email:sanitizedEmail,
//             hashed_password:hashedpassword
//         }
//         const insertedUser = await users.insertOne(data)
//
//         const token = jwt.sign(insertedUser, sanitizedEmail, {
//             expiresIn: 60 * 24,
//         })
//         res.status(201).json({token, userId: generatedUserId, email: sanitizedEmail})
//     } catch (err) {
//         console.log(err)
//     }
// })
//
// app.post('/login', async (req, res) => {
//     const client = new MongoClient(uri)
//     const { email, password } = req.body
//     try {
//         await client.connect()
//         const database = client.db('Panda')
//         const users = database.collection('users')
//         const user = await users.findOne({email})
//         if (!user) {
//             res.status(404).send('Podano zly email lub haslo')
//             return
//         }
//         const correctPassword = await bcrypt.compare(password, user.hashed_password)
//         if (user && correctPassword) {
//             const token = jwt.sign(
//                 user,
//                 email,
//                 {expiresIn: 60 * 24})
//             return res.status(201).json({token, userId: user.user_id, email})
//         }
//         return res.status(404).send('Podano zly email lub haslo')
//
//     } catch (err) {
//         console.log(err)
//     }
// })

app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)

    try{
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
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
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
        await client.close()
    }
    }
})

app.post('/opinia', keycloak.protect(), async (req, res) => {
    const client = new MongoClient(uri)
    const formattedOpinia = req.body.params.formattedOpinia
    if (formattedOpinia !== undefined){
        try{
            await client.connect()
            const database = client.db('Panda')
            const foods = database.collection('food')
            const opiniaBezFoodId = { ...formattedOpinia };
            delete opiniaBezFoodId.foodId;
            await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $push: { opinie: opiniaBezFoodId } }
            );
            res.status(200).send('Wstawiono')

        } catch {
            res.status(400).send('Blad przy wstawianiu')
        }finally {
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
            const opiniaBezFoodId = { ...formattedOpinia };
            delete opiniaBezFoodId.foodId;
            await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $pull: { opinie: opiniaBezFoodId } }
            );
            res.status(200).send("Usunięto")
        } catch {
            res.status(404).send("Nie ma takiej opinii")
        }finally {
            await client.close()
        }
    }
})

app.put('/opinia', keycloak.protect(), async (req, res) => {
    const client = new MongoClient(uri)
    const formattedOpinia = req.body.data.formattedOpinia
    const drugaOpinia = req.body.data.drugaOpinia
    if (formattedOpinia !== undefined){
        try{
            await client.connect()
            const database = client.db('Panda')
            const foods = database.collection('food')
            const opiniaBezFoodId = { ...formattedOpinia };
            delete opiniaBezFoodId.foodId;
            const opinia2 = { ...drugaOpinia}
            delete opinia2.foodId;
            await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $pull: { opinie: opiniaBezFoodId } }
            );
            await foods.updateOne(
                { _id: new ObjectId(formattedOpinia.foodId) },
                { $push: { opinie: opinia2 } }
            );
            res.send('Zmieniono')
        } catch {
            res.status(400).send('Problem z polaczeniem.')
        }finally {
            await client.close()
        }
    }
})
app.get('/food', async (req, res) => {
    console.log('przyznano')
    const client = new MongoClient(uri)
    const type = req.query.type
    try{
        await client.connect()
        const database = client.db('Panda')
        const foods = database.collection('food')
        const query = { type: type }
        const opinie = await foods.find(query).toArray()
        res.send(opinie)
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
        await client.close()
    }
})

app.delete('/food', keycloak.protect('realm:admin'), async (req, res) => {
    const client = new MongoClient(uri)
    const foodId = req.body._id
    try{
        await client.connect()
        const database = client.db('Panda')
        const foods = database.collection('food')
        const query = { _id: new ObjectId(foodId)}
        const result = await foods.deleteOne(query)
        if (result.deletedCount === 1) {
            res.status(200).send('Potrawa została pomyślnie usunięta');
        } else {
            res.status(404).send('Nie udało się usunąć potrawy');
        }
    } catch {
        res.status(500).send('Problem przy usuwaniu potrawy')
    } finally {
        await client.close()
    }
})
app.post('/food', keycloak.protect('realm:admin'), async(req ,res) => {
    const client = new MongoClient(uri)
    const food = req.body.data.formattedValues
    try {
        await client.connect()
        const database = client.db('Panda')
        const foods = database.collection('food')
        const instertedFood = await foods.insertOne(food)
        res.send(instertedFood)
    } finally {
        await client.close()
    }
})

app.post('/zamowienie', keycloak.protect(), async (req, res) => {
    const client = new MongoClient(uri)
    const zamowienie = req.body.data
    zamowienie.type = 0
    try {
        await client.connect()
        const database = client.db('Panda')
        const zamowienia = database.collection('Zamowienia')
        const result = await zamowienia.insertOne(zamowienie)
        if (result.acknowledged && result.insertedId) {
            res.status(201).send('Zamówienie zostało pomyślnie dodane.');
        } else {
            res.status(400).send('Nie udało się dodać zamówienia.');
        }
    } catch (error) {
        console.error('Error during insertion:', error)
        res.status(400).send('Wystąpił problem podczas przetwarzania zamówienia.')
    } finally {
        await client.close()
    }
})

app.get('/zamowienie', keycloak.protect('realm:admin'), async (req, res) => {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        console.log('zamow')
        const database = client.db('Panda')
        const zamowienia = database.collection('Zamowienia')
        const result = await zamowienia.find().toArray()
        res.send(result)
    } catch (error) {
        console.error('Error during insertion:', error)
        res.status(400).send('Wystąpił problem podczas przetwarzania zamówienia.')
    } finally {
        await client.close()
    }
})

app.put('/zamowienie/increment', keycloak.protect('realm:admin'), async (req, res) => {
    const client = new MongoClient(uri);
    const _id = req.body.data._id;
    try {
        console.log('zwiekszylem')
        await client.connect();
        const database = client.db('Panda');
        const zamowienia = database.collection('Zamowienia');
        const query = { _id: new ObjectId(_id) };

        const existingOrder = await zamowienia.findOne(query);
        if (!existingOrder) {
            return res.status(404).send('Nie znaleziono zamówienia o podanym _id.');
        }
        const updatedType = existingOrder.type + 1;
        const result = await zamowienia.updateOne(query, { $set: { type: updatedType } });
        if (result.modifiedCount === 1) {
            res.send(`Zaktualizowano zamówienie ${_id}, nowy type: ${updatedType}`);
        } else {
            res.status(400).send('Nie udało się zaktualizować zamówienia.');
        }
    } catch (error) {
        console.error('Błąd podczas aktualizacji zamówienia:', error);
        res.status(400).send('Wystąpił problem podczas przetwarzania zamówienia.');
    } finally {
        await client.close();
    }
});

app.get('/zamowienie/moje', keycloak.protect(), async (req, res) => {
    const client = new MongoClient(uri)
    const username = req.query.username
    try {
        await client.connect()
        console.log('moje')
        const database = client.db('Panda')
        const zamowienia = database.collection('Zamowienia')
        const result = await zamowienia.find({username: username}).toArray()
        res.send(result)
    } catch (error) {
        console.error('Error during insertion:', error)
        res.status(400).send('Wystąpił problem podczas przetwarzania zamówienia.')
    } finally {
        await client.close()
    }
})
app.listen(PORT,
    () => console.log(`Server running on port ${PORT}`))




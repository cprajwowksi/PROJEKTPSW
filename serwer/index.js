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
        if (!user) {
            res.status(404).send('Podano zly email lub haslo')
            return
        }
        const correctPassword = await bcrypt.compare(password, user.hashed_password)
        if (user && correctPassword) {
            const token = jwt.sign(
                user,
                email,
                {expiresIn: 60 * 24})
            return res.status(201).json({token, userId: user.user_id, email})
        }
        return res.status(404).send('Podano zly email lub haslo')

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
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
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
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
        await client.close()
    }
})

app.get('/users/search', async (req, res) => {
    const client = new MongoClient(uri)
    const regex = req.query.pattern;
    try{
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const regexQuery = { first_name: { $regex: regex, $options: 'i' } };
        const user = await users.find(regexQuery).toArray()
        res.send(user)
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
        await client.close()
    }
});

app.delete('/user', async (req, res) => {
    const client = new MongoClient(uri);
    const userId = req.query.userId;

    try {
        await client.connect();
        const database = client.db('Panda');
        const users = database.collection('users');

        const result = await users.deleteOne({ user_id: userId });
        if (result.deletedCount === 1) {
            res.status(200).send('Użytkownik został pomyślnie usunięty');
        } else {
            res.status(404).send('Nie udało się usunąć użytkownika');
        }
    } catch (error) {
        console.error('Błąd podczas operacji na bazie danych:', error);
        res.status(500).send('Wystąpił błąd podczas usuwania użytkownika');
    } finally {
        await client.close();
    }
});
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.values
    try {
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const query = { user_id: formData.user_id }
        const found = await users.findOne(query);
        if (!found) {
            res.status(404).send('Nie znaleziono użytkownika');
            return;
        }
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
        const result = await users.updateOne(query, updateDocument);
        if (result.modifiedCount === 1) {
            res.status(200).send('Dane użytkownika zostały pomyślnie zaktualizowane');
        } else {
            res.status(500).send('Wystąpił problem podczas aktualizacji danych użytkownika');
        }
    } catch (error) {
        console.error('Błąd podczas operacji na bazie danych:', error);
        res.status(500).send('Wystąpił błąd podczas aktualizacji danych użytkownika');
    } finally {
        await client.close();
    }
})
app.patch('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.values
    try {
        await client.connect()
        const database = client.db('Panda')
        const users = database.collection('users')
        const query = { user_id: formData.user_id }
        const found = await users.findOne(query);
        if (!found) {
            res.status(404).send('Nie znaleziono użytkownika');
            return;
        }
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
        const result = await users.updateOne(query, updateDocument);
        if (result.modifiedCount === 1) {
            res.status(200).send('Dane użytkownika zostały pomyślnie zaktualizowane');
        } else {
            res.status(500).send('Wystąpił problem podczas aktualizacji danych użytkownika');
        }
    } catch (error) {
        console.error('Błąd podczas operacji na bazie danych:', error);
        res.status(500).send('Wystąpił błąd podczas aktualizacji danych użytkownika');
    } finally {
        await client.close();
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

app.put('/opinia', async (req, res) => {
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

app.delete('/food', async (req, res) => {
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
app.post('/food', async(req ,res) => {
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
app.post('/zamowienie', async (req, res) => {
    const client = new MongoClient(uri)
    const zamowienie = req.body.data
    try {
        await client.connect()
        const database = client.db('Panda')
        const zamowienia = database.collection('Zamowienia')
        const result = await zamowienia.insertOne(zamowienie)
        if (result.insertedCount === 1) {
            res.status(201).send('Zamowienie zostało pomyślnie dodane.')
        } else {
            res.status(400).send('Nie udało się dodać zamówienia.')
        }
    } catch (error) {
        console.error('Error during insertion:', error)
        res.status(400).send('Wystąpił problem podczas przetwarzania zamówienia.')
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
        } catch {
            res.status(400).send('Nie udalo sie polaczyc')
        }finally {
            await client.close()
        }
    }
)

app.post('/messages', async(req ,res) => {
    const client = new MongoClient(uri)
    const message = req.body.data.message
    try {
        await client.connect()
        const database = client.db('Panda')
        const messages = database.collection('messages')
        const result = await messages.insertOne(message)
        if (result.insertedCount === 1) {
            res.status(201).send('Zamowienie zostało pomyślnie dodane.')
        } else {
            res.status(400).send('Nie udało się dodać zamówienia.')
        }
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
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
        const result = await messages.deleteOne({ _id: new ObjectId(messageId) });
        if (result.deletedCount === 1) {
            res.status(201).send('Zamowienie zostało pomyślnie dodane.')
        } else {
            res.status(400).send('Nie udało się dodać zamówienia.')
        }
    } catch {
        res.status(400).send('Nie udalo sie polaczyc')
    }finally {
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
        const result = await messages.insertOne(editedMessage)
        if (result.insertedCount === 1) {
            res.status(201).send('Zamowienie zostało pomyślnie zmienione.')
        } else {
            res.status(400).send('Nie udało się zmienić zamówienia.')
        }
    } catch {
        res.status(400).send('Nie udało sie połączyć')
    }finally {
        await client.close();
    }
});

app.listen(PORT,
    () => console.log(`Server running on port ${PORT}`))




const PORT = 8000

const axios = require('axios')
const express = require('express')
const { MongoClient, ObjectId  } = require('mongodb')
const cors = require('cors')
const app = express()
let session = require('express-session');

app.use(cors());

app.use(session({
    secret: 'secret1',
    resave: false,
    saveUninitialized: true,
}));

  
const keycloakBaseUrl = process.env.KEYCLOAK_HOST_URL || 'http://keycloak:8080';

const realmName = 'panda-realm'
const clientSecret = "oQ3sdG7Rc39bBz8XkdAsOlfVqVqFUTya"
const clientId = "express-app"

function protect(role = null) {
    return async (req, res, next) => {
      const jwtToken = req.headers.authorization.split(" ")[1];
      console.log(jwtToken)
      try {
        const introspectUrl = `${keycloakBaseUrl}/realms/${realmName}/protocol/openid-connect/token/introspect`;
        console.log(introspectUrl)
        const params = new URLSearchParams();
        params.append("token", jwtToken);
        params.append("client_id", clientId);
        params.append("client_secret", clientSecret);
        
        const response = await axios.post(introspectUrl, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        console.log(response)
        
        if (response.data.active) {
          const roles = response.data.realm_access.roles;
          if (role === null) {
            next();
          } else if (roles.includes(role)) {
            next();
          } else {
            return res.status(403).json({ error: "Brak uprawnień" });
          }
        } else {
          return res.status(401).json({ error: "Nieprawidłowy token JWT" });
        }
      } catch (error) {
        console.error("Błąd podczas introspekcji tokena:", error);
        return res
          .status(500)
          .json({ error: "Błąd serwera podczas weryfikacji tokena" });
      }
    };
  }
app.use(express.json());
app.get('/hello', protect(), (req, res) => {
    console.log('Home accessed..');
    res.send('Hello World');
});

const username = 'root';
const password = 'pass1234';

const host = process.env.DB_HOST_URL || 'mymongo';


const uri = `mongodb://${username}:${password}@${host}:27017/Panda?authSource=admin`;

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

app.get('/opinie', protect(), async (req, res) => {
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

app.post('/opinia', protect(), async (req, res) => {
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

app.put('/opinia', protect(), async (req, res) => {
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

app.delete('/food', protect("admin"), async (req, res) => {
    const client = new MongoClient(uri)
    const foodId = req.body.food._id

    try{
        await client.connect()
        const database = client.db('Panda')
        const foods = database.collection('food')
        const query = { _id: new ObjectId(foodId)}
        const result = await foods.deleteOne(query)
        console.log(result.deletedCount)
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
app.post('/food', protect("admin"), async(req ,res) => {
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

app.post('/zamowienie', protect(), async (req, res) => {
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

app.get('/zamowienie', protect("admin"), async (req, res) => {
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

app.put('/zamowienie/increment', protect("admin"), async (req, res) => {
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

app.get('/zamowienie/moje', protect(), async (req, res) => {
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

app.post('/post', protect("admin"), async (req, res) => {
    const client = new MongoClient(uri)
    const post = req.body.data
    console.log(post)
    try {
        await client.connect()
        const database = client.db('Panda')
        const posty = database.collection('Posty')
        const result = await posty.insertOne(post)
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


app.delete('/post', protect("admin"), async (req, res) => {
    const client = new MongoClient(uri)
    console.log(req)
    const post = req.body._id
    try {
        console.log('usuw')
        await client.connect()
        const database = client.db('Panda')
        const posty = database.collection('Posty')
        const query = { _id: new ObjectId(post) };

        const result = await posty.deleteOne(query)
        console.log(result.deletedCount)
        if (result.deletedCount === 1) {
            res.status(203).send('Zamówienie zostało pomyślnie usunięte.');
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

app.get('/post', async (req, res) => {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const database = client.db('Panda')
        const posty = database.collection('Posty')
        const result = await posty.find({}).toArray()
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




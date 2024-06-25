#!/bin/bash

echo "Importowanie pliku Posty do MongoDB..."
mongoimport  --username ${MONGO_INITDB_ROOT_USERNAME} --password ${MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin --db $MONGO_DB_NAME --file Posty.json

echo "Importowanie pliku zamowienia do MongoDB..."
mongoimport  --username ${MONGO_INITDB_ROOT_USERNAME} --password ${MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin --db $MONGO_DB_NAME --file Zamowienia.json

echo "Importowanie pliku food do MongoDB..."
mongoimport  --username ${MONGO_INITDB_ROOT_USERNAME} --password ${MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin --db $MONGO_DB_NAME --file food.json

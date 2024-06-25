FROM mongo

WORKDIR /bazamongo

COPY ./bazamongo/*.json .
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=pass1234
ENV MONGO_DB_NAME=Panda

COPY ./bazamongo/skrypt.sh /docker-entrypoint-initdb.d

EXPOSE 27017

CMD ["mongod"]
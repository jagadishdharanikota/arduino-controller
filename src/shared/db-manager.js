import mongodb from 'mongodb';
const { MongoClient } = mongodb;
import promise from 'promise';
import logger from './logger.js';

class DBManager {
  constructor() {
    this.connection = null;
    this.connect();
    this.registerCloseConnection();
  }

  async connect() {
    const { MONGODB_URI, MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

    if (MONGODB_URI && MONGODB_USERNAME && MONGODB_PASSWORD) {
      const connect = MongoClient.connect(MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        promiseLibrary: promise,
        auth: {
          user: MONGODB_USERNAME,
          password: MONGODB_PASSWORD,
        },
      });

      try {
        this.connection = await connect;
        this.db = this.connection.db('appinno');
        logger.info(`Connect to MongoDB with URI: ${MONGODB_URI}`);
        return this.db;
      } catch (error) {
        const { code, message, reason } = error;
        logger.error(
          `Failed to connect to MongoDB. ${code} : ${message}. Reason: ${reason}`,
          error.stack
        );
        await this.connection.close();
        return null;
      }
    }
    logger.error(`Cannot connect to MongoDB with the URI: ${MONGODB_URI}`);
    return null;
  }

  registerCloseConnection() {
    process.on('SIGINT', () => {
      this.db = null;
      this.connection.close();
      logger.info('Successfully closed mongodb connection');
    });
  }

  insert(collectionName, data) {
    if (this.db) {
      return this.db.collection(collectionName).insertOne(data);
    }
    return promise.reject('Cannot connect to the database');
  }

  // Update the document with matched query
  update(collectionName, query, data) {
    if (this.db) {
      return this.db.collection(collectionName).updateOne(query, { $set: data });
    }
    return promise.reject('Cannot connect to the database');
  }

  // Replace the entire document with matched query
  replace(collectionName, query, data) {
    if (this.db) {
      return this.db.collection(collectionName).replaceOne(query, data);
    }
    return promise.reject('Cannot connect to the database');
  }

  find(collectionName, ...params) {
    const [query, options = {}] = params;
    if (this.db) {
      return this.db.collection(collectionName).find(query, options).toArray();
    }
    return promise.reject('Cannot connect to the database');
  }

  aggregate(collectionName, query) {
    if (this.db) {
      return this.db.collection(collectionName).aggregate(query).toArray();
    }
    return promise.reject('Cannot connect to the database');
  }

  recordCount(collectionName, query) {
    if (this.db) {
      return this.db.collection(collectionName).countDocuments(query);
    }
    return promise.reject('Cannot connect to the database');
  }
}

export default new DBManager();

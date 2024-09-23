import { createConnection } from "mongoose";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine the environment and select the appropriate database connection string
const dbConnectionUrl = process.env.NODE_ENV === 'test'
    ? process.env.DB_CONNECTION_TEST
    : process.env.DB_CONNECTION_PROD;

if (!dbConnectionUrl) {
    console.error("Database connection string is not set.");
    process.exit(1);
}

// Establish a connection to the MongoDB database using Mongoose
export const conn = createConnection(dbConnectionUrl);

import dotenv from "dotenv";
import {Pool} from 'pg'

dotenv.config();

const pool = new Pool
({
    user: process.env.DB_USER,
    port:Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
})


export default pool;

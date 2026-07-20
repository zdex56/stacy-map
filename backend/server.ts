import { error } from 'node:console';
import pool from './db'
import express, {type Express,type Request,type Response} from "express";

const app : Express = express();

app.use(express.json());

const port = 3000;



app.get('/', (reg:Request,res:Response)=>
{
    res.send("привееет ура хост работает23");
}
)

app.listen(port, () => {
    console.log(`захостились на порту ${port}`)
})


app.post('/', (req: Request, res: Response) => {
  res.send('поше, post');
});

app.get('/lol', (req:Request, res:Response) => {res.send("л2ол")})


app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "не удалось получить пользователей" });
  }
});





app.post('/users', async (req,res) => 
{
  try
  {
    const { name, number } = req.body;

    const result = await pool.query
    ('INSERT INTO users (name,number )values ($1,$2) returning *',[name,number])
    res.status(201).json({message:"пользователь успешно создан",user:result.rows[0]});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: "не удалось создать пользователя"})
  }
}
)

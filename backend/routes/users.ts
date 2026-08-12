
import pool from '../db'
import { Router, type Request, type Response } from 'express';
const router = Router();





router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } 
  catch (err) 
  {
    console.error(err)
    res.status(500).json({error: "не удалось получить пользователей" });
  }
});



router.post('/', async (req: Request, res: Response) => 
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


export default router;
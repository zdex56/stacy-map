import dotenv from "dotenv";
import { error } from 'node:console';
import pool from '../db'
import { json, Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { hash } from 'node:crypto';
import jwt ,{ JsonWebTokenError, Jwt } from 'jsonwebtoken';
import strict from "node:assert/strict";
import UserMiddleware from "../middleware/UserMiddleware";
import { request } from "node:https";
const router = Router();

// bcrypt просто потому что уже работал с ним мне привычно




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


router.post('/registration', async (req:Request, res:Response) =>
{

  const {name,username,pass} = req.body;

  const hashedpass = await bcrypt.hash(pass,10)

  try{
    const alreadyuser = await pool.query

    ('select username from users where username = $1',[username])
    if (alreadyuser.rows.length > 0)
    {
      res.status(500).json({message:'такой юз уже есть'})
      return 
    }


    const result = await pool.query
    
    ('INSERT INTO users values (default,$1,$2,$3) RETURNING name',[name,username,hashedpass])
    res.status(201).json({message:'пользователь успешно создан',user:result.rows[0]})
  }
  catch(err)
  {
    console.error(err)
    res.status(500).json({error:'ошибка при попытке регистрации'})
  }
}
)


router.post('/login',async(req:Request,res:Response) =>
  {
  const {username,pass} = req.body;
  try
  {
  // AWAIT НЕ ЗАБЫВАЙ  AWAIT НЕ ЗАБЫВАЙ AWAIT НЕ ЗАБЫВАЙ AWAIT AWAIT НЕ ЗАБЫВАЙ 
  const result = await pool.query
  ('select name,password,user_id from users where username = $1',[username])

  if (result.rows.length === 0)
  {
    res.status(400).json({mess:"неверный логин или пароль"})
    return null
  }
  let compare = await bcrypt.compare(pass,result.rows[0].password)
  if (!compare)
  {
    res.status(400).json({mess:"неверный логин или пароль"})
    return null
  }

  let token = jwt.sign
  (
    {
      user_id : result.rows[0].user_id,
      name:result.rows[0].name,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h"
    }
    
  )
  res.status(200).json({mess:"успешно",token:token,name:result.rows[0].name})

  }
  catch(err)
  { 
    console.error(err)
    res.status(500).json({error:"ошибка"})
  }
  }
  )


  
  





router.get('/myname',UserMiddleware,async (req:Request,res:Response)=>
{
  try
  {
    const result = await pool.query
    ('select name from users where user_id = $1',[req.user.user_id])
    res.status(200).json({message:'на',name:result.rows[0].name})
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json({message:'ошибка на этапе роута'})
  }

}
)

router.get('/usertask',UserMiddleware, async (req:Request,res:Response)=>
{
try
{
  let result = await pool.query
  ('select points.point_id, points.lat,points.lng,description from points join userpoints on points.point_id  = userpoints.point_id  where userpoints.user_id=$1',[req.user.user_id])
  
  
  
  res.status(200).json({result:result.rows})
}
catch(err)
{
  console.log(err)
  console.log('писька')
  res.status(500).json({message:'ошибка при попытке получить задачи'})
}
})

export default router;


router.delete('/delPoint',UserMiddleware, async(req:Request,res:Response)=>
{
  try
  {
    let point_id = req.body.Point_id
    let result1 = await pool.query
    ('DELETE FROM userpoints WHERE point_id = $1',[point_id]) 
    let result2 = await pool.query
    ('DELETE FROM points WHERE point_id = $1',[point_id])
res.status(200).json({ message: 'ok' })
  }
  catch(err)
  {
    console.log(err)
  }
}
)

router.post('/addPoint',UserMiddleware,async(req:Request,res:Response) =>
{
try
{
let {lat,lng} = req.body
let pointResult = await pool.query
('insert into points values (default,null,$1,$2) returning point_id',[lat,lng])
let point_id = await pointResult.rows[0].point_id
let userpoinsRetult = await pool.query
('insert into userpoints values ($1,$2)',[req.user.user_id,point_id])

res.status(200).json({message:'получилось'})
}
catch(err)
{
console.log(err)
} 
}
)
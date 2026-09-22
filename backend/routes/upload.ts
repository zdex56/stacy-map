import multer from 'multer'
import path from 'path'
import fs from 'fs'

import pool from '../db';

import express, {type Express,type Request,type Response,json, Router,NextFunction} from "express";
import { time, timeStamp } from 'node:console';
import UserMiddleware from '../middleware/UserMiddleware';
const app : Express = express();



const router = Router();



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}-${req.user.user_id}${path.extname(file.originalname)}`;
    cb(null, name);
  },
});
const upload = multer({ storage });



// ------------------------------------------------------------------------------------ позор роутам
router.get('/', async(req:Request,res:Response) =>
{
try
{

    res.status(200).json({message:"удачный тест",time:`${timeStamp()}`,alo:'ало сука'})
}
catch(err)
{console.log(err)}
}
)


router.post('/upload', UserMiddleware, upload.single('avatar'), async function (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'файл не загружен' });
      return;
    }

    const newFilename = req.file.filename; 

    let old = await pool.query("select icon from users where user_id=$1", [req.user.user_id]);

    let folder = './uploads';
    let files = fs.readdirSync(folder);

  
    if (files.includes(`${old.rows[0].icon}`)) {
      let del = path.join(folder, `${old.rows[0].icon}`);
      if (del = 'default.jpg')
      {
        console.log('не буду удалять')
      }
      else
      {
        fs.unlinkSync(del);
      }
    } 
    else {
      console.log('не получилось удалить стару аву');
    }

    await pool.query("UPDATE users SET icon = $1 WHERE user_id = $2", [newFilename, req.user.user_id]);
    res.status(200).json({ iconid: newFilename });
  } catch (err) {
    console.log(err);
  }
});

export default router;
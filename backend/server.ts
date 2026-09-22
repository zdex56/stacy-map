import usersRoutes from './routes/users'
import upload from './routes/upload'
import './routes/upload'
import cors from 'cors'

import express, {type Express,type Request,type Response} from "express";

const app : Express = express();
app.use(express.json());
app.use(cors())
const port = 3000;



app.use('/users', usersRoutes);
app.use('/upload',upload)


app.use('/icon', express.static('uploads'));

app.get('/', (req: Request, res: Response)=>
{
    // res.send("привееет ура хост работает23");
    const test = "hello"
    res.json({lol:test});
}
)

app.listen(port, () => {
    console.log(`захостились на порту ${port}`)
})




app.get('/lol', (req:Request, res:Response) => {res.send("л2ол")})

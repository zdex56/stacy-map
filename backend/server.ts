import usersRoutes from './routes/users'


import express, {type Express,type Request,type Response} from "express";


const app : Express = express();
app.use(express.json());
const port = 3000;



app.use('/users', usersRoutes);


app.get('/', (req: Request, res: Response)=>
{
    res.send("привееет ура хост работает23");
}
)

app.listen(port, () => {
    console.log(`захостились на порту ${port}`)
})




app.get('/lol', (req:Request, res:Response) => {res.send("л2ол")})

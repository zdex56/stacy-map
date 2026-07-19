

import govno, {type Express,type Request,type Response} from "express";

const app : Express = govno();
const port = 3000;


app.get('/', (reg:Request,res:Response)=>
{
    res.send("привееет ура хост работает23");
}
)

app.listen(port, () => {
    console.log(`захостились на порту ${port}`)
})
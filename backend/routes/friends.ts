import express, {type Express,type Request,type Response,json, Router,NextFunction} from "express";
import UserMiddleware from "../middleware/UserMiddleware";
import pool from "../db";

const router = Router()

// добавить
// ПРОВЕРКУ НА СЕБЯ !

// удалить
// получить список друзей



router.post('/add',UserMiddleware, async(req:Request,res:Response) =>
{
try
{
let user_id = req.user.user_id
let {friend_id} = req.body


let check_already = await pool.query('select id,status from friends where requester_id = $1 and addressee_id = $2',[user_id,friend_id])
console.log('данные которые суем '+user_id,friend_id)

if (user_id === friend_id)
{
    return res.status(400).json({message:'нельзя самому себе'})
}

if (check_already.rows.length > 0)
{
    let status = check_already.rows[0].status
    
    if (status == 'accepted') return res.status(200).json({message:'вы уже друзья'})
    if (status == 'send') return res.status(200).json({message:'ты уже отправил заявку, дождись'})
    if (status == 'declined') return res.status(200).json({message:'он не хочет с вами дружить'})
    
}



let check_id = await pool.query('select id,status from friends where requester_id = $1 and addressee_id = $2',[friend_id,user_id])

if (check_id.rows.length > 0)
{
    let status = check_id.rows[0].status

    if (status == 'accepted') return res.status(200).json({message:'вы уже друзья'})
    if (status == 'send' ) 
    {
    await pool.query('update friends set status = $2 where id = $1',[check_id.rows[0].id,'accepted'])
    return res.status(200).json({message:'у него тоже была заявка! теперь вы друзя'})
    }
    if (status ==='declined')
    {
        await pool.query('update friends set status = $2 where id = $1',[check_id.rows[0].id,'send'])
        return res.status(200).json({message:'отправил заявку ему'})

    }
}


let result = await pool.query('insert into friends values (default,$1,$2,$3)',[user_id,friend_id,'send'])
res.status(200).json({message:'заявка отправлена'})
}   
catch(err)
{console.error(err)
            res.status(500).json({message:'ошибка на сервере'})
}
}
)

router.get('/get', UserMiddleware,async(req:Request,res:Response) => // настрой возврат данных, нужен friend id
{
    try
    {
    let user_id = req.user.user_id

    const zaproz = `select u.name,id from friends f 
        join users u 
        on u.user_id  = case when f.requester_id = $1 then f.addressee_id else f.requester_id end
        where (f.requester_id =$1 or f.addressee_id =$1)`

    let accepted = await pool.query(`${zaproz} and f.status = $2`,[user_id,'accepted'])

    let declined = await pool.query(`${zaproz} and f.status = $2`,[user_id,'declined'])

    let send = await pool.query(`select u.name,id from friends f 
        join users u 
        on u.user_id  = case when f.requester_id = $1 then f.addressee_id else f.requester_id end
        where (f.requester_id =$1) and f.status = $2`,[user_id,'send'])

    let incoming = await pool.query(`select u.name,id from friends f
join users u on u.user_id = f.requester_id 
where (f.addressee_id = $1) and f.status = $2`,[user_id,'send'])    
    res.status(200).json({friends:accepted.rows, send:send.rows, declined:declined.rows,incoming:incoming.rows})
}
catch(err)
{console.error(err)
    res.status(500).json({message:'ошибка на сервере'})
}
}
)


router.delete('/delete', UserMiddleware, async(req:Request,res:Response) =>
    {
        try
        {
            let user_id = req.user.user_id
            let {friend_id} = req.body

            let result = await pool.query(`update friends set status = $3 where 
            (requester_id = $1 and addressee_id = $2) or (requester_id = $2 and addressee_id = $1) returning id`,[user_id,friend_id,'declined'])

                if (result.rowCount === 0)
                {
                    return res.status(400).json({'пользователи не найдены'})
                }
            res.status(200).json({message:'успешно удалено'})
        }
        catch(err)
        {
            console.log(err)
            res.status(500).json({message:'ошибка на сервере'})
        }
        
    }
)


router.post('/accept',UserMiddleware,async(req:Request,res:Response) =>
{
    try
    {
        let user_id = req.user.user_id
        let {send_id} = req.body
        let result = await pool.query('update friends set status = $2 where id = $1 and addressee_id = $3 returning id',[send_id,'accepted',user_id])

                if (result.rowCount === 0)
                {
                    return res.status(400).json({'пользователи не найдены'})
                }

        res.status(200).json({message:'теперь вы друзья :3'})



    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({message:'ошибка на сервере'})
    }
}
)

export default router;



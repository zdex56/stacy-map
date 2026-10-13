import { useEffect, useState } from 'react';
import styles from './Friends.module.css'
import type { Friends_User } from '../../interface/test';
import { URL } from '../../config';
import { data } from 'react-router-dom';
// id заявки, id друга, его имя юз иконку

// const response = await fetch(`${URL}/users/myname`,
// {headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')}})
// const data = await response.json() на будущее





function Friends()
{
let [friends,setFriends] = useState<Friends_User[]>([])
let [send,setSend] = useState<Friends_User[]>([])
let [incoming,setIncoming] = useState<Friends_User[]>([])
let [message,setMessage] = useState('')

useEffect(()=>{
let load = async () =>
{
    let result = await fetch(`${URL}/friends/get`,
        {
            headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')}
        }
    )
    let data = await result.json()
    setFriends(data.friends)
    console.log('подрузка успешн',data)
}
load()
},[])

async function addFriend(friend_id:number) {
    let result = await fetch(`${URL}/friends/add`,
        {
            headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')},
            method:'POST',
            body: JSON.stringify({friend_id:friend_id})
        }
    )
    let data = await result.json()
    setMessage(data.message)

}

async function deleteFriend(friend_id:number) {
        let result = await fetch(`${URL}/friends/delete`,
        {
            headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')},
            method:'DELETE',
            body: JSON.stringify({friend_id:friend_id})
        }
    )
    let data = await result.json()
    setMessage(data.message)
}


async function acceptFriend(send_id:number) {
 let result = await fetch(`${URL}/friends/accept`,
    {
        headers: {'Authorization':'Bearer '+localStorage.getItem('token')},
        method:'POST',
        body:JSON.stringify({send_id:send_id})
    }
)
let data = await result.json()
setMessage(data.message)    
}


return(
    <div className={styles.main}>
                <ul>
            {friends.map(a => (
            <li key={a.friend_id}>{a.name}</li>
            ))}
        </ul>

        {/* <div className={styles.find}></div>
        <div className={styles.div1}>привеи</div>
        <div className={styles.div2}>привеи</div>
        <div className={styles.div3}>привеи</div> */}
    </div>
)
}



export default Friends;
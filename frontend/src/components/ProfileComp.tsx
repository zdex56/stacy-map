import { BaseContext } from '../../context/BaseContext';
import { useContext, useState } from 'react';


// const response = await fetch(`${URL}/users/myname`,
// {headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')}})
// const data = await response.json() на будущее


function ProfileComp() {
const [myname,Setmyname] = useState('')
const {name} = useContext(BaseContext)

function GetName()
{
    console.log('имя',name)
    Setmyname(name)
}


    return(
        <div>
        <button onClick={GetName}>моё имя?</button>
        <h2>твоё имя {myname}</h2>
        <h2>мне было очень лень делать профиль :p потом сделаю</h2>
        </div>

    )
}


export default ProfileComp;
import {useState} from 'react'
import {URL} from '../../config'
import type { Testinterface,User } from '../../interface/test';





function UserList()
{
const [error,setError] = useState('');
const [message,setMessage] = useState('');  
const [status,setStatus] = useState<number>(0);
const [users, setUsers] = useState<User[]>([]);
const [masus,setMasus] = useState<any[]>([]);



type Flags = 'test' | 'user' | 'masus' |'reg'| null;
const [flags,setFlags] = useState<Flags>(null); 







async function GetTest(){
try{
  const fet = await fetch(`${URL}/`)
  const data = await fet.json() as Testinterface;
  
  setStatus(fet.status)
  setMessage(data.lol)
  setFlags('test');
}
catch(error)
{
  console.error(error)
  setError('Не удалось загрузить данные');
}}



async function GetUsers(){
try{
  const fet = await fetch(`${URL}/users`)
  const data: User[] = await fet.json()
  setUsers(data)
  setFlags('user')
 
}
catch(error){
  console.error(error)
  setError('Не удалось загрузить данные');
  }
}

async function GetMasus() {
  const fet = await fetch(`${URL}/users`)
  const data: User[] = await fet.json()
  

  setMasus(data)
    setFlags('masus')
}


let contentif = null
if (flags === null)
{
  contentif =<h1>привет запроси данные</h1>
}
if (flags === 'test')
{
  contentif = <h1>статус {status} сообщение {message} </h1>
}
if (flags === 'user')
  {
    contentif =  <div>
        <ul>
          {users.map(as => 
            <li key={as.user_id}>
              <li>id - {as.user_id}</li>
              <li>name - {as.name}</li>
              <li>username - {as.username}</li>
            </li>
            
          )}
        </ul>
    </div>       
    
}
if (flags === 'masus')
{
  contentif =   (
    <pre>{JSON.stringify(masus, null, 2)}</pre>
  );
}










return (
<div className='main'>
        <button onClick={GetTest} >тестовые данные</button>
        <button onClick={GetUsers}>пользователи</button>
        <button onClick={GetMasus}>полный вывод</button>
        {contentif} 
        {error && <p style={{color: 'red'}}>{error}</p>}
</div>
)
}


export default UserList;



import './App.css'
import Footer from './footer'
import Header from './header'
import React,{useEffect,useState} from 'react'

import {URL} from '../config'
import type { Testinterface,User } from '../interface/test';




function App() {

const [error,setError] = useState('');
const [message,setMessage] = useState('');  
const [status,setStatus] = useState<number>(0);
const [users, setUsers] = useState<User[]>([]);
const [masus,setMasus] = useState<any[]>([]);

type Flags = 'test' | 'user' | 'masus' | null;
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
        <h1>
          {users.map(as => 
            <li key={as.number}>имя {as.name} номер {as.number}</li>
          )}
        </h1>
    </div>       
    
}
if (flags === 'masus')
{
  contentif =   (
    <pre>{JSON.stringify(masus, null, 2)}</pre>
  );
}



  return (
    <div className='hero'>
      <Header/>



      <div className='main'>
        <button onClick={GetTest} >тестовые данные</button>
        <button onClick={GetUsers}>пользователи</button>
        <button onClick={GetMasus}>масус</button>
        {contentif}
      </div>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <Footer/>
    </div>
  )
}

export default App



// полезное на будущее
{/* <pre>полный {JSON.stringify(masus)}</pre> полный вывод */}

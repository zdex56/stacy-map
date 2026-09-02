
import { useState } from "react";
import {URL} from '../../config'
import { Link,useNavigate } from "react-router-dom";


function RegComp()
{
const navigate = useNavigate();
const [formdata,setFormdata] = useState( { name:'',username:'',pass:'' } )
const [result,setResult] = useState('')


function handlechange (e:React.ChangeEvent<HTMLInputElement>)
{
  setFormdata(lol => ({...lol, [e.target.name]:e.target.value}))
}



async function sendReg(){
try
{

const response = await fetch(`${URL}/users/registration`, 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify
        ({name:formdata.name, username:formdata.username, pass:formdata.pass})
    }

)
const data = await response.json()

if (!response.ok)
{
    setResult(data.message)
    return
}

setResult("успешно создан name: " + data.user.name)
setTimeout(() => {navigate('/')},2000)
}
catch(err)
{

    console.error(err)
    setResult('не получилось ошибка')
}


}
return (
<div className="registration">
    <Link to={'/'} className="fixed Link_button">на главную</Link>
    <div className='input_div'>
    <input name='name' value={formdata.name} onChange={handlechange}  placeholder='имя'/>
    <input name ='username' value={formdata.username} onChange={handlechange}  placeholder = 'юзернейм'/>
    <input name='pass' value={formdata.pass} onChange={handlechange}  placeholder ='пароль'/>
    <button  disabled={!formdata.name || !formdata.pass || !formdata.username}  onClick={sendReg} >зарегаться</button>
    <h2>{result}</h2>
  </div>
  
</div>
)
}




export default RegComp;
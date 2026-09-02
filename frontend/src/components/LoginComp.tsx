    import { useEffect, useState } from "react";
    import { Link, Navigate, Route,useNavigate } from "react-router-dom";
    import { URL } from "../../config";
    import { BaseContext } from "../../context/BaseContext";
    import { useContext } from "react";


    function LoginComp()
    {
    const navigate = useNavigate();
    const {setIsactive,logginpress}  = useContext(BaseContext)
    const [formdata,setFormdata] = useState({pass:'',username:''})
    const [result,setResult] = useState('')
    
    async function login() 
    {
        try
        {
        const response = await fetch(`${URL}/users/login`,
            {
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({username:formdata.username,pass:formdata.pass})
            }
        )
        if (!formdata.pass.length || !formdata.username.length)
        {
            setResult('пустой ввод')
            throw new Error('пустой ввод')
        }
        const data = await response.json()
        if(!response.ok)
        {
            setResult(data.mess)
            return
        }
        setResult(data.mess)
        localStorage.setItem('token',data.token)
        localStorage.setItem('name',data.name)
        setIsactive('logged')
        logginpress()
        setResult('успешно!')
        setTimeout(() => {navigate('/')},2000)
        

        }   
catch (err) {
console.log(err)
}


    }




    function handlechange (e:React.ChangeEvent<HTMLInputElement>)
    {
    setFormdata(lol => ({...lol, [e.target.name]:e.target.value}))
    }

    return(
        <div>
        <Link to={'/'} className="fixed Link_button">на главную</Link>
        <div className="registration">
        <div className='input_div'>
        <input  name ='username' value={formdata.username} onChange={handlechange}  placeholder = 'username'/>
        <input type='password' name='pass' value={formdata.pass} onChange={handlechange}  placeholder ='пароль'/>
        <button disabled = {!formdata.pass||!formdata.username} onClick={login}>войти</button>
        <h2>{result}</h2>
        </div>
        </div>
        </div>
    )
    }



    export default LoginComp;
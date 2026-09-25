import { createContext,useEffect,useState} from "react";
import { jwtDecode } from 'jwt-decode';
export const BaseContext = createContext(null as any)

export const BaseProvider = ({children}:any) =>
{
const [icon, setIcon] = useState(localStorage.getItem('icon'))
const [isactive,setIsactive] = useState<'logged' | 'out'>(() => localStorage.getItem('token') ? "logged" : "out")
const [name,setName] = useState(localStorage.getItem('name'))
const [username,setUsername] = useState(localStorage.getItem('username'))
const [description,setDescription] = useState(localStorage.getItem('description'))


function useTokenValidator(onExpire: () => void)
{
    useEffect(()=>
    {
        const checkToken = () =>
        {
        type expjtw = {exp:number}
        let token = localStorage.getItem('token')
        if (!token) return
        
        try
        {
            let {exp} = jwtDecode<expjtw>(token)
          if (Date.now() > exp * 1000)
            {
                onExpire()
            }

        }
        catch(err)
        {
            console.log(err)
            onExpire()
        }
        }


        checkToken()
        let interval = setInterval(checkToken,30_000) //30sek

        return () => clearInterval(interval)
    },[onExpire])
}

useTokenValidator(()=>setIsactive('out'))

function logout()
{   
    localStorage.clear()
    setIsactive('out')
    setName('')
    setUsername('')
    setDescription('')
}

function logginpress()
{  
setIcon(localStorage.getItem('icon'))
setIsactive('logged')
setName(localStorage.getItem('name'))
setDescription(localStorage.getItem('description'))
setUsername(localStorage.getItem('username'))
}



return(
        <BaseContext.Provider value={{setIsactive,isactive,logout,name,logginpress,setDescription,description,setUsername,username,setName,icon,setIcon}}>
            {children}
        </BaseContext.Provider>

)


}
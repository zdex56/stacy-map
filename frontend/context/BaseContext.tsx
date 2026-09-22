import { createContext,useState} from "react";

export const BaseContext = createContext(null as any)

export const BaseProvider = ({children}:any) =>
{
console.log('перезаписал даныне снова')
const [icon, setIcon] = useState(localStorage.getItem('icon'))
const [isactive,setIsactive] = useState<'logged' | 'out'>(() => localStorage.getItem('token') ? "logged" : "out")
const [name,setName] = useState(localStorage.getItem('name'))
const [username,setUsername] = useState(localStorage.getItem('username'))
const [description,setDescription] = useState(localStorage.getItem('description'))


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
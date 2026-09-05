import { createContext,useState} from "react";

export const BaseContext = createContext(null as any)

export const BaseProvider = ({children}:any) =>
{

const [isactive,setIsactive] = useState<'logged' | 'out'>(() => localStorage.getItem('token') ? "logged" : "out")
const [name,setName] = useState(()=>localStorage.getItem('name'))


function logout()
{   
    localStorage.clear()
    setIsactive('out')
    setName('')
}

function logginpress()
{
setName(localStorage.getItem('name'))
}





return(
        <BaseContext.Provider value={{setIsactive,isactive,logout,name,logginpress}}>
            {children}
        </BaseContext.Provider>

)


}
import { BaseContext } from '../../context/BaseContext';
import { useContext, useState } from 'react';
import { URL } from '../../config';
import ProfilePattern from '../pattern/ProfilePattern';
import React from 'react';
import "./ProfileComp.css"

// const response = await fetch(`${URL}/users/myname`,
// {headers:{'Authorization': 'Bearer ' + localStorage.getItem('token')}})
// const data = await response.json() на будущее





async function Update(newValue:string,update:string)
{
const result = await fetch(`${URL}/users/change`,
    {
        headers:{'Authorization':'Bearer '+localStorage.getItem('token'),'Content-Type': 'application/json'},
        method:'POST',
        body:JSON.stringify({newValue:newValue,update:update})
    }
    
)

const data = await result.json()
localStorage.setItem(`${update}`,data.newValue)
return
}




function EditFiels({value,placeholder,onsave,name,update}:{value:string,placeholder:string,onsave:(v:string)=>void,name:string,update:string;})

{
const [isedit,setIsedit] = useState(false)
const [cher,setchern] = useState(value)


const save = () =>
{
onsave(cher),
Update(cher,update)
setIsedit(false)
}

if (!isedit)
{
return(
    <button className="button_EditFiels"onClick={()=>setIsedit(true)}>{name}</button>
)
}

return (
    <input className='input_EditFiels' 
    type="text" placeholder={placeholder} value={cher}  
    onKeyDown={(e)=>{ if (e.key === 'Enter') {save()}}}
    onChange={e=>setchern(e.target.value)}
    onBlur={()=>setIsedit(false)}
    autoFocus
    />
    
)

}




function ProfileComp() {
const {setDescription,description,username,setName,name,setIcon} = useContext(BaseContext)
const [modal,setModal] = useState(false)




async function UploadAvatar(event:React.ChangeEvent<HTMLInputElement>) {


    let file = event.target.files?.[0]
    if (!file) return;

    let formData = new FormData();
    formData.append('avatar',file)
    

    let result = await fetch(`${URL}/upload/upload`,{
            method:'POST',
            headers:{'Authorization':'Bearer '+localStorage.getItem('token')},
            body: formData
    })
    let data = await result.json()
    setIcon(`${data.iconid}`)
    localStorage.setItem('icon',data.iconid)
    
}



// добавить проверку на одинаковый пароль
function ModalPass()
{
const [formdata,setFormdata] = useState({newpass:'',oldpass:''})
const [message,setmessage] = useState('вы ничего не делали пока что')


async function ActionChangePass() {
if (formdata.oldpass === '' || formdata.newpass === '')
{
    setmessage('пустое поле')
    return
}

if (formdata.oldpass === formdata.newpass)
{   
    setmessage('пароли одинаковые')
    return
}

    let result = await fetch(`${URL}/users/change-password`,{
        method:'POST',
        headers:{'Authorization':'Bearer '+localStorage.getItem('token'),
            'Content-type':'application/json'
        },
        
        body:JSON.stringify({oldpass:formdata.oldpass,newpass:formdata.newpass})
    })
   
    let data = await result.json()
    setmessage(data.message)
}


function handlechange (e:React.ChangeEvent<HTMLInputElement>)
{
    setFormdata(a => ({...a, [e.target.name]:e.target.value}))
}
if(!modal) return null
return(
    <div className='modal_window'>
        <div className='change_pass'>
        <input  className='input_EditFiels' type="text" name="oldpass" value={formdata.oldpass} onChange={(handlechange)} placeholder='текущий пароль'/>
         <input  className='input_EditFiels' type="text" name="newpass" value={formdata.newpass} onChange={(handlechange)} placeholder='новый пароль'/>
         <button className='button_EditFiels'  onClick={ActionChangePass}>сменить пароль</button>
         <button className='button_EditFiels    ' onClick={()=>setModal(false)}>выйти</button>
         <h2>{message}</h2>
        </div>
    </div>
)
}






    return(
        <div className='profile'>
            <ProfilePattern name={name} description={description}/>
            <div className='profile_change'>

                <div className='profile_header'>

                    <div className='content_button'>
                            <EditFiels update='name'value={name} placeholder={name} onsave={setName} name={name}/>
                    </div>

                    <div className='content_button'>
                        <button className='button_EditFiels username'>@{username}</button>
                    </div>

                    <div className='content_button'>
                        <label htmlFor="fileInput" className="button_EditFiels hover_label">сменить аву</label>
                        <input  id="fileInput" type="file" name="avatar" onChange={UploadAvatar} accept='image/*' hidden/>
                    </div>
                    <div className='content_button' style={{width:'120px'}}  >
                        <button onClick={()=>setModal(true)} className='button_EditFiels hover_label'>сменить пароль</button>
                    </div>
                </div>
               <ModalPass/>
                <div className='content_profile '>
                    <div className='content_button description'>
                        <EditFiels update='description'value={description} placeholder={description} onsave={setDescription} name={description}/>
                    </div>

                        
                </div>

            </div>
        </div>

    )
}


export default ProfileComp;
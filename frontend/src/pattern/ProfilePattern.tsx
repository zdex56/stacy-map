import { Component, useContext } from 'react';
import './ProfilePattern.css';
import { BaseContext } from '../../context/BaseContext';

function ProfilePattern({name,description}:{name:string,description:string})
{
    const {icon} = useContext(BaseContext)

    return(
        <div className='profilePattern'>
            <div className='color2'></div>
            <div className='pattern_img'> <img className="Avatar"src={`http://localhost:3000/icon/${icon}`} alt="" /></div>


               
            
            <div className='pattern_info'>
                    <h2>{name}</h2>
                    <textarea name="2" id="1" disabled value={description} ></textarea>
            </div>
            <div className='pattern_footer'>
                как другие видят тебя   
            </div>
        </div>
    )
    
}


export default ProfilePattern
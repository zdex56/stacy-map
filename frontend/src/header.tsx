import {Link} from "react-router-dom"
import { useContext} from "react";
import { BaseContext } from "../context/BaseContext";


function Header()
{
    const {isactive} = useContext(BaseContext);
    const {logout}  = useContext(BaseContext)

    

    return(
        <header>
                <Link to={'/'} className="Link_button">пользователи</Link>
                <Link to={'/map'} className="Link_button">карты</Link>
                {isactive !=='logged' &&
                    (
                        <div className="div_profile">
                            <Link to={'/registration'} className="Link_button">регистрация</Link>
                            <Link to={'/login'} className="Link_button">вход</Link>
                        </div>
                    )
                }
                
                
                {isactive==='logged' &&
                (
                    <div className="div_profile"> 
                        <Link to={'/profile'} className="Link_button">профиль</Link>
                        <button className="button_header" onClick={logout}>выйти</button>
                    </div>
                    
                )
            }
                

        </header>
    )
}

export default Header;
import { Navigate } from 'react-router-dom';
import { useContext} from "react";
import { BaseContext } from "../../context/BaseContext";



function ProtectedRoute({children}:{children: React.ReactNode})

{
    const {isactive} = useContext(BaseContext)   

    if (!isactive)
    {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}


export default ProtectedRoute
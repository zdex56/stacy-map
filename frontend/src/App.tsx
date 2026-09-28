import './App.css'
import Footer from './footer'
import Header from './header'
import UserList from './components/UserList'
import TestComp from './components/TestComp'
import RegComp from './components/RegComp'
import LoginComp from './components/LoginComp'
import ProfileComp from './components/ProfileComp'
import MapComp from './components/MapComp'



import { useContext} from "react";
import { BaseContext } from "../context/BaseContext";


import type {LayoutProps} from '../interface/test';

import { Routes,Route,Navigate } from 'react-router-dom';




function MainLayout({children}:LayoutProps)
{
  return(
  <div className='hero'>
    <Header/>
    {children}
    <Footer/>
  </div>
  )
}


function ProtectedRoute({children}:{children: React.ReactNode})
{

    const {isactive} = useContext(BaseContext)   
    if (isactive === 'out')
    {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}


function App() {
  return (

    <Routes>
        <Route path="/" element={
            <MainLayout>
              <UserList/>
            </MainLayout>
        }/>
        <Route path="/test" element={
            <MainLayout>
              <TestComp/>
            </MainLayout>
        }/>
        <Route path='/registration' element={
          <RegComp/>
        }/>
        <Route path='/login' element={
          <LoginComp/>
        }/>
        <Route path='/profile' element={
                <ProtectedRoute>
          <MainLayout>
            <ProfileComp/>
          </MainLayout>
                    </ProtectedRoute>
        }/>
        <Route path='/map' element={
          <ProtectedRoute>
            <MainLayout>
            <MapComp/>
            </MainLayout>
          </ProtectedRoute>
        }/>
    </Routes>


  )
}

export default App





import './App.css'
import Footer from './footer'
import Header from './header'
import UserList from './components/UserList'
import TestComp from './components/TestComp'
import RegComp from './components/RegComp'
import LoginComp from './components/LoginComp'
import ProfileComp from './components/ProfileComp'

import type {LayoutProps} from '../interface/test';

import { Routes,Route } from 'react-router-dom';




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
        <Route path='profile' element={
          <MainLayout>
            <ProfileComp/>
          </MainLayout>
        }
        
        />

        
    </Routes>

  )
}

export default App





import {Outlet, Navigate} from 'react-router-dom'
import logo from '../assets/login2.jpeg';

const AuthLayout = () => {

  const isAuthenticated = false;

  return (
    <>
    {isAuthenticated ? ( <Navigate to = '/' />): 
    (<>
       
    <section className='flex flex-1 justify-center items-center flex-col'>
      <Outlet></Outlet>
      </section> 
 

      </>)}
      
    </>
  )
}

export default AuthLayout
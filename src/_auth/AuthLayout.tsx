import {Outlet, Navigate} from 'react-router-dom'
import Topbar from '@/components/shared/Topbar';
import Sidebar from '@/components/shared/Sidebar';
import Bottombar from '@/components/shared/Bottombar';

const AuthLayout = () => {

  const isAuthenticated = false;

  return (
    <>
    {isAuthenticated ? ( <Navigate to = '/' />): 
    (<>
       <div className='w-full flex max-[768px]:flex-col'>
    <Topbar />
    <Sidebar />
    <section className='flex flex-1 justify-center items-center flex-col'>
      <Outlet></Outlet>
      </section> 
      <Bottombar/>
    </div>

      </>)}
      
    </>
  )
}

export default AuthLayout
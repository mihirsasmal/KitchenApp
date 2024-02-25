import './globals.css';
import logo from './assets/login2.jpeg';
import {Routes, Route} from 'react-router-dom';
import LoginForm from './_auth/forms/LoginForm';
import { Home } from './_root/pages';
import CreateAccountForm from './_auth/forms/CreateAccountForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"

const App = ()=>{
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/createaccount" element={<CreateAccountForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout/>}>
        <Route index element={<Home />} />
        </Route>        
      </Routes>
      <Toaster />
    </main>
  );
  
};

export default App;


// const old working App = ()=>{
//   return (
//     <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-stone-50 py-6 sm:py-12">
//       <img src={logo} alt="" className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" width="1080" />
//       <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
//       <div>  
//       <form  className= 'space-y-3'>
//       <input type = 'text' placeholder='username' className=' text-slate-900 border rounded py-2 px-3 w-full' />

//       <input type = 'password' placeholder='ଦେଖିକି କୁହ' className=' text-slate-900 border rounded py-2 px-3 w-full' />

//       <button type = 'submit' className=' w-full my-2 bg-blue-600 py-1 rounded text-white hover:bg-blue-700 focus:ring focus:ring-blue-300 active:bg-blue-800 '>Login</button>
//       </form>
      
//   </div>
//   </div>
//   </div>
// );
  
// };
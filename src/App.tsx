import './globals.css';
import {Routes, Route} from 'react-router-dom';
import LoginForm from './_auth/forms/LoginForm';
import { Home , Explore, Saved, AddRecipe, EditRecipe, RecipeDetails, Profile, UpdateProfile} from './_root/pages';
import CreateAccountForm from './_auth/forms/CreateAccountForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"
import YourRecipes from './_root/pages/YourRecipes';
import Shared from './_root/pages/Shared';

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
        <Route path="/explore" element={<Explore />} />
        <Route path="/yourRecipes" element={<YourRecipes />} />
        <Route path="/shared" element={<Shared />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/addRecipe" element={<AddRecipe />} />
        <Route path="/update-recipe/:id" element={<EditRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/profile/:id/*" element={<Profile />} />
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>        
      </Routes>
      <Toaster />
    </main>
  );
  
};

export default App;
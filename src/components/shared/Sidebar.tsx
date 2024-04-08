import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useLogoutAccountMutation } from "@/lib/react-query/queriesAndMutation";
import { INavLink } from "@/types";
import { useEffect } from "react";
import { Link, NavLink, useNavigate , useLocation} from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "./ThemeProvider";

const Sidebar = () => {
    const {pathname} = useLocation();
  const { mutate: logout, isSuccess } = useLogoutAccountMutation();
  const navigate = useNavigate();
  const { theme } = useTheme()
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  const { user, isAuthenticated } = useUserContext();
  return (
    <nav className='leftsidebar'>
        <div className='flex flex-col gap-2'>
        
        <Link to="/" className="flex gap-3 justify-center items-center">
          <img src= {theme==='dark'?"/assets/icons/KitchenLogoDark.jpeg":"/assets/icons/KitchenLogo.jpeg"} alt="logo" width={100} height={100} />
        </Link>
        {isAuthenticated?
        <Link to={`/profile/${user.id}`} className=' flex gap-3 items-center'>
        
        <img
              src={user.imageUrl || "assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />    
        <div className="flex flex-col">
            <p className="dark:text-white text-slate-800">
                {user.name}
            </p>
            <p className="small-regular dark:text-light-6 text-slate-500">
             @{user.username}
            </p>
        </div>
        </Link> :(pathname !== '/login'?<Button type="button" className="shad-button_primary whitespace-nowrap" onClick={() => {
                navigate("/login");
              }} >Login</Button>:<></>)}
        <ul className="flex flex-col gap-1">
            {sidebarLinks.map((link:INavLink)=> {
                const isActive = pathname=== link.route;
                return (
                    <li key ={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500 text-light-1'}`} >
                         <NavLink to={link.route}
                          className='flex gap-4 items-center p-4'>
                             <img 
                             src={link.imgURL}
                             alt={link.label}
                             className={`group-hover:invert-white ${isActive && 'invert-white'}`}/>
                             {link.label}
                         </NavLink>
                    </li>
                   
                )
            })
        }

        </ul>

            </div>
            <div className="flex gap-9">            
            {isAuthenticated?<Button
             variant="ghost"
            className="shad-button_ghost"
            onClick={() => logout()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
            <p className="small-medium lg:base-medium">Logout</p>
          </Button> :<></>}
          <ModeToggle/>
          </div>
            </nav>
  )
}

export default Sidebar
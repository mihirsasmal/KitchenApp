import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useLogoutAccountMutation } from "@/lib/react-query/queriesAndMutation";
import { INavLink } from "@/types";
import { useEffect } from "react";
import { Link, NavLink, useNavigate , useLocation} from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";

const Sidebar = () => {
    const {pathname} = useLocation();
  const { mutate: logout, isSuccess } = useLogoutAccountMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  const { user } = useUserContext();
  return (
    <nav className='leftsidebar'>
        <div className='flex flex-col gap-11'>
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/react.svg" alt="logo" width={10} height={10} />
        </Link>
        <Link to={`/profile/${user.id}`} className=' flex gap-3 items-center'>
        
        <img
              src={user.imageUrl || "assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />        
        <div className="flex flex-col">
            <p className="text-white">
                {user.name}
            </p>
            <p className="small-regular text-light-3">
             @{user.username}
            </p>
        </div>
        </Link>
        <ul className="flex flex-col gap-6">
            {sidebarLinks.map((link:INavLink)=> {
                const isActive = pathname=== link.route;
                return (
                    <li key ={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`} >
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
            <Button
             variant="ghost"
            className="shad-button_ghost"
            onClick={() => logout()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
            <p className="small-medium lg:base-medium">Logout</p>
          </Button>
          <ModeToggle/>
          </div>
            </nav>
  )
}

export default Sidebar
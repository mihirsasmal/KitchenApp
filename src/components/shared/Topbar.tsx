import { useUserContext } from "@/context/AuthContext";
import { useLogoutAccountMutation } from "@/lib/react-query/queriesAndMutation";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "./ThemeProvider";

const Topbar = () => {
  const { mutate: logout, isSuccess } = useLogoutAccountMutation();
  const navigate = useNavigate();
  const { theme } = useTheme()
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  const {pathname} = useLocation();
  const { user, isAuthenticated} = useUserContext();
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 item-center">
          <img src={theme==='dark'?"/assets/icons/KitchenLogoDark.jpeg":"/assets/icons/KitchenLogo.jpeg"} alt="logo" width={75} height={75} />
        </Link>

        <div className="flex gap-1">
        <ModeToggle/>
        {isAuthenticated?<>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => logout()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" width={20} height={20} />
            Logout
          </Button>

          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/react.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link></>:(pathname !== '/login'?<Button type="button" className="shad-button_primary whitespace-nowrap" onClick={() => {
                navigate("/login");
              }} >Login</Button>:<></>)}
        </div>
      </div>
    </section>
  );
};

export default Topbar;

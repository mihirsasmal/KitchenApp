import { useUserContext } from "@/context/AuthContext";
import { useLogoutAccountMutation } from "@/lib/react-query/queriesAndMutation";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";

const Topbar = () => {
  const { mutate: logout, isSuccess } = useLogoutAccountMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  const { user, isAuthenticated} = useUserContext();
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 item-center">
          <img src="/assets/react.svg" alt="logo" width={50} height={50} />
        </Link>

        <div className="flex gap-1">
        <ModeToggle/>
        {isAuthenticated?<>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => logout()}
          >
            <img src="/assets/react.svg" alt="logout" width={10} height={10} />
            Logout
          </Button>

          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/react.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link></>:<></>}
        </div>
      </div>
    </section>
  );
};

export default Topbar;

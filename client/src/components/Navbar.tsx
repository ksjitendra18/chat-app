import checkAuth from "@/lib/checkAuth";
import useAuthStore from "@/store/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, logout, setUser } = useAuthStore();
  const [navbarActive, setNavbarActive] = useState(false);

  useEffect(() => {
    async function setAuth() {
      const userData = await checkAuth();
      setUser(userData.data);
    }
    setAuth();

    document.querySelector("li")?.addEventListener("click", () => {
      setNavbarActive(false);
    });
  }, []);
  return (
    <header className="relative px-5 h-[80px] bg-primaryColour dark:text-white">
      <div className="h-full mx-auto flex justify-between items-center py-2">
        <Link to="/" className="font-bold text-2xl ">
          {" "}
          LiveChatApp
        </Link>
        <nav
          className={`mainNav z-30 ${
            navbarActive ? "flex" : "hidden"
          } md:flex absolute md:static top-14 md:top-0 items-center w-full md:w-auto justify-center bg-background `}
        >
          <ul
            className={`flex flex-col md:flex-row text-[20px] py-5 md:py-3 justify-center  items-center gap-5 `}
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Button asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/chat">Chat</Link>
                </li>
                <li className="font-bold  cursor-pointer" onClick={logout}>
                  Logout
                </li>
              </>
            )}

            <li className="ml-7">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
        <div
          className={`px-3 ${
            navbarActive ? "active" : ""
          } hamburger  block md:hidden mt-1 cursor-pointer`}
          onClick={() => setNavbarActive((prev) => !prev)}
        >
          <span className="bar block w-[30px] h-[4px] bg-white"></span>
          <span className="bar block w-[30px] mt-1 h-[4px] bg-white"></span>
          <span className="bar block w-[30px] mt-1 h-[4px] bg-white"></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

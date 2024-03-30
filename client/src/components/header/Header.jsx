import { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  TextInput,
  Sidebar,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  // const {theme}=useSelector((state)=>state.theme)
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchterm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchterm", searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2 fixed z-50 w-full" fluid rounded>
      <Navbar.Brand href="/">
        <span className="text-sm self-center whitespace-nowrap sm:text-xl font-semibold">
          <span className="px-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Teos
          </span>
          Blog
        </span>
      </Navbar.Brand>
      <div className="flex gap-2 ">
        <form onSubmit={handleSubmit}>
          <Button className="w-12 h-10 lg:hidden" pill>
            <Link to={"/search"}>
              <AiOutlineSearch />
            </Link>
          </Button>
          <TextInput
            type="text"
            placeholder="Search..."
            icon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>{" "}
      <div className="flex gap-2 md:order-2 ">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-xs">@{currentUser.username}</span>
              <span className="block text-xs font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/signin"}>
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/">Home</Navbar.Link>
        <Navbar.Link active={path === "/cryptos"}>Cryptos</Navbar.Link>
        <Navbar.Link>About</Navbar.Link>

        <Dropdown arrowIcon={true} inline label={"Services"}>
          <Navbar.Link>
            <Dropdown.Item>Dashboard</Dropdown.Item>
          </Navbar.Link>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}

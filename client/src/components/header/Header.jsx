import React from "react";

import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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

  return (
    <Navbar className="border-b-2 sticky z-50">
      <Link
        to={"/"}
        className="text-sm self-center whitespace-nowrap sm:text-xl font-semibold"
      >
        <span className="px-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Teos
        </span>
        Blog
      </Link>
      <div className="flex gap-2 ">
        <form>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>

        <Button className="w-12 h-10 lg:hidden" pill>
          <AiOutlineSearch />
        </Button>
      </div>{" "}
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/cryptos"} as={"div"}>
          <Link to={"/"}>Cryptos</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link to={"/"}>About</Link>
        </Navbar.Link>

        <Dropdown arrowIcon={true} inline label={"Services"}>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </Navbar.Collapse>
      <div className="flex gap-2 md:order-2">
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
    </Navbar>
  );
}

import React from "react";

import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2 sticky">
      <Link
        to={"/"}
        className="text-sm self-center whitespace-nowrap sm:text-xl font-semibold"
      >
        <span className="px-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Teos
        </span>
        Blog
      </Link>
      <div className="fex gap-2 md:order-2">
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
    </Navbar>
  );
}

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Assets/logo-with-text.png";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : {};

  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const menuItems = [
    {
      id: 1,
      name: "Overview",
      Url: "/",
    },
    {
      id: 2,
      name: "Transactions",
      Url: "/transactions",
    },
    {
      id: 3,
      name: "Categories",
      Url: "/categories",
    },
    {
      id: 4,
      name: "Settings",
      Url: "/settings",
    },
  ];

  const dropdown = [
    {
      id: 1,
      name: "Log Out",
      Url: logout,
    },
    {
      id: 2,
      name: "Settings",
      Url: "/announcements",
    },
  ];

  return (
    <div className="p-3 flex items-center border-b w-full">
      <div className="flex justify-start space-x-4 w-full">
        <img src={Logo} alt="img" className="w-[10rem]" />
        <div className="flex items-center space-x-4 capitalize">
          {menuItems.map((item) => (
            <div key={item.id}>
              <p
                onClick={() => navigate(item.Url)}
                className={`flex items-center space-x-2 hover:text-primary cursor-pointer ${
                  location.pathname === item.Url ? "text-primary font-bold" : ""
                }`}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end w-full items-center space-x-4">
        <p className="font-bold text-primarysize">Balance : {userData.currency}12,680.90</p>
        <div className="flex items-center space-x-4 text-primarysize">
          <img
            className="rounded-full w-[3rem]"
            src="https://www.shareicon.net/data/512x512/2016/09/15/829452_user_512x512.png"
            alt="profile"
          />
          <p onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            {userData.firstname} {userData.lastname}
          </p>
          <div className="relative">
            <IoMdArrowDropdown
              className={`text-[1.3rem] hover:cursor-pointer inline ml-1 transform ${
                isOpen ? "rotate-180" : "rotate-0"
              } transition-transform duration-300 ease-in-out`}
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <ul className="absolute top-16 w-[12rem] right-0 rounded shadow bg-input_bg z-10">
                {dropdown.map((index) => (
                  <li
                    key={index.id}
                    onClick={index.Url}
                    className="capitalize cursor-pointer hover:bg-white_hover px-4 py-2"
                  >
                    {index.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

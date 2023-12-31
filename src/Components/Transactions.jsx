import React, { useState, useEffect } from "react";
import { useAnalitics } from "../Context/AnaliticsContext";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../Api";

export default function Transactions() {
  const { userData, formatNumber } = useAnalitics();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(1); // Initially select "Today"
  const [isSelected, setIsSelected] = useState(false);

  // Helper function to format the date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  useEffect(() => {
    axios
      .get(`${api.getTransactions}/${userData.id}`, {
        headers: {
          api_key: api.key,
          authentication: api.authentication,
        },
      })
      .then((response) => {
        setTransactions(response.data.transactions);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [userData.id]);

  // Create a dropdown JSON for date ranges
  const dropdown = [
    {
      id: 1,
      name: "All",
      filterFunction: (item) => true, // Show all transactions
    },
    {
      id: 2,
      name: "Today",
      filterFunction: (item) => {
        const today = new Date().toISOString().split("T")[0];
        return item.date.startsWith(today);
      },
    },
    {
      id: 3,
      name: "Yesterday",
      filterFunction: (item) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split("T")[0];
        return item.date.startsWith(yesterdayString);
      },
    },
    {
      id: 4,
      name: "This Week",
      filterFunction: (item) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return formatDate(item.date) >= formatDate(startOfWeek);
      },
    },
    {
      id: 5,
      name: "Last Week",
      filterFunction: (item) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() - today.getDay() - 1);
        return (
          formatDate(item.date) >= formatDate(startOfWeek) &&
          formatDate(item.date) <= formatDate(endOfWeek)
        );
      },
    },
  ];

  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  const handleDropdownClick = (filterFunction, id) => {
    setIsOpen(false);
    setFilteredTransactions(transactions.filter(filterFunction));
    setSelectedFilter(id);
    setIsSelected(true);
  };

  return (
    <div>
      <div className="border w-full p-4 rounded-lg space-y-6">
        <div className="flex items-center">
          <div className="w-full">
            <p className="font-bold">Transactions</p>
            <p className="text-subtitle text-black/[.70]">
              View all your expenses and income you have done recently
            </p>
          </div>
          <div className="w-[150px] flex justify-end items-center">
            <div className="relative flex items-center">
              <p
                className="text-subtitle capitalize cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {dropdown.find((item) => item.id === selectedFilter).name}
              </p>
              <MdOutlineKeyboardArrowDown
                className={`text-[1.3rem] hover:cursor-pointer inline ml-1 transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                } transition-transform duration-300 ease-in-out`}
                onClick={() => setIsOpen(!isOpen)}
              />
              {isOpen && (
                <ul className="absolute top-8 w-[8rem] right-0 rounded shadow bg-input_bg z-10 bg-white">
                  {dropdown.map((item) => (
                    <li
                      key={item.id}
                      className={`capitalize cursor-pointer hover:bg-white_hover px-4 py-2 text-subtitle ${
                        item.id === selectedFilter
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleDropdownClick(item.filterFunction, item.id)
                      }
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {transactions.length === 0 ? (
          <div>
            <div className="flex justify-center">
              <img
                className="w-[30rem]"
                alt="img"
                src="https://firebasestorage.googleapis.com/v0/b/portfolios-62a43.appspot.com/o/8376575_3826710.svg?alt=media&token=34ff203d-402b-4cfd-9ceb-472a1e8f9f34&_gl=1*hfkjqd*_ga*NTE3MjM3NDA3LjE2OTU5NjI5NDc.*_ga_CW55HF8NVT*MTY5OTE4MTk1Ny42LjEuMTY5OTE4Mjk2Ni4yMi4wLjA."
              ></img>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isSelected
              ? filteredTransactions.slice(0, 5).map((index) => (
                  <div>
                    <div
                      className="grid-cols-4 gap-4 text-subtitle text-black/[.70] sm:hidden md:hidden lg:grid"
                      key={index.id}
                    >
                      <div>
                        <p className="font-semibold text-black capitalize">
                          {index.title}
                        </p>
                        <p>{formatDate(index.date)}</p>
                      </div>
                      <div className="flex space-x-1 items-center">
                        <p>{userData.currency}</p>
                        <p>{formatNumber(index.amount.$numberDecimal)}</p>
                      </div>
                      <div className="flex justify-end items-center capitalize">
                        <p>{index.category}</p>
                      </div>
                      <div className="flex justify-end capitalize items-center">
                        {index.is_income ? (
                          <p className="text-green bg-green/[.15] px-5 py-1 rounded-sm font-semibold">
                            income
                          </p>
                        ) : (
                          <p className="text-red bg-red/[.15] px-4 py-1 rounded-sm font-semibold">
                            expense
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:block md:block lg:hidden">
                      <div className="flex items-center">
                        <p className="w-full capitalize text-subtitle font-semibold">
                          {index.title}
                        </p>
                        <div className="flex justify-end capitalize items-center">
                          {index.is_income ? (
                            <div className="flex items-center">
                              <BsDot className="text-[1.5rem] text-green" />
                              <p className="text-green rounded-sm font-semibold">
                                income
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <BsDot className="text-[1.5rem] text-red" />
                              <p className="text-red rounded-sm font-semibold">
                                Expence
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-black/[.60]">
                        <p className="w-full capitalize text--subtitle">
                          {index.category}
                        </p>
                        <p className="w-[60%] flex justify-end text-subtitle">
                          {userData.currency}{" "}
                          {formatNumber(index.amount.$numberDecimal)}
                        </p>
                      </div>
                      <p className="text-subtitle text-black/[.60]">
                        {formatDate(index.date)}
                      </p>
                    </div>
                  </div>
                ))
              : transactions.slice(0, 5).map((index) => (
                  <div>
                    <div
                      className="grid-cols-4 gap-4 text-subtitle text-black/[.70] sm:hidden md:hidden lg:grid"
                      key={index.id}
                    >
                      <div>
                        <p className="font-semibold text-black capitalize">
                          {index.title}
                        </p>
                        <p>{formatDate(index.date)}</p>
                      </div>
                      <div className="flex space-x-1 items-center">
                        <p>{userData.currency}</p>
                        <p>{formatNumber(index.amount.$numberDecimal)}</p>
                      </div>
                      <div className="flex justify-end items-center capitalize">
                        <p>{index.category}</p>
                      </div>
                      <div className="flex justify-end capitalize items-center">
                        {index.is_income ? (
                          <p className="text-green bg-green/[.15] px-5 py-1 rounded-sm font-semibold">
                            income
                          </p>
                        ) : (
                          <p className="text-red bg-red/[.15] px-4 py-1 rounded-sm font-semibold">
                            expense
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:block md:block lg:hidden">
                      <div className="flex items-center">
                        <p className="w-full capitalize text-subtitle font-semibold">
                          {index.title}
                        </p>
                        <div className="flex justify-end capitalize items-center">
                          {index.is_income ? (
                            <div className="flex items-center">
                              <BsDot className="text-[1.5rem] text-green" />
                              <p className="text-green rounded-sm font-semibold">
                                income
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <BsDot className="text-[1.5rem] text-red" />
                              <p className="text-red rounded-sm font-semibold">
                                Expence
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-black/[.60]">
                        <p className="w-full capitalize text--subtitle">
                          {index.category}
                        </p>
                        <p className="w-[60%] flex justify-end text-subtitle">
                          {userData.currency}{" "}
                          {formatNumber(index.amount.$numberDecimal)}
                        </p>
                      </div>
                      <p className="text-subtitle text-black/[.60]">
                        {formatDate(index.date)}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        )}

        <div className="flex items-center space-x-1 justify-end text-primary">
          <p
            className="cursor-pointer"
            onClick={() => navigate("/transactions")}
          >
            See All Transactions
          </p>
          <IoIosArrowUp
            onClick={() => navigate("/transactions")}
            className="rotate-90 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

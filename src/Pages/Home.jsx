import React from "react";
import Header from "../Components/Header";
import Analitics from "../Components/Analitics";

export default function Home() {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : {};

  return (
    <div>
      <Header />
      <div className="flex justify-center py-4">
        <p className="max-w-primary w-full px-20 capitalize text-primarysize">
          <strong>Hi {userData.firstname} - </strong>
          <span className="text-black/[.60] font-semibold">
            Here is whats happaning with your finanse
          </span>
        </p>
      </div>
      <div className="flex justify-center">
        <div className="max-w-primary w-full px-20">
          <Analitics/>
        </div>
      </div>
    </div>
  );
}
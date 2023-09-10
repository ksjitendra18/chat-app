import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />

      <main className="px-5">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

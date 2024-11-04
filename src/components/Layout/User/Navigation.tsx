"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import LoginDialog from "./LoginDialog";

const Navigation = () => {
  const { data: session, status } = useSession();

  const NavTab = () => {
    switch (status) {
      case "authenticated":
        return (
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {`${session?.user?.firstName ?? session?.user?.name ??""} (${session?.user?.role ?? ""})`}
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li className="px-4">
                <Link
                  className="dropdown-item"
                  href={
                    session?.user?.isAdmin && session?.user?.role === "admin"
                      ? "/admin/dashboard"
                      : session?.user?.role === "client"
                      ? "/client/dashboard"
                      : session?.user?.role === "expert"
                      ? "/expert/dashboard"
                      : session?.user?.role === "lawyer"
                      ? "/lawyer/dashboard"
                      : ""
                  }
                >
                  Profile
                </Link>
              </li>
              <li>
                <a className="dropdown-item" onClick={() => signOut()} href="#">
                  Logout
                </a>
              </li>
            </ul>
          </li>
        );

      case "unauthenticated":
        return (
          <li className="nav-item">
            <LoginDialog />
          </li>
        );

      default:
        return (
          <li className="nav-item progress-bar-loader">
            <CircularProgress size={20} color="primary" />
          </li>
        );
    }
  };
  return (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item px-4">
          <a className="nav-link active" aria-current="page" href="#hero-sec">
            Home
          </a>
        </li>
        <li className="nav-item px-4">
          <a className="nav-link" href="#team">
            Team
          </a>
        </li>
        <li className="nav-item px-4">
          <a className="nav-link" href="#testi">
            Testimonials
          </a>
        </li>
        <NavTab />
      </ul>
    </div>
  );
};

export default Navigation;

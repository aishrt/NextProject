import React from "react";
import Navigation from "./Navigation";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <div className="container">
      <div className="nav-bar">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link className="navbar-brand" href="/">
              <Image
                src="/admin-logo.png"
                className="landing-logo"
                width={160}
                height={80}
                alt=""
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <Navigation />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;

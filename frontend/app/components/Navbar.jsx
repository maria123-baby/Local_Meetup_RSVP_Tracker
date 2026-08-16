"use client";

import "../globals.css";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    const navLinks = [
        {
            name: "Home",
            href: "/",
            protected: false
        },
        {
            name: "Dashboard",
            href: "/dashboard",
            protected: true
        }
    ];

    // Check login status
    useEffect(() => {

        const checkLogin = () => {

            const token =
                localStorage.getItem("token");

            const user =
                localStorage.getItem("user");

            if (token && user) {

                setLoggedIn(true);

                try {
                    const userData =
                        JSON.parse(user);

                    setUsername(
                        userData.username || ""
                    );

                } catch (error) {

                    console.error(
                        "Invalid user data:",
                        error
                    );

                    setUsername("");
                }

            } else {

                setLoggedIn(false);
                setUsername("");
            }
        };

        // Check when Navbar loads
        checkLogin();

        // Listen for login/logout
        window.addEventListener(
            "authChange",
            checkLogin
        );

        return () => {
            window.removeEventListener(
                "authChange",
                checkLogin
            );
        };

    }, []);


    const handleProtectedNavigation = (
        e,
        path
    ) => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            e.preventDefault();

            alert("Please login first");

            return;
        }
    };


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setLoggedIn(false);
        setUsername("");

        // Notify Navbar/auth state
        window.dispatchEvent(
            new Event("authChange")
        );

        router.push("/");
    };


    return (
        <nav>

            <div className="logo">
                Local Meetup
            </div>


            <div className="nav-links">

                {navLinks.map((item) => {

                    const isActive =
                        pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-items ${
                                isActive
                                    ? "active"
                                    : ""
                            }`}
                            onClick={(e) => {

                                if (
                                    item.protected
                                ) {
                                    handleProtectedNavigation(
                                        e,
                                        item.href
                                    );
                                }

                            }}
                        >
                            {item.name}
                        </Link>
                    );

                })}

            </div>


            <div className="btns">

                {loggedIn ? (

                    <>
                        <span
                            className="username"
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginRight: "15px"
                            }}
                        >
                            {username}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </>

                ) : (

                    <button
                        onClick={() =>
                            router.push("/login")
                        }
                        className="login-btn"
                    >
                        Login
                    </button>

                )}

            </div>

        </nav>
    );
};

export default Navbar;
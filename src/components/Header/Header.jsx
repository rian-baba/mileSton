import React, { useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Container, Logo, LogoutBtn } from "../index";
import { useSelector } from "react-redux";

const Header = React.memo(() => {
    const authStatus = useSelector((state) => state.auth.status);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = useMemo(() => [
        { name: "Home", slug: "/", active: true },
        { name: "Login", slug: "/login", active: !authStatus },
        { name: "Signup", slug: "/signup", active: !authStatus },
        { name: "All Posts", slug: "/all-posts", active: authStatus },
        { name: "Add Post", slug: "/add-post", active: authStatus },
    ], [authStatus]);

    const activeNavItems = useMemo(() => 
        navItems.filter(item => item.active), 
        [navItems]
    );

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-black shadow-lg border-b border-gray-800 backdrop-blur-sm">
            <Container>
                <nav className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
                            <Logo width="30px" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            MileSton
                        </span>
                    </Link>

                    {/* Nav items */}
                    <div className="flex items-center gap-2">
                        {activeNavItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.slug)}
                                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                                    location.pathname === item.slug
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                        : 'bg-gray-700 text-gray-100 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-700 hover:text-white'
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}

                        {/* Logout only if logged in */}
                        {authStatus && <LogoutBtn />}
                    </div>
                </nav>
            </Container>
        </header>
    );
});

export default Header;
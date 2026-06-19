import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import {
    Home,
    User,
    Code2,
    Boxes,
    BriefcaseBusiness,
    Mail,
    Menu,
    X,
    FileText,
    ShieldCheck,
    Sun,
    Moon,
    Newspaper,
    Volume2,
    VolumeX,
} from "lucide-react"

import { useSound } from "../context/SoundContext"

import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"

function Navbar() {
    const [open, setOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { soundEnabled, toggleSound } = useSound()
    const isDark = theme === "dark"

    const openMenu = () => {
        playSound("click")
        setOpen(true)
    }

    const closeMenu = () => {
        playSound("click")
        setOpen(false)
    }

    const handleThemeToggle = () => {
        playSound("toggle")
        toggleTheme()
    }

    const handleNavClick = () => {
        playSound("click")
        setOpen(false)
    }

    const navItems = [
        { name: "Home", path: "/", icon: <Home size={20} /> },
        { name: "About", path: "/about", icon: <User size={20} /> },
        { name: "Skills", path: "/skills", icon: <Code2 size={20} /> },
        { name: "Projects", path: "/projects", icon: <Boxes size={20} /> },
        { name: "Services", path: "/services", icon: <BriefcaseBusiness size={20} /> },
        { name: "Resume", path: "/resume", icon: <FileText size={20} /> },
        { name: "Blog", path: "/blog", icon: <Newspaper size={20} /> },
        { name: "Contact", path: "/contact", icon: <Mail size={20} /> },
    ]

    const drawerLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition ${isActive
            ? "bg-cyan-400 text-black shadow-[0_0_25px_rgba(34,211,238,0.35)]"
            : isDark
                ? "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
                : "text-gray-700 hover:text-cyan-500 hover:bg-gray-100"
        }`

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-500 ${isDark
                    ? "bg-[#020817]/85 border-cyan-400/10"
                    : "bg-white/85 border-gray-200"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                        onClick={handleNavClick}
                    >
                        <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                            AK
                        </div>

                        <h1
                            className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Ashish{" "}
                            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
                                Kumar
                            </span>
                        </h1>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openMenu}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-bold ${isDark
                                ? "border-cyan-400/30 text-cyan-300 hover:bg-cyan-400 hover:text-black"
                                : "border-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-black hover:border-cyan-400"
                                }`}
                        >
                            <Menu size={20} />
                            <span className="hidden sm:inline">Menu</span>
                        </button>

                        <button
                            onClick={toggleSound}
                            className={`w-11 h-11 rounded-xl border transition flex items-center justify-center ${isDark
                                ? "border-cyan-400/30 text-cyan-300"
                                : "border-gray-200 text-gray-700"
                                }`}
                            title="Sound"
                        >
                            {soundEnabled ? (
                                <Volume2 size={19} />
                            ) : (
                                <VolumeX size={19} />
                            )}
                        </button>

                        <button
                            onClick={handleThemeToggle}
                            className={`w-11 h-11 rounded-xl border transition flex items-center justify-center ${isDark
                                ? "border-cyan-400/30 text-cyan-300 hover:bg-cyan-400 hover:text-black"
                                : "border-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-black hover:border-cyan-400"
                                }`}
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun size={19} /> : <Moon size={19} />}
                        </button>

                        <Link
                            to="/admin-login"
                            onClick={handleNavClick}
                            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border transition font-bold ${isDark
                                ? "border-cyan-400/30 text-cyan-300 hover:bg-cyan-400 hover:text-black"
                                : "border-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-black hover:border-cyan-400"
                                }`}
                        >
                            <ShieldCheck size={18} />
                            Admin
                        </Link>
                    </div>
                </div>
            </nav>

            {open && (
                <div className="fixed inset-0 z-[9998]">
                    <div
                        onClick={closeMenu}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    ></div>

                    <div
                        className={`absolute top-0 right-0 h-full w-[86%] max-w-sm border-l shadow-[0_0_60px_rgba(34,211,238,0.25)] p-5 transition-all duration-300 ${isDark
                            ? "bg-[#08111f] border-cyan-400/20 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black">
                                    AK
                                </div>

                                <div>
                                    <h2
                                        className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        Ashish Kumar
                                    </h2>
                                    <p className="text-cyan-400 text-sm font-bold">
                                        Navigation Menu
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={closeMenu}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition hover:bg-red-500 hover:text-white ${isDark ? "bg-white/10" : "bg-gray-100"
                                    }`}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={drawerLinkClass}
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            ))}

                            <Link
                                to="/admin-login"
                                onClick={handleNavClick}
                                className={`sm:hidden flex items-center gap-3 px-4 py-4 rounded-2xl font-bold border transition ${isDark
                                    ? "border-cyan-400/30 text-cyan-300 hover:bg-cyan-400 hover:text-black"
                                    : "border-gray-200 text-gray-700 hover:bg-cyan-400 hover:text-black"
                                    }`}
                            >
                                <ShieldCheck size={20} />
                                Admin
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
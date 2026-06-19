import { Link, NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    FolderKanban,
    Code2,
    Settings,
    Star,
    MessageSquare,
    BriefcaseBusiness,
    LogOut,
    HelpCircle,
    Newspaper,
} from "lucide-react"

function AdminSidebar() {
    const links = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
        { name: "Projects", path: "/admin/projects", icon: <FolderKanban size={18} /> },
        { name: "Skills", path: "/admin/skills", icon: <Code2 size={18} /> },
        { name: "Services", path: "/admin/services", icon: <BriefcaseBusiness size={18} /> },
        { name: "Testimonials", path: "/admin/testimonials", icon: <Star size={18} /> },
        { name: "FAQ", path: "/admin/faq", icon: <HelpCircle size={18} /> },
        { name: "Blogs", path: "/admin/blogs", icon: <Newspaper size={18} /> },
        { name: "Messages", path: "/admin/messages", icon: <MessageSquare size={18} /> },
        { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
    ]

    return (
        <aside className="w-72 h-screen sticky top-0 bg-[#020817] border-r border-cyan-400/10 p-5 overflow-y-auto">
            <Link to="/" className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                    AK
                </div>

                <div>
                    <h2 className="text-xl font-black text-white">
                        Ashish <span className="text-cyan-400">Kumar</span>
                    </h2>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
            </Link>

            <nav className="space-y-3">
                {links.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive
                                ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                                : "text-gray-300 hover:bg-white/5 hover:text-cyan-400"
                            }`
                        }
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-10 border-t border-white/10 pt-5">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-cyan-400 transition"
                >
                    <LogOut size={18} />
                    Back to Website
                </Link>
            </div>
        </aside>
    )
}

export default AdminSidebar
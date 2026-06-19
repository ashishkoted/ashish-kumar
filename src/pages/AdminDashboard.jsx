import { useEffect, useState } from "react"
import { signOut } from "firebase/auth"
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore"
import { auth, db } from "../firebase/firebase"
import { Link, useNavigate } from "react-router-dom"
import AdminSidebar from "../components/AdminSidebar"
import { FolderKanban, Code2, BriefcaseBusiness, MessageSquare, LogOut, Plus } from "lucide-react"

function AdminDashboard() {
    const navigate = useNavigate()

    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        services: 0,
        messages: 0,
    })

    const [recentMessages, setRecentMessages] = useState([])
    const [recentProjects, setRecentProjects] = useState([])
    const [loading, setLoading] = useState(true)

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
        action: null,
    })

    const showPopup = (type, title, message, action = null) => {
        setPopup({ show: true, type, title, message, action })
    }

    const closePopup = () => {
        setPopup({
            show: false,
            type: "success",
            title: "",
            message: "",
            action: null,
        })
    }

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            const projectsSnap = await getDocs(collection(db, "projects"))
            const skillsSnap = await getDocs(collection(db, "skills"))
            const servicesSnap = await getDocs(collection(db, "services"))
            const messagesSnap = await getDocs(collection(db, "messages"))

            setStats({
                projects: projectsSnap.size,
                skills: skillsSnap.size,
                services: servicesSnap.size,
                messages: messagesSnap.size,
            })

            try {
                const recentProjectsQuery = query(
                    collection(db, "projects"),
                    orderBy("createdAt", "desc"),
                    limit(3)
                )

                const recentProjectsSnap = await getDocs(recentProjectsQuery)

                setRecentProjects(
                    recentProjectsSnap.docs.map((item) => ({
                        id: item.id,
                        ...item.data(),
                    }))
                )
            } catch (error) {
                setRecentProjects([])
            }

            try {
                const recentMessagesQuery = query(
                    collection(db, "messages"),
                    orderBy("createdAt", "desc"),
                    limit(3)
                )

                const recentMessagesSnap = await getDocs(recentMessagesQuery)

                setRecentMessages(
                    recentMessagesSnap.docs.map((item) => ({
                        id: item.id,
                        ...item.data(),
                    }))
                )
            } catch (error) {
                setRecentMessages([])
            }
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Dashboard data load nahi hua")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const confirmLogout = () => {
        showPopup(
            "confirm",
            "Logout?",
            "Kya aap admin panel se logout karna chahte ho?",
            async () => {
                try {
                    await signOut(auth)
                    closePopup()
                    navigate("/admin-login")
                } catch (error) {
                    console.log(error)
                    closePopup()
                    showPopup("error", "Error", "Logout nahi hua")
                }
            }
        )
    }

    const cards = [
        {
            title: "Total Projects",
            value: stats.projects,
            icon: <FolderKanban size={24} />,
            link: "/admin/projects",
        },
        {
            title: "Total Skills",
            value: stats.skills,
            icon: <Code2 size={24} />,
            link: "/admin/skills",
        },
        {
            title: "Total Services",
            value: stats.services,
            icon: <BriefcaseBusiness size={24} />,
            link: "/admin/services",
        },
        {
            title: "Messages",
            value: stats.messages,
            icon: <MessageSquare size={24} />,
            link: "/admin/messages",
        },
    ]

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-cyan-400">
                            Dashboard
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Welcome to Ashish Kumar Portfolio Admin Panel
                        </p>
                    </div>

                    <button
                        onClick={confirmLogout}
                        className="bg-red-500 px-5 py-3 rounded-xl font-bold flex items-center gap-2 w-fit"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-gray-400">
                        Loading dashboard...
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-4 gap-6">
                            {cards.map((card) => (
                                <Link
                                    key={card.title}
                                    to={card.link}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/40 hover:-translate-y-1 transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition">
                                            {card.icon}
                                        </div>

                                        <Plus className="text-gray-500 group-hover:text-cyan-400" size={20} />
                                    </div>

                                    <h2 className="text-4xl font-black text-cyan-400 mt-5">
                                        {card.value}
                                    </h2>

                                    <p className="text-gray-400 mt-2">
                                        {card.title}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 mt-10">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-2xl font-bold text-white">
                                        Recent Projects
                                    </h2>

                                    <Link to="/admin/projects" className="text-cyan-400 text-sm">
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="bg-black/30 border border-white/10 rounded-xl p-4"
                                        >
                                            <h3 className="font-bold text-cyan-400">
                                                {project.title}
                                            </h3>

                                            <p className="text-gray-500 text-sm mt-1">
                                                {project.category || "Web App"}
                                            </p>
                                        </div>
                                    ))}

                                    {recentProjects.length === 0 && (
                                        <p className="text-gray-500">
                                            No recent projects found.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-2xl font-bold text-white">
                                        Recent Messages
                                    </h2>

                                    <Link to="/admin/messages" className="text-cyan-400 text-sm">
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {recentMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className="bg-black/30 border border-white/10 rounded-xl p-4"
                                        >
                                            <h3 className="font-bold text-white">
                                                {msg.name}
                                            </h3>

                                            <p className="text-cyan-400 text-sm">
                                                {msg.email}
                                            </p>

                                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                {msg.message}
                                            </p>
                                        </div>
                                    ))}

                                    {recentMessages.length === 0 && (
                                        <p className="text-gray-500">
                                            No recent messages found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {popup.show && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 px-4">
                    <div className="w-full max-w-md bg-[#08111f] border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
                        <h2
                            className={`text-2xl font-bold mb-3 ${popup.type === "success"
                                    ? "text-green-400"
                                    : popup.type === "confirm"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                }`}
                        >
                            {popup.title}
                        </h2>

                        <p className="text-gray-300 leading-7">
                            {popup.message}
                        </p>

                        <div className="flex gap-3 mt-6">
                            {popup.type === "confirm" ? (
                                <>
                                    <button
                                        onClick={popup.action}
                                        className="bg-red-500 px-5 py-2 rounded-xl font-bold"
                                    >
                                        Yes, Logout
                                    </button>

                                    <button
                                        onClick={closePopup}
                                        className="bg-gray-600 px-5 py-2 rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={closePopup}
                                    className="bg-cyan-400 text-black px-5 py-2 rounded-xl font-bold"
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
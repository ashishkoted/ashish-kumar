import { useEffect, useMemo, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import {
    Search,
    ExternalLink,
    ArrowRight,
    Globe2,
    Code2,
    Layers,
    Star,
    MonitorSmartphone,
    FolderKanban,
    X,
    Filter,
} from "lucide-react"
import { db } from "../firebase/firebase"
import Layout from "../layout/Layout"
import ProjectModal from "../components/ProjectModal"
import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"

function Projects() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const categories = [
        "All",
        "Web App",
        "Portfolio",
        "Admin Panel",
        "Business",
        "E-Commerce",
        "Tools",
        "Firebase",
        "Full Stack",
        "Frontend",
        "Backend",
    ]

    const fetchProjects = async () => {
        try {
            setLoading(true)

            const q = query(collection(db, "projects"), orderBy("createdAt", "desc"))
            const snap = await getDocs(q)

            const data = snap.docs.map((item) => ({
                id: item.id,
                ...item.data(),
            }))

            setProjects(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const searchText = `${project.title || ""} ${project.description || ""} ${project.tech || ""
                } ${project.category || ""}`.toLowerCase()

            const matchesSearch = searchText.includes(search.toLowerCase())

            const matchesCategory =
                selectedCategory === "All" || project.category === selectedCategory

            return matchesSearch && matchesCategory
        })
    }, [projects, search, selectedCategory])

    const openProject = (project) => {
        playSound("click")
        setSelectedProject(project)
    }

    const closeProject = () => {
        playSound("click")
        setSelectedProject(null)
    }

    const clearSearch = () => {
        playSound("click")
        setSearch("")
        setSelectedCategory("All")
    }

    const stats = [
        {
            value: `${projects.length}+`,
            label: "Total Projects",
            icon: <FolderKanban size={22} />,
        },
        {
            value: `${projects.filter((p) => p.liveLink).length}+`,
            label: "Live Websites",
            icon: <Globe2 size={22} />,
        },
        {
            value: `${projects.filter(
                (p) =>
                    p.category === "Admin Panel" ||
                    p.title?.toLowerCase().includes("admin")
            ).length
                }+`,
            label: "Admin Panels",
            icon: <Code2 size={22} />,
        },
        {
            value: "100%",
            label: "Responsive",
            icon: <MonitorSmartphone size={22} />,
        },
    ]

    return (
        <Layout>
            <section
                className={`relative min-h-screen px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.13),transparent_35%)]"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-cyan-400 font-bold mb-3 flex items-center justify-center gap-2">
                            <Layers size={18} />
                            Featured Work
                        </p>

                        <h1
                            className={`text-5xl md:text-7xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            My{" "}
                            <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.8)]">
                                Projects
                            </span>
                        </h1>

                        <p
                            className={`text-lg max-w-3xl mx-auto leading-8 ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            Premium web apps, admin dashboards, Firebase projects and modern
                            responsive websites built with clean code and professional UI.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {stats.map((item) => (
                            <div
                                key={item.label}
                                className={`group border rounded-3xl p-5 text-center hover:border-cyan-400/40 hover:-translate-y-1 transition ${isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-gray-50 border-gray-200"
                                    }`}
                            >
                                <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:bg-cyan-400 group-hover:text-black transition">
                                    {item.icon}
                                </div>

                                <h3 className="text-3xl font-black text-cyan-400">
                                    {item.value}
                                </h3>

                                <p
                                    className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div
                        className={`mb-10 border rounded-3xl p-5 backdrop-blur-xl transition-all duration-500 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
                            }`}
                    >
                        <div className="grid md:grid-cols-[1fr_260px] gap-4 items-center">
                            <div className="relative w-full">
                                <Search
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"
                                        }`}
                                    size={20}
                                />

                                <input
                                    type="text"
                                    placeholder="Search projects by name, tech or category..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={`w-full border rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(34,211,238,0.18)] ${isDark
                                            ? "bg-black/40 border-white/10 text-white placeholder:text-gray-500"
                                            : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                                        }`}
                                />

                                {search && (
                                    <button
                                        onClick={() => {
                                            playSound("click")
                                            setSearch("")
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                <Filter
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"
                                        }`}
                                    size={20}
                                />

                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        playSound("click")
                                        setSelectedCategory(e.target.value)
                                    }}
                                    className={`w-full appearance-none border rounded-2xl py-4 pl-12 pr-4 outline-none cursor-pointer focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(34,211,238,0.18)] ${isDark
                                            ? "bg-black/40 border-white/10 text-white"
                                            : "bg-white border-gray-200 text-gray-900"
                                        }`}
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                            className={isDark ? "bg-[#08111f]" : "bg-white"}
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div
                            className={`mt-4 text-sm ${isDark ? "text-gray-500" : "text-gray-600"
                                }`}
                        >
                            Showing{" "}
                            <span className="text-cyan-400 font-bold">
                                {filteredProjects.length}
                            </span>{" "}
                            of{" "}
                            <span className="text-cyan-400 font-bold">
                                {projects.length}
                            </span>{" "}
                            projects
                            {selectedCategory !== "All" && (
                                <>
                                    {" "}
                                    in{" "}
                                    <span className="text-cyan-400 font-bold">
                                        {selectedCategory}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div
                            className={`border rounded-3xl p-10 text-center ${isDark
                                    ? "bg-white/5 border-white/10 text-gray-400"
                                    : "bg-gray-50 border-gray-200 text-gray-600"
                                }`}
                        >
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center animate-pulse mb-4">
                                <Code2 className="text-cyan-400" />
                            </div>
                            Loading projects...
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                            {filteredProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`group relative rounded-3xl overflow-hidden border hover:border-cyan-400/50 transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_45px_rgba(34,211,238,0.18)] ${isDark
                                            ? "bg-[#08111f]/90 border-white/10"
                                            : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    {(project.featured || index < 3) && (
                                        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center gap-1 shadow-lg">
                                            <Star size={13} />
                                            Featured
                                        </div>
                                    )}

                                    <div
                                        className={`relative h-64 overflow-hidden ${isDark ? "bg-black/40" : "bg-white"
                                            }`}
                                    >
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-contain p-4 transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div
                                                className={`w-full h-full flex flex-col items-center justify-center gap-3 ${isDark ? "text-gray-500" : "text-gray-400"
                                                    }`}
                                            >
                                                <Code2 size={42} />
                                                No Image
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold flex items-center gap-2 backdrop-blur-md">
                                            <Globe2 size={14} />
                                            {project.category || "Web App"}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3
                                            className={`text-2xl font-extrabold group-hover:text-cyan-400 transition line-clamp-2 ${isDark ? "text-white" : "text-gray-900"
                                                }`}
                                        >
                                            {project.title}
                                        </h3>

                                        <p
                                            className={`mt-3 leading-7 line-clamp-3 ${isDark ? "text-gray-400" : "text-gray-600"
                                                }`}
                                        >
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-5">
                                            {project.tech
                                                ?.split(",")
                                                .slice(0, 4)
                                                .map((item) => (
                                                    <span
                                                        key={item}
                                                        className="px-3 py-1 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-bold"
                                                    >
                                                        {item.trim()}
                                                    </span>
                                                ))}

                                            {project.tech?.split(",").length > 4 && (
                                                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm">
                                                    +{project.tech.split(",").length - 4}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mt-6">
                                            <button
                                                onClick={() => openProject(project)}
                                                className="border border-cyan-400/40 text-cyan-400 rounded-xl py-3 font-bold hover:bg-cyan-400 hover:text-black transition flex items-center justify-center gap-2"
                                            >
                                                Details
                                                <ArrowRight size={16} />
                                            </button>

                                            {project.liveLink ? (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={() => playSound("click")}
                                                    className="bg-cyan-400 text-black rounded-xl py-3 font-bold hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition flex items-center justify-center gap-2"
                                                >
                                                    Live
                                                    <ExternalLink size={16} />
                                                </a>
                                            ) : (
                                                <button
                                                    disabled
                                                    className={`border rounded-xl py-3 font-bold ${isDark
                                                            ? "bg-white/5 border-white/10 text-gray-500"
                                                            : "bg-gray-100 border-gray-200 text-gray-400"
                                                        }`}
                                                >
                                                    Live
                                                </button>
                                            )}

                                            {project.githubLink ? (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={() => playSound("click")}
                                                    className={`border rounded-xl py-3 font-bold hover:border-cyan-400/40 hover:text-cyan-400 transition flex items-center justify-center gap-2 ${isDark
                                                            ? "bg-white/10 border-white/10 text-gray-200"
                                                            : "bg-white border-gray-200 text-gray-700"
                                                        }`}
                                                >
                                                    <Code2 size={16} />
                                                    Code
                                                </a>
                                            ) : (
                                                <button
                                                    disabled
                                                    className={`border rounded-xl py-3 font-bold ${isDark
                                                            ? "bg-white/5 border-white/10 text-gray-500"
                                                            : "bg-gray-100 border-gray-200 text-gray-400"
                                                        }`}
                                                >
                                                    Code
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredProjects.length === 0 && (
                        <div
                            className={`border rounded-3xl p-10 text-center mt-8 ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <Search className="text-cyan-400 mx-auto mb-4" size={42} />

                            <h3
                                className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                No Projects Found
                            </h3>

                            <p
                                className={`mt-3 ${isDark ? "text-gray-500" : "text-gray-600"
                                    }`}
                            >
                                Try another keyword or reset filters.
                            </p>

                            <button
                                onClick={clearSearch}
                                className="mt-6 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}

                    <div
                        className={`mt-16 border rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
                            }`}
                    >
                        <div>
                            <h2
                                className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Want to see more of my work?
                            </h2>

                            <p
                                className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                Check out my GitHub profile for more projects and source code.
                            </p>
                        </div>

                        <a
                            href="https://github.com/ashishkoted"
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => playSound("click")}
                            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition"
                        >
                            <Code2 size={18} />
                            Visit GitHub
                        </a>
                    </div>
                </div>

                <ProjectModal project={selectedProject} onClose={closeProject} />
            </section>
        </Layout>
    )
}

export default Projects
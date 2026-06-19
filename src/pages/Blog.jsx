import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Link } from "react-router-dom"
import {
    Search,
    Newspaper,
    Clock3,
    Tag,
    ArrowRight,
} from "lucide-react"

import { db } from "../firebase/firebase"
import Layout from "../layout/Layout"
import { useTheme } from "../context/ThemeContext"

function Blog() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [blogs, setBlogs] = useState([])
    const [filteredBlogs, setFilteredBlogs] = useState([])

    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")

    const fetchBlogs = async () => {
        try {
            const snap = await getDocs(collection(db, "blogs"))

            const data = snap.docs
                .map((item) => ({
                    id: item.id,
                    ...item.data(),
                }))
                .filter((item) => item.published !== false)

            setBlogs(data)
            setFilteredBlogs(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    useEffect(() => {
        let result = [...blogs]

        if (search.trim()) {
            result = result.filter(
                (item) =>
                    item.title?.toLowerCase().includes(search.toLowerCase()) ||
                    item.excerpt?.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (category !== "All") {
            result = result.filter(
                (item) => item.category === category
            )
        }

        setFilteredBlogs(result)
    }, [search, category, blogs])

    const categories = [
        "All",
        "Web Development",
        "React",
        "Firebase",
        "Portfolio",
        "JavaScript",
        "Project Ideas",
        "SEO",
    ]

    return (
        <Layout>
            <section
                className={`relative px-6 py-20 min-h-screen transition-all duration-500 ${isDark
                    ? "bg-[#020817] text-white"
                    : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%)]"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                            <Newspaper size={18} />
                            Latest Articles
                        </p>

                        <h1
                            className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            My <span className="text-cyan-400">Blog</span>
                        </h1>

                        <p
                            className={`mt-4 max-w-2xl mx-auto ${isDark
                                ? "text-gray-400"
                                : "text-gray-600"
                                }`}
                        >
                            Tutorials, guides, project ideas,
                            Firebase, React and web development articles.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-10">
                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition ${isDark
                                    ? "bg-white/5 border-white/10 text-white"
                                    : "bg-gray-50 border-gray-200 text-gray-900"
                                    }`}
                            />
                        </div>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`w-full px-4 py-4 rounded-2xl border outline-none ${isDark
                                ? "bg-white/5 border-white/10 text-white"
                                : "bg-gray-50 border-gray-200 text-gray-900"
                                }`}
                        >
                            {categories.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                    className={isDark ? "bg-[#08111f] text-white" : "bg-white text-gray-900"}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div
                            className={`border rounded-2xl p-8 text-center ${isDark
                                ? "bg-white/5 border-white/10"
                                : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            Loading blogs...
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className={`group overflow-hidden rounded-3xl border hover:border-cyan-400/40 hover:-translate-y-2 transition duration-300 ${isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    {blog.coverImage ? (
                                        <img
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            className="w-full h-52 object-cover"
                                        />
                                    ) : (
                                        <div className="h-52 bg-black/30 flex items-center justify-center">
                                            <Newspaper
                                                size={50}
                                                className="text-cyan-400"
                                            />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-bold">
                                                {blog.category}
                                            </span>

                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <Clock3 size={14} />
                                                {blog.readTime}
                                            </div>
                                        </div>

                                        <h2
                                            className={`text-2xl font-bold mb-3 line-clamp-2 ${isDark
                                                ? "text-white"
                                                : "text-gray-900"
                                                }`}
                                        >
                                            {blog.title}
                                        </h2>

                                        <p
                                            className={`line-clamp-3 ${isDark
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                                }`}
                                        >
                                            {blog.excerpt}
                                        </p>

                                        {blog.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-5">
                                                {blog.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center gap-1"
                                                    >
                                                        <Tag size={12} />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <Link
                                            to={`/blog/${blog.slug}`}
                                            className="mt-6 inline-flex items-center gap-2 text-cyan-400 font-bold hover:gap-3 transition"
                                        >
                                            Read Article
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredBlogs.length === 0 && (
                        <div
                            className={`mt-10 border rounded-2xl p-8 text-center ${isDark
                                ? "bg-white/5 border-white/10"
                                : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            No blogs found.
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default Blog
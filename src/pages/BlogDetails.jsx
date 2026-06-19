import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Link, useParams } from "react-router-dom"
import {
    ArrowLeft,
    Newspaper,
    Clock3,
    Tag,
    Share2,
    BriefcaseBusiness,
} from "lucide-react"

import { db } from "../firebase/firebase"
import Layout from "../layout/Layout"
import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"

function BlogDetails() {
    const { slug } = useParams()
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const q = query(
                    collection(db, "blogs"),
                    where("slug", "==", slug)
                )

                const snap = await getDocs(q)

                if (!snap.empty) {
                    const blogData = {
                        id: snap.docs[0].id,
                        ...snap.docs[0].data(),
                    }

                    if (blogData.published !== false) {
                        setBlog(blogData)
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [slug])

    const handleShare = async () => {
        playSound("click")

        const url = window.location.href

        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog?.title || "Blog Article",
                    text: blog?.excerpt || "Read this article",
                    url,
                })
            } else {
                await navigator.clipboard.writeText(url)
                alert("Blog link copied!")
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return (
            <Layout>
                <section
                    className={`min-h-screen px-6 py-20 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                        }`}
                >
                    <div className="max-w-4xl mx-auto text-center text-gray-400">
                        Loading article...
                    </div>
                </section>
            </Layout>
        )
    }

    if (!blog) {
        return (
            <Layout>
                <section
                    className={`min-h-screen px-6 py-20 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                        }`}
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <Newspaper className="text-cyan-400 mx-auto mb-5" size={60} />

                        <h1 className="text-4xl font-black text-cyan-400">
                            Article Not Found
                        </h1>

                        <p className={isDark ? "text-gray-400 mt-4" : "text-gray-600 mt-4"}>
                            This blog article is not available or has been unpublished.
                        </p>

                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 mt-8 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold"
                        >
                            <ArrowLeft size={18} />
                            Back to Blog
                        </Link>
                    </div>
                </section>
            </Layout>
        )
    }

    return (
        <Layout>
            <section
                className={`relative min-h-screen px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%)]"></div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="mb-8">
                        <Link
                            to="/blog"
                            onClick={() => playSound("click")}
                            className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:gap-3 transition"
                        >
                            <ArrowLeft size={18} />
                            Back to Blog
                        </Link>
                    </div>

                    <div
                        className={`border rounded-3xl overflow-hidden ${isDark
                                ? "bg-white/5 border-white/10"
                                : "bg-gray-50 border-gray-200"
                            }`}
                    >
                        {blog.coverImage ? (
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full max-h-[460px] object-cover"
                            />
                        ) : (
                            <div
                                className={`h-80 flex items-center justify-center ${isDark ? "bg-black/30" : "bg-white"
                                    }`}
                            >
                                <Newspaper className="text-cyan-400" size={70} />
                            </div>
                        )}

                        <div className="p-6 md:p-10">
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <span className="px-4 py-2 rounded-full bg-cyan-400/10 text-cyan-400 text-sm font-bold">
                                    {blog.category || "Web Development"}
                                </span>

                                <span
                                    className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    <Clock3 size={16} />
                                    {blog.readTime || "5 min read"}
                                </span>
                            </div>

                            <h1
                                className={`text-4xl md:text-6xl font-black leading-tight ${isDark ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                {blog.title}
                            </h1>

                            <p
                                className={`mt-5 text-lg leading-8 ${isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                {blog.excerpt}
                            </p>

                            {blog.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {blog.tags.map((tag) => (
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

                            <div
                                className={`my-8 h-px ${isDark ? "bg-white/10" : "bg-gray-200"
                                    }`}
                            ></div>

                            <article
                                className={`prose max-w-none leading-9 whitespace-pre-line ${isDark ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                {blog.content}
                            </article>

                            <div
                                className={`mt-10 pt-6 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isDark ? "border-white/10" : "border-gray-200"
                                    }`}
                            >
                                <button
                                    onClick={handleShare}
                                    className="border border-cyan-400/40 text-cyan-400 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 hover:text-black transition"
                                >
                                    <Share2 size={18} />
                                    Share Article
                                </button>

                                <Link
                                    to="/project-request"
                                    onClick={() => playSound("click")}
                                    className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                                >
                                    <BriefcaseBusiness size={18} />
                                    Need a Website?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default BlogDetails
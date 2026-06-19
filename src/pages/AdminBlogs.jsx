import { useEffect, useState } from "react"
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore"
import {
    Newspaper,
    Plus,
    Edit,
    Trash2,
    Save,
    Image,
    CheckCircle,
    XCircle,
} from "lucide-react"

import { db } from "../firebase/firebase"
import { uploadToCloudinary } from "../utils/uploadToCloudinary"
import AdminSidebar from "../components/AdminSidebar"
import { playSound } from "../utils/playSound"

function AdminBlogs() {
    const [blogs, setBlogs] = useState([])

    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [category, setCategory] = useState("Web Development")
    const [excerpt, setExcerpt] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState("")
    const [readTime, setReadTime] = useState("5 min read")
    const [published, setPublished] = useState(true)
    const [coverImage, setCoverImage] = useState("")
    const [coverFile, setCoverFile] = useState(null)

    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
        action: null,
    })

    const showPopup = (type, title, message, action = null) => {
        playSound(type === "success" ? "success" : "error")
        setPopup({ show: true, type, title, message, action })
    }

    const closePopup = () => {
        playSound("click")
        setPopup({
            show: false,
            type: "success",
            title: "",
            message: "",
            action: null,
        })
    }

    const createSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
    }

    const makeArray = (value) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
    }

    const fetchBlogs = async () => {
        try {
            const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
            const snap = await getDocs(q)

            const data = snap.docs.map((item) => ({
                id: item.id,
                ...item.data(),
            }))

            setBlogs(data)
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Blogs load nahi huye")
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const resetForm = () => {
        setTitle("")
        setSlug("")
        setCategory("Web Development")
        setExcerpt("")
        setContent("")
        setTags("")
        setReadTime("5 min read")
        setPublished(true)
        setCoverImage("")
        setCoverFile(null)
        setEditingId(null)
    }

    const handleTitleChange = (e) => {
        const value = e.target.value
        setTitle(value)

        if (!editingId) {
            setSlug(createSlug(value))
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
            showPopup(
                "error",
                "Required",
                "Title, Slug, Excerpt aur Content required hai"
            )
            return
        }

        setLoading(true)

        try {
            let finalCoverImage = coverImage

            if (coverFile) {
                finalCoverImage = await uploadToCloudinary(coverFile)
            }

            const blogData = {
                title: title.trim(),
                slug: createSlug(slug),
                category,
                excerpt: excerpt.trim(),
                content: content.trim(),
                tags: makeArray(tags),
                readTime: readTime.trim(),
                published,
                coverImage: finalCoverImage,
                updatedAt: serverTimestamp(),
            }

            if (editingId) {
                await updateDoc(doc(db, "blogs", editingId), blogData)
                showPopup("success", "Updated", "Blog successfully update ho gaya")
            } else {
                await addDoc(collection(db, "blogs"), {
                    ...blogData,
                    createdAt: serverTimestamp(),
                })
                showPopup("success", "Added", "Blog successfully add ho gaya")
            }

            resetForm()
            await fetchBlogs()
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Blog save nahi hua")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (blog) => {
        playSound("click")

        setEditingId(blog.id)
        setTitle(blog.title || "")
        setSlug(blog.slug || "")
        setCategory(blog.category || "Web Development")
        setExcerpt(blog.excerpt || "")
        setContent(blog.content || "")
        setTags(Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "")
        setReadTime(blog.readTime || "5 min read")
        setPublished(blog.published !== false)
        setCoverImage(blog.coverImage || "")
        setCoverFile(null)

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const confirmDelete = (id) => {
        playSound("click")

        showPopup(
            "confirm",
            "Delete Blog?",
            "Kya aap is blog ko delete karna chahte ho?",
            async () => {
                try {
                    await deleteDoc(doc(db, "blogs", id))
                    closePopup()
                    showPopup("success", "Deleted", "Blog successfully delete ho gaya")
                    await fetchBlogs()
                } catch (error) {
                    console.log(error)
                    closePopup()
                    showPopup("error", "Error", "Blog delete nahi hua")
                }
            }
        )
    }

    return (
        <div className="flex min-h-screen bg-[#020817] text-white">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-cyan-400 mb-2 flex items-center gap-3">
                        <Newspaper />
                        Manage Blogs
                    </h1>

                    <p className="text-gray-400">
                        Add SEO articles, tutorials and web development content.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <Newspaper className="text-cyan-400 mb-3" />
                        <h2 className="text-3xl font-black text-cyan-400">
                            {blogs.length}
                        </h2>
                        <p className="text-gray-400 text-sm">Total Blogs</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <CheckCircle className="text-cyan-400 mb-3" />
                        <h2 className="text-3xl font-black text-cyan-400">
                            {blogs.filter((blog) => blog.published !== false).length}
                        </h2>
                        <p className="text-gray-400 text-sm">Published</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <XCircle className="text-cyan-400 mb-3" />
                        <h2 className="text-3xl font-black text-cyan-400">
                            {blogs.filter((blog) => blog.published === false).length}
                        </h2>
                        <p className="text-gray-400 text-sm">Drafts</p>
                    </div>
                </div>

                <form
                    onSubmit={handleSave}
                    className="max-w-5xl bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 mb-10"
                >
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {editingId ? <Edit size={22} /> : <Plus size={22} />}
                        {editingId ? "Edit Blog" : "Add New Blog"}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Blog Title"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="blog-slug-url"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        >
                            <option>Web Development</option>
                            <option>React</option>
                            <option>Firebase</option>
                            <option>Portfolio</option>
                            <option>JavaScript</option>
                            <option>Project Ideas</option>
                            <option>SEO</option>
                        </select>

                        <input
                            value={readTime}
                            onChange={(e) => setReadTime(e.target.value)}
                            placeholder="Read Time e.g. 5 min read"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <label className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={published}
                                onChange={(e) => setPublished(e.target.checked)}
                            />
                            <span className="text-cyan-400 font-bold">
                                Publish Blog
                            </span>
                        </label>
                    </div>

                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Short Excerpt"
                        rows="3"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Full Blog Content"
                        rows="12"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Tags comma se likho e.g. React, Firebase, Portfolio"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="Cover Image URL optional"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
                        <label className="block text-cyan-400 font-bold mb-3">
                            Upload Cover Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
                            onChange={(e) => setCoverFile(e.target.files[0] || null)}
                        />

                        {coverFile && (
                            <p className="text-green-400 text-sm mt-2">
                                Selected: {coverFile.name}
                            </p>
                        )}

                        {coverImage && (
                            <img
                                src={coverImage}
                                alt="Cover Preview"
                                className="mt-4 w-full max-h-64 object-contain bg-black/40 border border-white/10 rounded-xl p-3"
                            />
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold disabled:opacity-60 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : editingId ? "Update Blog" : "Add Blog"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    playSound("click")
                                    resetForm()
                                }}
                                className="bg-gray-600 px-6 py-3 rounded-xl font-bold"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                <div className="grid md:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/30 transition"
                        >
                            {blog.coverImage ? (
                                <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className="h-48 w-full object-cover bg-black/30"
                                />
                            ) : (
                                <div className="h-48 w-full bg-black/40 flex items-center justify-center text-gray-500">
                                    <Image />
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex justify-between items-start gap-3 mb-3">
                                    <p className="text-cyan-400 text-xs font-bold">
                                        {blog.category || "Web Development"}
                                    </p>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-black ${blog.published !== false
                                                ? "bg-green-400 text-black"
                                                : "bg-red-500 text-white"
                                            }`}
                                    >
                                        {blog.published !== false ? "Published" : "Draft"}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white line-clamp-2">
                                    {blog.title}
                                </h3>

                                <p className="text-gray-400 mt-3 line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                <p className="text-gray-500 text-sm mt-3">
                                    /blog/{blog.slug}
                                </p>

                                <div className="flex gap-3 mt-5">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => confirmDelete(blog.id)}
                                        className="bg-red-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <p className="text-gray-500 mt-6">Abhi koi blog add nahi hai.</p>
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

                        <p className="text-gray-300 leading-7">{popup.message}</p>

                        <div className="flex gap-3 mt-6">
                            {popup.type === "confirm" ? (
                                <>
                                    <button
                                        onClick={popup.action}
                                        className="bg-red-500 px-5 py-2 rounded-xl font-bold"
                                    >
                                        Yes, Delete
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

export default AdminBlogs
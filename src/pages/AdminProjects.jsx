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

import { db } from "../firebase/firebase"
import { uploadToCloudinary } from "../utils/uploadToCloudinary"
import AdminSidebar from "../components/AdminSidebar"
import { playSound } from "../utils/playSound"
import {
    Plus,
    Edit,
    Trash2,
    Image,
    Star,
    Code2,
    Globe2,
    X,
    Save,
} from "lucide-react"

function AdminProjects() {
    const [projects, setProjects] = useState([])

    const [category, setCategory] = useState("Web App")
    const [status, setStatus] = useState("Live")
    const [featured, setFeatured] = useState(false)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tech, setTech] = useState("")
    const [features, setFeatures] = useState("")
    const [screenshots, setScreenshots] = useState("")
    const [screenshotFiles, setScreenshotFiles] = useState([])
    const [oldScreenshots, setOldScreenshots] = useState([])
    const [problem, setProblem] = useState("")
    const [solution, setSolution] = useState("")
    const [liveLink, setLiveLink] = useState("")
    const [githubLink, setGithubLink] = useState("")
    const [image, setImage] = useState(null)
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

    const makeArray = (value) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
    }

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, "projects"), orderBy("createdAt", "desc"))
            const snap = await getDocs(q)

            const data = snap.docs.map((item) => ({
                id: item.id,
                ...item.data(),
            }))

            setProjects(data)
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Projects load nahi huye")
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const resetForm = () => {
        setCategory("Web App")
        setStatus("Live")
        setFeatured(false)
        setTitle("")
        setDescription("")
        setTech("")
        setFeatures("")
        setScreenshots("")
        setScreenshotFiles([])
        setOldScreenshots([])
        setProblem("")
        setSolution("")
        setLiveLink("")
        setGithubLink("")
        setImage(null)
        setEditingId(null)
    }

    const handleSaveProject = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!title.trim() || !description.trim() || !tech.trim()) {
            showPopup(
                "error",
                "Required",
                "Title, Description aur Tech Stack zaroori hai"
            )
            return
        }

        setLoading(true)

        try {
            let imageUrl = ""

            if (image) {
                imageUrl = await uploadToCloudinary(image)
            }

            let uploadedScreenshots = []

            if (screenshotFiles.length > 0) {
                uploadedScreenshots = await Promise.all(
                    screenshotFiles.map((file) => uploadToCloudinary(file))
                )
            }

            const manualScreenshotUrls = makeArray(screenshots)

            const finalScreenshots = editingId
                ? [...oldScreenshots, ...manualScreenshotUrls, ...uploadedScreenshots]
                : [...manualScreenshotUrls, ...uploadedScreenshots]

            const projectData = {
                title: title.trim(),
                description: description.trim(),
                tech: tech.trim(),
                category,
                status,
                featured,
                features: makeArray(features),
                screenshots: finalScreenshots,
                problem: problem.trim(),
                solution: solution.trim(),
                liveLink: liveLink.trim(),
                githubLink: githubLink.trim(),
                updatedAt: serverTimestamp(),
            }

            if (editingId) {
                await updateDoc(doc(db, "projects", editingId), {
                    ...projectData,
                    ...(imageUrl && { imageUrl }),
                })

                showPopup("success", "Updated", "Project successfully update ho gaya")
            } else {
                await addDoc(collection(db, "projects"), {
                    ...projectData,
                    imageUrl,
                    createdAt: serverTimestamp(),
                })

                showPopup("success", "Added", "Project successfully add ho gaya")
            }

            resetForm()
            await fetchProjects()
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Project save nahi hua")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (project) => {
        playSound("click")

        setEditingId(project.id)
        setCategory(project.category || "Web App")
        setStatus(project.status || "Live")
        setFeatured(project.featured || false)
        setTitle(project.title || "")
        setDescription(project.description || "")
        setTech(project.tech || "")

        setFeatures(
            Array.isArray(project.features)
                ? project.features.join(", ")
                : project.features || ""
        )

        setOldScreenshots(
            Array.isArray(project.screenshots) ? project.screenshots : []
        )

        setScreenshots("")
        setScreenshotFiles([])
        setProblem(project.problem || "")
        setSolution(project.solution || "")
        setLiveLink(project.liveLink || "")
        setGithubLink(project.githubLink || "")
        setImage(null)

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const removeOldScreenshot = (index) => {
        playSound("click")
        const updated = oldScreenshots.filter((_, i) => i !== index)
        setOldScreenshots(updated)
    }

    const confirmDelete = (id) => {
        playSound("click")

        showPopup(
            "confirm",
            "Delete Project?",
            "Kya aap is project ko delete karna chahte ho?",
            async () => {
                try {
                    await deleteDoc(doc(db, "projects", id))
                    closePopup()
                    showPopup("success", "Deleted", "Project successfully delete ho gaya")
                    await fetchProjects()
                } catch (error) {
                    console.log(error)
                    closePopup()
                    showPopup("error", "Error", "Project delete nahi hua")
                }
            }
        )
    }

    return (
        <div className="flex min-h-screen bg-[#020817] text-white">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h2 className="text-4xl font-black text-cyan-400 mb-2">
                        Manage Projects
                    </h2>

                    <p className="text-gray-400">
                        Add, edit and manage premium portfolio projects.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <Code2 className="text-cyan-400 mb-3" />
                        <h3 className="text-3xl font-black text-cyan-400">
                            {projects.length}
                        </h3>
                        <p className="text-gray-400 text-sm">Total Projects</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <Globe2 className="text-cyan-400 mb-3" />
                        <h3 className="text-3xl font-black text-cyan-400">
                            {projects.filter((p) => p.liveLink).length}
                        </h3>
                        <p className="text-gray-400 text-sm">Live Projects</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <Star className="text-cyan-400 mb-3" />
                        <h3 className="text-3xl font-black text-cyan-400">
                            {projects.filter((p) => p.featured).length}
                        </h3>
                        <p className="text-gray-400 text-sm">Featured Projects</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <Image className="text-cyan-400 mb-3" />
                        <h3 className="text-3xl font-black text-cyan-400">
                            {projects.filter((p) => p.screenshots?.length > 0).length}
                        </h3>
                        <p className="text-gray-400 text-sm">Gallery Projects</p>
                    </div>
                </div>

                <form
                    onSubmit={handleSaveProject}
                    className="max-w-5xl bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 mb-10 shadow-[0_0_35px_rgba(34,211,238,0.08)]"
                >
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {editingId ? <Edit size={22} /> : <Plus size={22} />}
                        {editingId ? "Edit Project" : "Add New Project"}
                    </h3>

                    <input
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Project Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Project Description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Tech Stack e.g. React, Firebase, Tailwind"
                        value={tech}
                        onChange={(e) => setTech(e.target.value)}
                    />

                    <textarea
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Features comma se likho e.g. Admin Dashboard, Project CRUD, Resume Manager"
                        rows="3"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                    />

                    <div className="grid md:grid-cols-3 gap-4">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        >
                            <option>Web App</option>
                            <option>Frontend</option>
                            <option>Backend</option>
                            <option>Full Stack</option>
                            <option>Portfolio</option>
                            <option>Admin Panel</option>
                            <option>Business</option>
                            <option>E-Commerce</option>
                            <option>Tools</option>
                            <option>Firebase</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        >
                            <option>Live</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Demo</option>
                        </select>

                        <label className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                            />
                            <span className="text-cyan-400 font-bold">
                                Featured Project
                            </span>
                        </label>
                    </div>

                    <textarea
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Extra Screenshot URLs comma se paste karo optional"
                        rows="2"
                        value={screenshots}
                        onChange={(e) => setScreenshots(e.target.value)}
                    />

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
                        <label className="block text-cyan-400 font-bold mb-3">
                            Upload Screenshots Gallery
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
                            onChange={(e) =>
                                setScreenshotFiles(Array.from(e.target.files || []))
                            }
                        />

                        {screenshotFiles.length > 0 && (
                            <p className="text-green-400 text-sm mt-2">
                                {screenshotFiles.length} new screenshots selected
                            </p>
                        )}

                        {oldScreenshots.length > 0 && (
                            <div className="mt-4">
                                <p className="text-gray-300 text-sm mb-3">Old Screenshots:</p>

                                <div className="grid md:grid-cols-4 gap-3">
                                    {oldScreenshots.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40"
                                        >
                                            <img
                                                src={img}
                                                alt="Old Screenshot"
                                                className="h-24 w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeOldScreenshot(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <textarea
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Problem: Ye project kis problem ko solve karta hai?"
                        rows="3"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                    />

                    <textarea
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Solution: Aapne iska solution kaise banaya?"
                        rows="3"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Live Demo Link"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                    />

                    <input
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="GitHub Link"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                    />

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
                        <label className="block text-cyan-400 font-bold mb-3">
                            Main Project Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
                            onChange={(e) => setImage(e.target.files[0] || null)}
                        />
                    </div>

                    {editingId && (
                        <p className="text-yellow-400 text-sm">
                            Note: New main image select karoge to old image replace ho jayegi.
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold disabled:opacity-60 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Project"
                                    : "Add Project"}
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
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/30 transition"
                        >
                            {project.imageUrl ? (
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="h-48 w-full object-contain bg-black/30 p-3"
                                />
                            ) : (
                                <div className="h-48 w-full bg-black/40 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-xl font-bold text-cyan-400">
                                        {project.title}
                                    </h3>

                                    {project.featured && (
                                        <span className="px-2 py-1 rounded-full bg-yellow-400 text-black text-xs font-black">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-400 mt-2 line-clamp-3">
                                    {project.description}
                                </p>

                                <p className="text-sm text-gray-500 mt-3">{project.tech}</p>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="text-xs text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full">
                                        {project.category || "Web App"}
                                    </span>

                                    <span className="text-xs text-green-300 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
                                        {project.status || "Live"}
                                    </span>
                                </div>

                                {project.features?.length > 0 && (
                                    <p className="text-xs text-green-400 mt-3">
                                        Features: {project.features.length}
                                    </p>
                                )}

                                {project.screenshots?.length > 0 && (
                                    <p className="text-xs text-purple-400 mt-1">
                                        Screenshots: {project.screenshots.length}
                                    </p>
                                )}

                                <div className="flex gap-3 mt-5">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => confirmDelete(project.id)}
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

                {projects.length === 0 && (
                    <p className="text-gray-500 mt-6">Abhi koi project add nahi hai.</p>
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

export default AdminProjects
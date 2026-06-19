import { useEffect, useState } from "react"
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore"

import { db } from "../firebase/firebase"
import AdminSidebar from "../components/AdminSidebar"

function AdminSkills() {
    const [skills, setSkills] = useState([])
    const [name, setName] = useState("")
    const [level, setLevel] = useState("")
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
        setPopup({
            show: true,
            type,
            title,
            message,
            action,
        })
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

    const fetchSkills = async () => {
        try {
            const snap = await getDocs(collection(db, "skills"))

            const data = snap.docs.map((item) => ({
                id: item.id,
                ...item.data(),
            }))

            setSkills(data)
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Skills load nahi hui")
        }
    }

    useEffect(() => {
        fetchSkills()
    }, [])

    const resetForm = () => {
        setName("")
        setLevel("")
        setEditingId(null)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!name.trim() || level === "") {
            showPopup("error", "Required", "Skill Name aur Level required hai")
            return
        }

        const skillLevel = Number(level)

        if (skillLevel < 0 || skillLevel > 100) {
            showPopup("error", "Invalid Level", "Level 0 se 100 ke beech hona chahiye")
            return
        }

        setLoading(true)

        try {
            if (editingId) {
                await updateDoc(doc(db, "skills", editingId), {
                    name: name.trim(),
                    level: skillLevel,
                })

                showPopup("success", "Updated", "Skill successfully update ho gayi")
            } else {
                await addDoc(collection(db, "skills"), {
                    name: name.trim(),
                    level: skillLevel,
                })

                showPopup("success", "Added", "Skill successfully add ho gayi")
            }

            resetForm()
            await fetchSkills()
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Skill save nahi hui")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (skill) => {
        setEditingId(skill.id)
        setName(skill.name || "")
        setLevel(skill.level || "")

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const confirmDelete = (id) => {
        showPopup(
            "confirm",
            "Delete Skill?",
            "Kya aap is skill ko delete karna chahte ho?",
            async () => {
                try {
                    await deleteDoc(doc(db, "skills", id))
                    closePopup()
                    showPopup("success", "Deleted", "Skill successfully delete ho gayi")
                    await fetchSkills()
                } catch (error) {
                    console.log(error)
                    closePopup()
                    showPopup("error", "Error", "Skill delete nahi hui")
                }
            }
        )
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <h1 className="text-4xl font-bold text-cyan-400 mb-2">
                    Manage Skills
                </h1>

                <p className="text-gray-400 mb-8">
                    Add, edit and delete your portfolio skills.
                </p>

                <form
                    onSubmit={handleSave}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mb-10"
                >
                    <h2 className="text-2xl font-bold text-white mb-5">
                        {editingId ? "Edit Skill" : "Add New Skill"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Skill Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 mb-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Skill Level (0-100)"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full p-4 mb-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Skill"
                                    : "Add Skill"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-600 px-6 py-3 rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/30 transition"
                        >
                            <h3 className="text-xl font-bold text-cyan-400">
                                {skill.name}
                            </h3>

                            <p className="text-gray-400 mt-2">
                                Level: {skill.level}%
                            </p>

                            <div className="w-full h-3 bg-black/40 rounded-full mt-4 overflow-hidden">
                                <div
                                    className="h-full bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                                    style={{ width: `${skill.level}%` }}
                                ></div>
                            </div>

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => handleEdit(skill)}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => confirmDelete(skill.id)}
                                    className="bg-red-500 px-4 py-2 rounded-lg font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {skills.length === 0 && (
                    <p className="text-gray-500 mt-5">No skills found.</p>
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

export default AdminSkills
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

function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState([])

    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [rating, setRating] = useState(5)
    const [message, setMessage] = useState("")
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

    const fetchTestimonials = async () => {
        try {
            const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"))
            const snap = await getDocs(q)

            setTestimonials(
                snap.docs.map((item) => ({
                    id: item.id,
                    ...item.data(),
                }))
            )
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Testimonials load nahi hue")
        }
    }

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const resetForm = () => {
        setName("")
        setRole("")
        setRating(5)
        setMessage("")
        setImage(null)
        setEditingId(null)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!name.trim() || !role.trim() || !message.trim()) {
            showPopup("error", "Required", "Name, Role aur Message required hai")
            return
        }

        setLoading(true)

        try {
            let imageUrl = ""

            if (image) {
                imageUrl = await uploadToCloudinary(image)
            }

            if (editingId) {
                await updateDoc(doc(db, "testimonials", editingId), {
                    name: name.trim(),
                    role: role.trim(),
                    rating: Number(rating),
                    message: message.trim(),
                    updatedAt: serverTimestamp(),
                    ...(imageUrl && { imageUrl }),
                })

                showPopup("success", "Updated", "Testimonial successfully update ho gaya")
            } else {
                await addDoc(collection(db, "testimonials"), {
                    name: name.trim(),
                    role: role.trim(),
                    rating: Number(rating),
                    message: message.trim(),
                    imageUrl,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                })

                showPopup("success", "Added", "Testimonial successfully add ho gaya")
            }

            resetForm()
            await fetchTestimonials()
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Testimonial save nahi hua")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item) => {
        setEditingId(item.id)
        setName(item.name || "")
        setRole(item.role || "")
        setRating(item.rating || 5)
        setMessage(item.message || "")
        setImage(null)

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const confirmDelete = (id) => {
        showPopup(
            "confirm",
            "Delete Testimonial?",
            "Kya aap is testimonial ko delete karna chahte ho?",
            async () => {
                try {
                    await deleteDoc(doc(db, "testimonials", id))
                    closePopup()
                    showPopup("success", "Deleted", "Testimonial successfully delete ho gaya")
                    await fetchTestimonials()
                } catch (error) {
                    console.log(error)
                    closePopup()
                    showPopup("error", "Error", "Testimonial delete nahi hua")
                }
            }
        )
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <h1 className="text-4xl font-black text-cyan-400 mb-2">
                    Manage Testimonials
                </h1>

                <p className="text-gray-400 mb-8">
                    Client reviews add, edit aur delete karo.
                </p>

                <form
                    onSubmit={handleSave}
                    className="max-w-3xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 mb-10"
                >
                    <h2 className="text-2xl font-bold text-white">
                        {editingId ? "Edit Testimonial" : "Add New Testimonial"}
                    </h2>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Client Name"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Role / Company e.g. Business Owner"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    >
                        <option value="5">5 Star</option>
                        <option value="4">4 Star</option>
                        <option value="3">3 Star</option>
                        <option value="2">2 Star</option>
                        <option value="1">1 Star</option>
                    </select>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Client Review Message"
                        rows="5"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0] || null)}
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
                    />

                    {editingId && (
                        <p className="text-yellow-400 text-sm">
                            New image select karoge to old image replace ho jayegi.
                        </p>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold disabled:opacity-60"
                        >
                            {loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Testimonial"
                                    : "Add Testimonial"}
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

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/30 transition"
                        >
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-full object-cover border border-cyan-400/30 mb-4"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black mb-4">
                                    {item.name?.charAt(0) || "U"}
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-cyan-400">
                                {item.name}
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                {item.role}
                            </p>

                            <p className="text-yellow-400 mt-3">
                                {"★".repeat(Number(item.rating || 5))}
                            </p>

                            <p className="text-gray-300 mt-3 leading-7">
                                {item.message}
                            </p>

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => confirmDelete(item.id)}
                                    className="bg-red-500 px-4 py-2 rounded-lg font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {testimonials.length === 0 && (
                    <p className="text-gray-500 mt-6">No testimonials found.</p>
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

export default AdminTestimonials
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

function AdminServices() {
    const [services, setServices] = useState([])

    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState("")
    const [features, setFeatures] = useState("")
    const [timeline, setTimeline] = useState("")
    const [link, setLink] = useState("")

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

    const makeArray = (value) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
    }

    const fetchServices = async () => {
        try {
            const snap = await getDocs(collection(db, "services"))

            const data = snap.docs.map((item) => ({
                id: item.id,
                ...item.data(),
            }))

            setServices(data)
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Services load nahi hui")
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const resetForm = () => {
        setTitle("")
        setDesc("")
        setPrice("")
        setFeatures("")
        setTimeline("")
        setLink("")
        setEditingId(null)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!title.trim() || !desc.trim()) {
            showPopup("error", "Required", "Title aur Description required hai")
            return
        }

        setLoading(true)

        try {
            const serviceData = {
                title: title.trim(),
                desc: desc.trim(),
                price: price.trim(),
                features: makeArray(features),
                timeline: timeline.trim(),
                link: link.trim(),
            }

            if (editingId) {
                await updateDoc(doc(db, "services", editingId), serviceData)
                showPopup("success", "Updated", "Service successfully update ho gayi")
            } else {
                await addDoc(collection(db, "services"), serviceData)
                showPopup("success", "Added", "Service successfully add ho gayi")
            }

            resetForm()
            await fetchServices()
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Service save nahi hui")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (service) => {
        setEditingId(service.id)
        setTitle(service.title || "")
        setDesc(service.desc || "")
        setPrice(service.price || "")
        setTimeline(service.timeline || "")
        setLink(service.link || "")

        setFeatures(
            Array.isArray(service.features)
                ? service.features.join(", ")
                : service.features || ""
        )

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const confirmDelete = (id) => {
        showPopup(
            "confirm",
            "Delete Service?",
            "Kya aap is service ko delete karna chahte ho?",
            async () => {
                try {
                    await deleteDoc(doc(db, "services", id))
                    closePopup()
                    showPopup("success", "Deleted", "Service successfully delete ho gayi")
                    await fetchServices()
                } catch (error) {
                    console.log(error)
                    closePopup()
                    showPopup("error", "Error", "Service delete nahi hui")
                }
            }
        )
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <h1 className="text-4xl font-bold text-cyan-400 mb-2">
                    Manage Services
                </h1>

                <p className="text-gray-400 mb-8">
                    Add, edit and delete your premium portfolio services.
                </p>

                <form
                    onSubmit={handleSave}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-3xl mb-10 space-y-4"
                >
                    <h2 className="text-2xl font-bold text-white">
                        {editingId ? "Edit Service" : "Add New Service"}
                    </h2>

                    <input
                        placeholder="Service Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <textarea
                        placeholder="Service Description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows="4"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        placeholder="Starting Price e.g. ₹4,999"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <textarea
                        placeholder="Features comma se likho e.g. Responsive Design, Admin Panel, Firebase Setup"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        rows="3"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        placeholder="Timeline e.g. 3-7 Days"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <input
                        placeholder="Learn More / Contact Link e.g. /contact"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
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
                                    ? "Update Service"
                                    : "Add Service"}
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

                <div className="grid md:grid-cols-3 gap-5">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/30 transition"
                        >
                            <h3 className="text-xl font-bold text-cyan-400">
                                {service.title}
                            </h3>

                            <p className="text-gray-400 mt-3 leading-7">
                                {service.desc}
                            </p>

                            <p className="text-cyan-400 font-black text-xl mt-4">
                                {service.price || "Custom Quote"}
                            </p>

                            <p className="text-gray-500 text-sm">
                                Timeline: {service.timeline || "Depends on project"}
                            </p>

                            {service.features?.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {service.features.slice(0, 3).map((feature, index) => (
                                        <p key={index} className="text-sm text-gray-300">
                                            ✔ {feature}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => confirmDelete(service.id)}
                                    className="bg-red-500 px-4 py-2 rounded-lg font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <p className="text-gray-500">No services found.</p>
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

export default AdminServices
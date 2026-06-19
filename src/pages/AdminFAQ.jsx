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
    HelpCircle,
    Plus,
    Edit,
    Trash2,
    Save,
    CheckCircle,
    XCircle,
} from "lucide-react"

import { db } from "../firebase/firebase"
import AdminSidebar from "../components/AdminSidebar"
import { playSound } from "../utils/playSound"

function AdminFAQ() {
    const [faqs, setFaqs] = useState([])

    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [category, setCategory] = useState("General")
    const [active, setActive] = useState(true)

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

    const fetchFaqs = async () => {
        try {
            const q = query(collection(db, "faqs"), orderBy("createdAt", "desc"))
            const snap = await getDocs(q)

            const data = snap.docs.map((item) => ({
                id: item.id,
                ...item.data(),
            }))

            setFaqs(data)
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "FAQ load nahi hua")
        }
    }

    useEffect(() => {
        fetchFaqs()
    }, [])

    const resetForm = () => {
        setQuestion("")
        setAnswer("")
        setCategory("General")
        setActive(true)
        setEditingId(null)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!question.trim() || !answer.trim()) {
            showPopup("error", "Required", "Question aur Answer required hai")
            return
        }

        setLoading(true)

        try {
            const faqData = {
                question: question.trim(),
                answer: answer.trim(),
                category: category.trim(),
                active,
                updatedAt: serverTimestamp(),
            }

            if (editingId) {
                await updateDoc(doc(db, "faqs", editingId), faqData)
                showPopup("success", "Updated", "FAQ successfully update ho gaya")
            } else {
                await addDoc(collection(db, "faqs"), {
                    ...faqData,
                    createdAt: serverTimestamp(),
                })
                showPopup("success", "Added", "FAQ successfully add ho gaya")
            }

            resetForm()
            await fetchFaqs()
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "FAQ save nahi hua")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (faq) => {
        playSound("click")
        setEditingId(faq.id)
        setQuestion(faq.question || "")
        setAnswer(faq.answer || "")
        setCategory(faq.category || "General")
        setActive(faq.active !== false)

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const confirmDelete = (id) => {
        playSound("click")

        showPopup(
            "confirm",
            "Delete FAQ?",
            "Kya aap is FAQ ko delete karna chahte ho?",
            async () => {
                try {
                    await deleteDoc(doc(db, "faqs", id))
                    closePopup()
                    showPopup("success", "Deleted", "FAQ successfully delete ho gaya")
                    await fetchFaqs()
                } catch (error) {
                    console.log(error)
                    closePopup()
                    showPopup("error", "Error", "FAQ delete nahi hua")
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
                        <HelpCircle />
                        Manage FAQ
                    </h1>

                    <p className="text-gray-400">
                        Add, edit and manage client questions for your portfolio.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <HelpCircle className="text-cyan-400 mb-3" />
                        <h2 className="text-3xl font-black text-cyan-400">
                            {faqs.length}
                        </h2>
                        <p className="text-gray-400 text-sm">Total FAQs</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <CheckCircle className="text-cyan-400 mb-3" />
                        <h2 className="text-3xl font-black text-cyan-400">
                            {faqs.filter((faq) => faq.active !== false).length}
                        </h2>
                        <p className="text-gray-400 text-sm">Active FAQs</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <XCircle className="text-cyan-400 mb-3" />
                        <h2 className="text-3xl font-black text-cyan-400">
                            {faqs.filter((faq) => faq.active === false).length}
                        </h2>
                        <p className="text-gray-400 text-sm">Hidden FAQs</p>
                    </div>
                </div>

                <form
                    onSubmit={handleSave}
                    className="max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 mb-10"
                >
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {editingId ? <Edit size={22} /> : <Plus size={22} />}
                        {editingId ? "Edit FAQ" : "Add New FAQ"}
                    </h2>

                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Question e.g. How much does a website cost?"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Answer"
                        rows="5"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        >
                            <option>General</option>
                            <option>Pricing</option>
                            <option>Timeline</option>
                            <option>Technology</option>
                            <option>Support</option>
                            <option>Payment</option>
                            <option>Project</option>
                        </select>

                        <label className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                            <span className="text-cyan-400 font-bold">
                                Show on Website
                            </span>
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold disabled:opacity-60 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
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

                <div className="grid md:grid-cols-2 gap-6">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-cyan-400/30 transition"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <p className="text-cyan-400 text-xs font-bold mb-2">
                                        {faq.category || "General"}
                                    </p>

                                    <h3 className="text-xl font-bold text-white">
                                        {faq.question}
                                    </h3>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-black ${faq.active !== false
                                            ? "bg-green-400 text-black"
                                            : "bg-red-500 text-white"
                                        }`}
                                >
                                    {faq.active !== false ? "Active" : "Hidden"}
                                </span>
                            </div>

                            <p className="text-gray-400 leading-7 line-clamp-4">
                                {faq.answer}
                            </p>

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => handleEdit(faq)}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>

                                <button
                                    onClick={() => confirmDelete(faq.id)}
                                    className="bg-red-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {faqs.length === 0 && (
                    <p className="text-gray-500 mt-6">Abhi koi FAQ add nahi hai.</p>
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

export default AdminFAQ
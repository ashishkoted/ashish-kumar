import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import {
    Send,
    User,
    Mail,
    Phone,
    BriefcaseBusiness,
    Wallet,
    Clock,
    MessageSquare,
    CheckCircle,
    X,
} from "lucide-react"
import { db } from "../firebase/firebase"
import Layout from "../layout/Layout"
import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"

function ProjectRequest() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        email: "",
        projectType: "Portfolio Website",
        budget: "₹5,000 - ₹10,000",
        timeline: "Within 7 Days",
        description: "",
    })

    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
        }))
    }

    const showPopup = (type, title, message) => {
        playSound(type === "success" ? "success" : "error")
        setPopup({ show: true, type, title, message })
    }

    const closePopup = () => {
        playSound("click")
        setPopup({
            show: false,
            type: "success",
            title: "",
            message: "",
        })
    }

    const resetForm = () => {
        setForm({
            name: "",
            mobile: "",
            email: "",
            projectType: "Portfolio Website",
            budget: "₹5,000 - ₹10,000",
            timeline: "Within 7 Days",
            description: "",
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return

        if (
            !form.name.trim() ||
            !form.mobile.trim() ||
            !form.email.trim() ||
            !form.description.trim()
        ) {
            showPopup("error", "Required", "Please fill all required fields.")
            return
        }

        if (form.mobile.trim().length !== 10) {
            showPopup(
                "error",
                "Invalid Mobile",
                "Please enter a valid 10 digit WhatsApp number."
            )
            return
        }

        setLoading(true)

        try {
            await addDoc(collection(db, "projectRequests"), {
                ...form,
                status: "New",
                createdAt: serverTimestamp(),
            })

            showPopup(
                "success",
                "Request Sent",
                "Your project request has been submitted successfully."
            )

            resetForm()
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Project request submit nahi hua.")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = `w-full border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition ${isDark
            ? "bg-black/40 border-white/10 text-white placeholder:text-gray-500"
            : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
        }`

    const selectClass = `w-full border rounded-xl py-4 px-4 outline-none focus:border-cyan-400 transition ${isDark
            ? "bg-black/40 border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`

    return (
        <Layout>
            <section
                className={`relative min-h-screen px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.13),transparent_35%)]"></div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                            <BriefcaseBusiness size={18} />
                            Start Your Project
                        </p>

                        <h1
                            className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Request a <span className="text-cyan-400">Project</span>
                        </h1>

                        <p
                            className={`mt-4 max-w-2xl mx-auto leading-8 ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            Fill this short form and share your project idea. I will review it
                            and contact you as soon as possible.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="space-y-5">
                            {[
                                ["Fast Response", "I usually reply within 24 hours."],
                                ["Clear Budget", "Choose your estimated project budget."],
                                ["Professional Work", "Clean UI, responsive design and admin panel."],
                            ].map((item) => (
                                <div
                                    key={item[0]}
                                    className={`border rounded-3xl p-6 ${isDark
                                            ? "bg-white/5 border-white/10"
                                            : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <CheckCircle className="text-cyan-400 mb-4" />
                                    <h3
                                        className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {item[0]}
                                    </h3>
                                    <p
                                        className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        {item[1]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className={`lg:col-span-2 border rounded-3xl p-8 space-y-5 shadow-[0_0_40px_rgba(34,211,238,0.08)] ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <User
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="relative">
                                    <Phone
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleChange}
                                        placeholder="WhatsApp Number"
                                        maxLength="10"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-cyan-400 font-bold mb-2">
                                        Project Type
                                    </label>
                                    <select
                                        name="projectType"
                                        value={form.projectType}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        <option>Portfolio Website</option>
                                        <option>Business Website</option>
                                        <option>E-Commerce Website</option>
                                        <option>Admin Panel</option>
                                        <option>Firebase Setup</option>
                                        <option>Custom Web App</option>
                                        <option>Website Redesign</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-cyan-400 font-bold mb-2">
                                        Budget
                                    </label>
                                    <select
                                        name="budget"
                                        value={form.budget}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        <option>₹2,000 - ₹5,000</option>
                                        <option>₹5,000 - ₹10,000</option>
                                        <option>₹10,000 - ₹20,000</option>
                                        <option>₹20,000+</option>
                                        <option>Not Sure</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-cyan-400 font-bold mb-2">
                                        Timeline
                                    </label>
                                    <select
                                        name="timeline"
                                        value={form.timeline}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        <option>Within 3 Days</option>
                                        <option>Within 7 Days</option>
                                        <option>Within 15 Days</option>
                                        <option>Within 1 Month</option>
                                        <option>Flexible</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <MessageSquare
                                    className="absolute left-4 top-5 text-gray-400"
                                    size={20}
                                />
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="7"
                                    placeholder="Tell me about your project idea..."
                                    className={inputClass}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                onClick={() => playSound("click")}
                                className="w-full bg-cyan-400 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] transition"
                            >
                                {loading ? "Submitting..." : "Submit Project Request"}
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {popup.show && (
                    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 px-4">
                        <div
                            className={`w-full max-w-md border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.25)] ${isDark ? "bg-[#08111f]" : "bg-white"
                                }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <h2
                                    className={`text-2xl font-bold mb-3 ${popup.type === "success" ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    {popup.title}
                                </h2>

                                <button
                                    onClick={closePopup}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition ${isDark ? "bg-white/10" : "bg-gray-100"
                                        }`}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p
                                className={`leading-7 ${isDark ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                {popup.message}
                            </p>

                            <button
                                onClick={closePopup}
                                className="mt-6 bg-cyan-400 text-black px-5 py-2 rounded-xl font-bold"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    )
}

export default ProjectRequest
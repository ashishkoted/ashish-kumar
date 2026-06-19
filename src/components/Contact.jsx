import { useEffect, useState } from "react"
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import Layout from "../layout/Layout"
import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"
import {
    Mail,
    User,
    MessageSquare,
    Send,
    Phone,
    MapPin,
    Code2,
} from "lucide-react"

function Contact() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [name, setName] = useState("")
    const [mobile, setMobile] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [showContact, setShowContact] = useState(true)
    const [loading, setLoading] = useState(false)

    const [profile, setProfile] = useState({
        email: "",
        whatsapp: "",
        location: "Rajasthan, India",
    })

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "settings", "profile"))

                if (snap.exists()) {
                    const data = snap.data()

                    setProfile((prev) => ({
                        ...prev,
                        ...data,
                    }))

                    setShowContact(data.showContact ?? true)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchProfile()
    }, [])

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!name.trim() || !mobile.trim() || !email.trim() || !message.trim()) {
            showPopup("error", "Required", "Please fill all fields.")
            return
        }

        if (mobile.trim().length !== 10) {
            showPopup(
                "error",
                "Invalid Mobile",
                "Please enter a valid 10 digit mobile number."
            )
            return
        }

        setLoading(true)

        try {
            await addDoc(collection(db, "messages"), {
                name: name.trim(),
                mobile: mobile.trim(),
                email: email.trim(),
                message: message.trim(),
                status: "unread",
                createdAt: serverTimestamp(),
            })

            showPopup(
                "success",
                "Message Sent",
                "Your message has been sent successfully."
            )

            setName("")
            setMobile("")
            setEmail("")
            setMessage("")
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Message send nahi hua")
        } finally {
            setLoading(false)
        }
    }

    const cardClass = `border rounded-3xl p-6 hover:border-cyan-400/40 transition ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
        }`

    const inputClass = `w-full border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition ${isDark
            ? "bg-black/40 border-white/10 text-white placeholder:text-gray-500"
            : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
        }`

    if (!showContact) return null

    return (
        <Layout>
            <section
                className={`relative px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_35%)]"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                            <MessageSquare size={18} />
                            Get In Touch
                        </p>

                        <h1
                            className={`text-5xl md:text-6xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Contact <span className="text-cyan-400">Me</span>
                        </h1>

                        <p
                            className={`max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            Have a project in mind? Send me a message and let's build
                            something professional together.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="space-y-5">
                            <div className={cardClass}>
                                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-5">
                                    <Mail />
                                </div>

                                <h3
                                    className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    Email
                                </h3>

                                <p
                                    className={`mt-2 break-all ${isDark ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    {profile.email || "Not added"}
                                </p>
                            </div>

                            <div className={cardClass}>
                                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-5">
                                    <Phone />
                                </div>

                                <h3
                                    className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    WhatsApp
                                </h3>

                                {profile.whatsapp ? (
                                    <a
                                        href={
                                            profile.whatsapp.startsWith("http")
                                                ? profile.whatsapp
                                                : `https://wa.me/${profile.whatsapp}`
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => playSound("click")}
                                        className="text-cyan-400 mt-2 inline-block font-bold"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                ) : (
                                    <p
                                        className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        Not added
                                    </p>
                                )}
                            </div>

                            <div className={cardClass}>
                                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-5">
                                    <MapPin />
                                </div>

                                <h3
                                    className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    Location
                                </h3>

                                <p
                                    className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    {profile.location || "Rajasthan, India"}
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className={`lg:col-span-2 border rounded-3xl p-8 space-y-5 shadow-[0_0_40px_rgba(34,211,238,0.08)] ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center">
                                    <Code2 />
                                </div>

                                <div>
                                    <h2
                                        className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        Start a Project
                                    </h2>

                                    <p
                                        className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"
                                            }`}
                                    >
                                        Fill the form and I will contact you soon.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <User
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    className={inputClass}
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Phone
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="tel"
                                    maxLength="10"
                                    className={inputClass}
                                    placeholder="Your Mobile Number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                                />
                            </div>

                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    className={inputClass}
                                    placeholder="Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <MessageSquare
                                    className="absolute left-4 top-5 text-gray-400"
                                    size={20}
                                />
                                <textarea
                                    rows="7"
                                    className={inputClass}
                                    placeholder="Your Message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                onClick={() => playSound("click")}
                                className="w-full bg-cyan-400 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] transition"
                            >
                                {loading ? "Sending..." : "Send Message"}
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
                            <h2
                                className={`text-2xl font-bold mb-3 ${popup.type === "success" ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {popup.title}
                            </h2>

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

export default Contact
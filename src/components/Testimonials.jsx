import { useEffect, useState } from "react"
import {
    collection,
    getDocs,
    orderBy,
    query,
    doc,
    getDoc,
} from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function Testimonials() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [testimonials, setTestimonials] = useState([])
    const [showTestimonials, setShowTestimonials] = useState(true)
    const [loading, setLoading] = useState(true)
    const [current, setCurrent] = useState(0)

    const fetchTestimonials = async () => {
        try {
            const q = query(
                collection(db, "testimonials"),
                orderBy("createdAt", "desc")
            )

            const snap = await getDocs(q)

            setTestimonials(
                snap.docs.map((item) => ({
                    id: item.id,
                    ...item.data(),
                }))
            )
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSettings = async () => {
        try {
            const snap = await getDoc(doc(db, "settings", "profile"))

            if (snap.exists()) {
                const data = snap.data()
                setShowTestimonials(data.showTestimonials ?? true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTestimonials()
        fetchSettings()
    }, [])

    useEffect(() => {
        if (testimonials.length === 0) return

        const interval = setInterval(() => {
            setCurrent((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            )
        }, 4000)

        return () => clearInterval(interval)
    }, [testimonials])

    const nextSlide = () => {
        setCurrent((prev) =>
            prev === testimonials.length - 1 ? 0 : prev + 1
        )
    }

    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        )
    }

    if (!showTestimonials) return null
    if (loading) return null
    if (testimonials.length === 0) return null

    const item = testimonials[current]

    return (
        <section
            className={`relative px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]"></div>

            <div className="relative max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                        <Star size={18} />
                        Client Reviews
                    </p>

                    <h2
                        className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                            }`}
                    >
                        What Clients <span className="text-cyan-400">Say</span>
                    </h2>

                    <p
                        className={`mt-4 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Real feedback from clients and people I worked with.
                    </p>
                </div>

                <div
                    className={`relative border rounded-3xl p-8 md:p-10 shadow-[0_0_45px_rgba(34,211,238,0.12)] transition-all duration-500 ${isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-gray-50 border-gray-200"
                        }`}
                >
                    <Quote className="text-cyan-400 mb-6" size={42} />

                    <p className="text-yellow-400 mb-5 text-xl">
                        {"★".repeat(Number(item.rating || 5))}
                    </p>

                    <p
                        className={`text-lg md:text-xl leading-9 ${isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                    >
                        “{item.message}”
                    </p>

                    <div className="flex items-center gap-4 mt-8">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 rounded-full object-cover border border-cyan-400/30"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black text-xl">
                                {item.name?.charAt(0) || "U"}
                            </div>
                        )}

                        <div>
                            <h3
                                className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                {item.name}
                            </h3>

                            <p className={isDark ? "text-gray-500" : "text-gray-600"}>
                                {item.role}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={`w-3 h-3 rounded-full transition ${current === index
                                            ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                                            : isDark
                                                ? "bg-white/20"
                                                : "bg-gray-300"
                                        }`}
                                ></button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={prevSlide}
                                className={`w-11 h-11 rounded-full border flex items-center justify-center hover:bg-cyan-400 hover:text-black transition ${isDark
                                        ? "bg-white/5 border-white/10 text-white"
                                        : "bg-white border-gray-200 text-gray-700"
                                    }`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={nextSlide}
                                className={`w-11 h-11 rounded-full border flex items-center justify-center hover:bg-cyan-400 hover:text-black transition ${isDark
                                        ? "bg-white/5 border-white/10 text-white"
                                        : "bg-white border-gray-200 text-gray-700"
                                    }`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonials
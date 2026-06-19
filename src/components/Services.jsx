import { useEffect, useState } from "react"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import {
    Code2,
    BriefcaseBusiness,
    Sparkles,
    ArrowRight,
    X,
    CheckCircle,
    Clock,
    IndianRupee,
    MessageCircle,
} from "lucide-react"
import { db } from "../firebase/firebase"
import Layout from "../layout/Layout"
import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"

function Services() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [services, setServices] = useState([])
    const [selectedService, setSelectedService] = useState(null)
    const [showServices, setShowServices] = useState(true)
    const [loading, setLoading] = useState(true)

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
        } finally {
            setLoading(false)
        }
    }

    const fetchSettings = async () => {
        const snap = await getDoc(doc(db, "settings", "profile"))

        if (snap.exists()) {
            const data = snap.data()
            setShowServices(data.showServices ?? true)
        }
    }

    useEffect(() => {
        fetchSettings()
        fetchServices()
    }, [])

    const openServiceModal = (service) => {
        playSound("click")
        setSelectedService(service)
    }

    const closeServiceModal = () => {
        playSound("click")
        setSelectedService(null)
    }

    if (!showServices) return null

    return (
        <Layout>
            <section
                className={`relative px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                            <BriefcaseBusiness size={18} />
                            What I Offer
                        </p>

                        <h1
                            className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            My <span className="text-cyan-400">Services</span>
                        </h1>

                        <p
                            className={`mt-4 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            I provide complete digital solutions from design to development,
                            admin panel, Firebase setup and responsive UI.
                        </p>
                    </div>

                    <div className="mb-10 flex justify-center">
                        <div
                            className={`border border-cyan-400/20 rounded-2xl px-8 py-5 text-center transition-all duration-500 ${isDark ? "bg-white/5" : "bg-gray-50"
                                }`}
                        >
                            <h3 className="text-4xl font-black text-cyan-400">
                                {services.length}
                            </h3>

                            <p
                                className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Total Services
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div
                            className={`border rounded-2xl p-8 text-center ${isDark
                                    ? "bg-white/5 border-white/10 text-gray-400"
                                    : "bg-gray-50 border-gray-200 text-gray-600"
                                }`}
                        >
                            Loading services...
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className={`group relative border rounded-3xl p-7 hover:border-cyan-400/40 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(34,211,238,0.14)] transition overflow-hidden ${isDark
                                            ? "bg-white/5 border-white/10"
                                            : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-cyan-400/10 blur-2xl group-hover:bg-cyan-400/20"></div>

                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition">
                                            <Code2 />
                                        </div>

                                        <span
                                            className={`text-4xl font-black ${isDark ? "text-gray-600" : "text-gray-300"
                                                }`}
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <h3
                                        className={`text-2xl font-bold group-hover:text-cyan-400 transition ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {service.title}
                                    </h3>

                                    <p
                                        className={`mt-3 leading-7 line-clamp-3 ${isDark ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        {service.desc}
                                    </p>

                                    <div className="mt-5">
                                        <p className="text-cyan-400 font-black text-2xl">
                                            {service.price || "Custom Quote"}
                                        </p>

                                        <p
                                            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"
                                                }`}
                                        >
                                            Starting Price
                                        </p>
                                    </div>

                                    {service.timeline && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-cyan-400 font-bold">
                                            <Clock size={16} />
                                            Timeline: {service.timeline}
                                        </div>
                                    )}

                                    <div className="mt-6 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                                            <Sparkles size={16} />
                                            Premium
                                        </div>

                                        <button
                                            onClick={() => openServiceModal(service)}
                                            className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold flex items-center gap-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                                        >
                                            Learn More
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && services.length === 0 && (
                        <div
                            className={`border rounded-2xl p-8 text-center mt-8 ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <p className={isDark ? "text-gray-500" : "text-gray-600"}>
                                No services found.
                            </p>
                        </div>
                    )}
                </div>

                {selectedService && (
                    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                        <div
                            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto border rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.25)] ${isDark
                                    ? "bg-[#08111f] border-cyan-400/20 text-white"
                                    : "bg-white border-gray-200 text-gray-900"
                                }`}
                        >
                            <div
                                className={`sticky top-0 flex items-center justify-between p-5 border-b backdrop-blur-xl ${isDark
                                        ? "bg-[#08111f]/95 border-white/10"
                                        : "bg-white/95 border-gray-200"
                                    }`}
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-cyan-400">
                                        {selectedService.title}
                                    </h2>

                                    <p
                                        className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-600"
                                            }`}
                                    >
                                        Premium Service Details
                                    </p>
                                </div>

                                <button
                                    onClick={closeServiceModal}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition ${isDark ? "bg-white/10" : "bg-gray-100"
                                        }`}
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="p-6 space-y-7">
                                <div
                                    className={`border rounded-2xl p-6 ${isDark
                                            ? "bg-white/5 border-white/10"
                                            : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <h3 className="text-xl font-bold text-cyan-400 mb-3">
                                        Service Description
                                    </h3>

                                    <p
                                        className={`leading-8 ${isDark ? "text-gray-300" : "text-gray-700"
                                            }`}
                                    >
                                        {selectedService.desc}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div
                                        className={`border rounded-2xl p-6 ${isDark
                                                ? "bg-white/5 border-white/10"
                                                : "bg-gray-50 border-gray-200"
                                            }`}
                                    >
                                        <IndianRupee className="text-cyan-400 mb-3" />
                                        <h3 className="text-3xl font-black text-cyan-400">
                                            {selectedService.price || "Custom Quote"}
                                        </h3>
                                        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                            Starting Price
                                        </p>
                                    </div>

                                    <div
                                        className={`border rounded-2xl p-6 ${isDark
                                                ? "bg-white/5 border-white/10"
                                                : "bg-gray-50 border-gray-200"
                                            }`}
                                    >
                                        <Clock className="text-cyan-400 mb-3" />
                                        <h3 className="text-3xl font-black text-cyan-400">
                                            {selectedService.timeline || "Flexible"}
                                        </h3>
                                        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                            Delivery Timeline
                                        </p>
                                    </div>
                                </div>

                                {selectedService.features?.length > 0 && (
                                    <div
                                        className={`border rounded-2xl p-6 ${isDark
                                                ? "bg-white/5 border-white/10"
                                                : "bg-gray-50 border-gray-200"
                                            }`}
                                    >
                                        <h3 className="text-xl font-bold text-cyan-400 mb-5">
                                            What's Included?
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            {selectedService.features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-start gap-3 p-4 rounded-xl border ${isDark
                                                            ? "bg-black/30 border-white/10"
                                                            : "bg-white border-gray-200"
                                                        }`}
                                                >
                                                    <CheckCircle
                                                        size={20}
                                                        className="text-cyan-400 mt-1"
                                                    />
                                                    <p
                                                        className={
                                                            isDark ? "text-gray-300" : "text-gray-700"
                                                        }
                                                    >
                                                        {feature}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-4 pt-2">
                                    <a
                                        href="/contact"
                                        onClick={() => playSound("click")}
                                        className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                                    >
                                        <MessageCircle size={18} />
                                        Get Quote
                                    </a>

                                    {selectedService.link && (
                                        <a
                                            href={selectedService.link}
                                            target={
                                                selectedService.link.startsWith("http")
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                            rel="noreferrer"
                                            onClick={() => playSound("click")}
                                            className="border border-cyan-400/40 text-cyan-400 px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 hover:text-black transition"
                                        >
                                            Visit Link
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    )
}

export default Services
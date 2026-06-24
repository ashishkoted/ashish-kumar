import { lazy, Suspense, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { useTheme } from "../context/ThemeContext"
import {
    Code2,
    Rocket,
    FileText,
    Mail,
    Send,
    X,
    ExternalLink,
    FolderKanban,
    Sparkles,
} from "lucide-react"

const Typewriter = lazy(() =>
    import("react-simple-typewriter").then((module) => ({
        default: module.Typewriter,
    }))
)

function getOptimizedImage(url, width = 700) {
    if (!url) return ""

    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
        return url.replace(
            "/upload/",
            `/upload/f_auto,q_auto,w_${width},dpr_auto/`
        )
    }

    return url
}

function Hero() {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const resumeUrl = "/resume.pdf"

    const [showResumePopup, setShowResumePopup] = useState(false)
    const [loading, setLoading] = useState(true)

    const [profile, setProfile] = useState({
        name: "Ashish Kumar",
        title: "React Developer",
        subtitle: "Admin Panel Creator",
        bio: "I build modern websites, web applications, dashboards and powerful admin panels using React, Firebase, Tailwind CSS and clean UI design.",
        github: "",
        linkedin: "",
        email: "",
        whatsapp: "",
        profileImage: "",
        showAvailability: true,
        availabilityText: "Available For Freelance Projects",
        responseTime: "Under 24 Hours",
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const cachedProfile = localStorage.getItem("portfolioProfile")

                if (cachedProfile) {
                    setProfile((prev) => ({
                        ...prev,
                        ...JSON.parse(cachedProfile),
                    }))
                    setLoading(false)
                }

                const ref = doc(db, "settings", "profile")
                const snap = await getDoc(ref)

                if (snap.exists()) {
                    const data = snap.data()

                    setProfile((prev) => ({
                        ...prev,
                        ...data,
                    }))

                    localStorage.setItem("portfolioProfile", JSON.stringify(data))
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const typeWords = [
        profile.title || "React Developer",
        profile.subtitle || "Admin Panel Creator",
        "Firebase Developer",
        "Web App Builder",
        "Frontend Designer",
    ]

    return (
        <section
            className={`relative min-h-screen flex items-center overflow-hidden px-6 pt-24 transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.15),transparent_35%)]"></div>

            <div className="hidden lg:block absolute top-28 right-10 w-28 h-28 rounded-full bg-cyan-400/10 blur-2xl"></div>
            <div className="hidden lg:block absolute bottom-20 left-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="fade-up">
                    <p className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                        <Rocket size={18} />
                        Welcome to my digital world
                    </p>

                    {profile.showAvailability && (
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/30 text-green-400 font-bold mb-5">
                            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                            {profile.availabilityText || "Available For Freelance Projects"}
                            <span className="text-gray-400 font-medium">
                                • {profile.responseTime || "Under 24 Hours"}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-bold">
                            ✔ Currently Accepting New Projects
                        </div>

                        <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-400 text-sm font-bold">
                            ✔ React • Firebase • Admin Panels
                        </div>

                        <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-400/20 text-green-400 text-sm font-bold">
                            ✔ 24/7 Support
                        </div>
                    </div>

                    <h1
                        className={`text-5xl md:text-7xl font-black leading-tight ${isDark ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Hi, I'm{" "}
                        <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.8)]">
                            {loading ? "Ashish Kumar" : profile.name}
                        </span>
                    </h1>

                    <h2
                        className={`text-2xl md:text-3xl mt-5 font-bold ${isDark ? "text-gray-200" : "text-gray-700"
                            }`}
                    >
                        I am a{" "}
                        <span className="text-cyan-400">
                            <Suspense fallback={<span>{profile.title || "React Developer"}</span>}>
                                <Typewriter
                                    words={typeWords}
                                    loop={0}
                                    cursor
                                    cursorStyle="|"
                                    typeSpeed={70}
                                    deleteSpeed={45}
                                />
                            </Suspense>
                        </span>
                    </h2>

                    <p
                        className={`mt-6 text-lg leading-8 max-w-xl ${isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        {profile.bio}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link
                            to="/project-request"
                            className="bg-cyan-400 text-black px-7 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition"
                        >
                            <Sparkles size={18} />
                            Start Project
                        </Link>

                        <Link
                            to="/projects"
                            className={`border border-cyan-400/40 px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-400 hover:text-black transition ${isDark ? "text-cyan-300" : "text-cyan-700"
                                }`}
                        >
                            <FolderKanban size={18} />
                            View Projects
                        </Link>

                        <button
                            type="button"
                            onClick={() => setShowResumePopup(true)}
                            aria-label="Open resume preview"
                            className={`border px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-400 hover:text-black transition ${isDark
                                    ? "border-white/10 text-gray-300"
                                    : "border-gray-200 text-gray-700"
                                }`}
                        >
                            <FileText size={18} />
                            View Resume
                        </button>
                    </div>

                    <div className="flex gap-4 mt-8">
                        {profile.github && (
                            <a
                                href="https://github.com/ashishkoted"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Visit GitHub profile"
                                className={`w-11 h-11 rounded-full border flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400 transition ${isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-gray-100 border-gray-200 text-gray-700"
                                    }`}
                            >
                                <Code2 size={20} />
                            </a>
                        )}

                        <a
                            href="https://t.me/ashishkoted"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Contact on Telegram"
                            className={`w-11 h-11 rounded-full border flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400 transition ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-100 border-gray-200 text-gray-700"
                                }`}
                        >
                            <Send size={20} />
                        </a>

                        {profile.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                aria-label="Send email"
                                className={`w-11 h-11 rounded-full border flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400 transition ${isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-gray-100 border-gray-200 text-gray-700"
                                    }`}
                            >
                                <Mail size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <div className="relative float">
                    <div className="hidden lg:block absolute -inset-6 bg-cyan-400/20 blur-3xl rounded-full"></div>

                    <div
                        className={`relative border border-cyan-400/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(34,211,238,0.15)] transition-all duration-500 ${isDark ? "bg-white/5" : "bg-gray-50"
                            }`}
                    >
                        <div className="flex gap-2 mb-5">
                            <span className="w-3 h-3 rounded-full bg-red-400"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                            <span className="w-3 h-3 rounded-full bg-green-400"></span>
                        </div>

                        {profile.profileImage ? (
                            <div className="mb-6">
                                <img
                                    src={getOptimizedImage(profile.profileImage, 700)}
                                    alt={`${profile.name} - React Developer Portfolio`}
                                    width="600"
                                    height="600"
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="async"
                                    className={`w-full max-h-[320px] object-contain rounded-2xl border border-cyan-400/20 p-3 ${isDark ? "bg-black/30" : "bg-white"
                                        }`}
                                />
                            </div>
                        ) : (
                            <div
                                className={`mb-6 h-60 rounded-2xl border border-cyan-400/20 flex items-center justify-center ${isDark ? "bg-black/30" : "bg-white"
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-3xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4">
                                        <Code2 size={42} className="text-cyan-400" />
                                    </div>

                                    <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                                        Profile Image Not Added
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="font-mono text-sm md:text-base space-y-3">
                            <p>
                                <span className="text-purple-400">const</span> developer = {"{"}
                            </p>

                            <p className="pl-5">
                                name:{" "}
                                <span className="text-cyan-400">
                                    "{profile.name || "Ashish Kumar"}"
                                </span>
                                ,
                            </p>

                            <p className="pl-5">
                                skills:{" "}
                                <span className="text-green-400">
                                    ["React", "Firebase", "Tailwind"]
                                </span>
                                ,
                            </p>

                            <p className="pl-5">
                                role:{" "}
                                <span className="text-yellow-400">
                                    "{profile.title || "Web Developer"}"
                                </span>
                                ,
                            </p>

                            <p className="pl-5">
                                mission:{" "}
                                <span className="text-pink-400">"Build Premium Websites"</span>
                            </p>

                            <p>{"}"}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {[
                                ["10+", "Projects"],
                                ["5+", "Web Apps"],
                                ["100%", "Responsive"],
                            ].map((item) => (
                                <div
                                    key={item[1]}
                                    className={`rounded-xl p-4 text-center ${isDark
                                            ? "bg-black/30"
                                            : "bg-white border border-gray-200"
                                        }`}
                                >
                                    <h3 className="text-2xl font-black text-cyan-400">
                                        {item[0]}
                                    </h3>
                                    <p
                                        className={
                                            isDark
                                                ? "text-xs text-gray-400"
                                                : "text-xs text-gray-500"
                                        }
                                    >
                                        {item[1]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute -bottom-6 -left-6 bg-cyan-400 text-black p-5 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                        <Code2 size={34} />
                    </div>

                    <Link
                        to="/about"
                        aria-label="Go to about page"
                        className={`absolute -top-6 -right-6 border border-cyan-400/20 text-cyan-400 p-4 rounded-2xl backdrop-blur-xl hover:bg-cyan-400 hover:text-black transition ${isDark ? "bg-white/10" : "bg-white"
                            }`}
                    >
                        <ExternalLink size={26} />
                    </Link>
                </div>
            </div>

            {showResumePopup && (
                <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className={`w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border shadow-[0_0_50px_rgba(34,211,238,0.25)] ${isDark
                                ? "bg-[#08111f] border-cyan-400/20 text-white"
                                : "bg-white border-gray-200 text-gray-900"
                            }`}
                    >
                        <div
                            className={`flex items-center justify-between p-5 border-b ${isDark ? "border-white/10" : "border-gray-200"
                                }`}
                        >
                            <div>
                                <h2 className="text-2xl font-black text-cyan-400">
                                    Resume Preview
                                </h2>
                                <p className={isDark ? "text-gray-500 text-sm" : "text-gray-600 text-sm"}>
                                    View resume first, then download if needed.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowResumePopup(false)}
                                aria-label="Close resume preview"
                                className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition ${isDark ? "bg-white/10" : "bg-gray-100"
                                    }`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            <iframe
                                loading="lazy"
                                src={resumeUrl}
                                title="Ashish Kumar Resume Preview"
                                className={`w-full h-[70vh] rounded-2xl border ${isDark
                                        ? "bg-black/40 border-white/10"
                                        : "bg-white border-gray-200"
                                    }`}
                            ></iframe>
                        </div>

                        <div
                            className={`flex flex-col sm:flex-row justify-end gap-3 p-5 border-t ${isDark ? "border-white/10" : "border-gray-200"
                                }`}
                        >
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-cyan-400/40 text-cyan-400 px-6 py-3 rounded-xl font-bold text-center hover:bg-cyan-400 hover:text-black transition"
                            >
                                Open Full Page
                            </a>

                            <a
                                href={resumeUrl}
                                download="Ashish-Kumar-Resume.pdf"
                                className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold text-center hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                            >
                                Download Resume
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Hero
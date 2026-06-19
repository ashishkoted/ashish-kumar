import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Code2, Mail, User } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function Footer() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [profile, setProfile] = useState({
        name: "Ashish Kumar",
        title: "React • Firebase • Tailwind Developer",
        github: "",
        linkedin: "",
        email: "",
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "settings", "profile"))

                if (snap.exists()) {
                    setProfile((prev) => ({
                        ...prev,
                        ...snap.data(),
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchProfile()
    }, [])

    return (
        <footer
            className={`border-t px-6 py-8 transition-all duration-500 ${isDark
                    ? "bg-[#020817] border-cyan-400/10"
                    : "bg-white border-gray-200"
                }`}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h2
                        className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"
                            }`}
                    >
                        {profile.name?.split(" ")[0] || "Ashish"}{" "}
                        <span className="text-cyan-400">
                            {profile.name?.split(" ").slice(1).join(" ") || "Kumar"}
                        </span>
                    </h2>

                    <p
                        className={`mt-1 ${isDark ? "text-gray-500" : "text-gray-600"
                            }`}
                    >
                        {profile.title || "React • Firebase • Tailwind Developer"}
                    </p>
                </div>

                <div
                    className={`flex flex-wrap gap-4 ${isDark ? "text-gray-400" : "text-gray-700"
                        }`}
                >
                    <Link to="/about" className="hover:text-cyan-400 transition">
                        About
                    </Link>

                    <Link to="/skills" className="hover:text-cyan-400 transition">
                        Skills
                    </Link>

                    <Link to="/projects" className="hover:text-cyan-400 transition">
                        Projects
                    </Link>

                    <Link to="/services" className="hover:text-cyan-400 transition">
                        Services
                    </Link>

                    <Link to="/contact" className="hover:text-cyan-400 transition">
                        Contact
                    </Link>
                </div>

                <div className="flex gap-3">
                    {profile.github && (
                        <a
                            href={profile.github}
                            target="_blank"
                            rel="noreferrer"
                            className={`w-10 h-10 rounded-full border flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400 transition ${isDark
                                    ? "bg-white/5 border-white/10 text-gray-300"
                                    : "bg-gray-100 border-gray-200 text-gray-700"
                                }`}
                        >
                            <Code2 size={18} />
                        </a>
                    )}

                    {profile.linkedin && (
                        <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className={`w-10 h-10 rounded-full border flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400 transition ${isDark
                                    ? "bg-white/5 border-white/10 text-gray-300"
                                    : "bg-gray-100 border-gray-200 text-gray-700"
                                }`}
                        >
                            <User size={18} />
                        </a>
                    )}

                    {profile.email && (
                        <a
                            href={`mailto:${profile.email}`}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400 transition ${isDark
                                    ? "bg-white/5 border-white/10 text-gray-300"
                                    : "bg-gray-100 border-gray-200 text-gray-700"
                                }`}
                        >
                            <Mail size={18} />
                        </a>
                    )}
                </div>
            </div>

            <div
                className={`max-w-7xl mx-auto mt-6 pt-5 border-t text-center text-sm ${isDark
                        ? "border-white/10 text-gray-500"
                        : "border-gray-200 text-gray-600"
                    }`}
            >
                © 2026 {profile.name || "Ashish Kumar"}. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Code2, Layers3 } from "lucide-react"
import { db } from "../firebase/firebase"
import Layout from "../layout/Layout"
import { useTheme } from "../context/ThemeContext"

function Skills() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)

    const getSkillLogo = (name) => {
        const skill = name?.toLowerCase() || ""

        if (skill.includes("html"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"

        if (skill.includes("css"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"

        if (skill.includes("javascript") || skill.includes("js"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"

        if (skill.includes("react"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"

        if (skill.includes("firebase"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"

        if (skill.includes("tailwind"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"

        if (skill.includes("git"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"

        if (skill.includes("github"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"

        if (skill.includes("node"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"

        if (skill.includes("mongodb"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"

        if (skill.includes("mysql"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"

        if (skill.includes("vite"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg"

        if (skill.includes("php"))
            return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"

        return null
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
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSkills()
    }, [])

    return (
        <Layout>
            <section
                className={`relative px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%)]"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                            <Layers3 size={18} />
                            Technical Expertise
                        </p>

                        <h1
                            className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            My <span className="text-cyan-400">Skills</span>
                        </h1>

                        <p
                            className={`mt-4 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            Technologies and tools I use to build modern websites, web
                            applications and admin dashboards.
                        </p>
                    </div>

                    <div className="mb-10 flex justify-center">
                        <div
                            className={`border border-cyan-400/20 rounded-2xl px-8 py-5 text-center transition-all duration-500 ${isDark ? "bg-white/5" : "bg-gray-50"
                                }`}
                        >
                            <h3 className="text-4xl font-black text-cyan-400">
                                {skills.length}
                            </h3>

                            <p
                                className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Total Skills
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
                            Loading skills...
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className={`border rounded-2xl p-6 hover:border-cyan-400/40 hover:-translate-y-1 transition duration-300 ${isDark
                                            ? "bg-white/5 border-white/10"
                                            : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                                                {getSkillLogo(skill.name) ? (
                                                    <img
                                                        src={getSkillLogo(skill.name)}
                                                        alt={skill.name}
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                ) : (
                                                    <Code2 className="text-cyan-400" />
                                                )}
                                            </div>

                                            <h3
                                                className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                                    }`}
                                            >
                                                {skill.name}
                                            </h3>
                                        </div>

                                        <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-bold">
                                            {skill.level}%
                                        </span>
                                    </div>

                                    <div
                                        className={`w-full h-3 rounded-full overflow-hidden ${isDark ? "bg-black/40" : "bg-gray-200"
                                            }`}
                                    >
                                        <div
                                            className="h-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)] rounded-full"
                                            style={{
                                                width: `${skill.level}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && skills.length === 0 && (
                        <div
                            className={`border rounded-2xl p-8 text-center mt-8 ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <p className={isDark ? "text-gray-500" : "text-gray-600"}>
                                No skills found.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default Skills
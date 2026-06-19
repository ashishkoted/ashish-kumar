import {
    BriefcaseBusiness,
    GraduationCap,
    CalendarDays,
    Code2,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function TimelineSection() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const experience = [
        {
            year: "2024",
            title: "Started Web Development",
            desc: "Started learning HTML, CSS, JavaScript and basic website structure.",
        },
        {
            year: "2025",
            title: "React & Firebase Projects",
            desc: "Built dynamic websites, admin panels, authentication systems and Firebase-based web apps.",
        },
        {
            year: "2026",
            title: "Professional Portfolio & Full Projects",
            desc: "Created premium portfolio, business websites, dashboards, CRUD systems and responsive web applications.",
        },
    ]

    const education = [
        {
            year: "2022 - 2026",
            title: "B.Sc. Agriculture",
            desc: "Completed/Studying Bachelor of Science in Agriculture with strong interest in technology and digital business.",
        },
        {
            year: "Self Learning",
            title: "Web Development",
            desc: "Learned React, Firebase, Tailwind CSS, GitHub, Vercel deployment and modern frontend development.",
        },
    ]

    const TimelineCard = ({ item, type }) => (
        <div
            className={`relative pl-8 pb-8 border-l ${isDark ? "border-white/10" : "border-gray-200"
                }`}
        >
            <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                {type === "experience" ? (
                    <BriefcaseBusiness size={16} />
                ) : (
                    <GraduationCap size={16} />
                )}
            </div>

            <div
                className={`rounded-2xl p-5 border hover:border-cyan-400/40 transition ${isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-gray-50 border-gray-200"
                    }`}
            >
                <p className="text-cyan-400 font-bold flex items-center gap-2 mb-2">
                    <CalendarDays size={16} />
                    {item.year}
                </p>

                <h3
                    className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"
                        }`}
                >
                    {item.title}
                </h3>

                <p
                    className={`mt-2 leading-7 ${isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                >
                    {item.desc}
                </p>
            </div>
        </div>
    )

    return (
        <div className="mt-20">
            <div className="text-center mb-12">
                <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                    <Code2 size={18} />
                    My Journey
                </p>

                <h2
                    className={`text-4xl md:text-5xl font-black ${isDark ? "text-white" : "text-gray-900"
                        }`}
                >
                    Experience & <span className="text-cyan-400">Education</span>
                </h2>

                <p
                    className={`mt-4 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                >
                    My learning path, education background and web development journey.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div>
                    <h3 className="text-2xl font-black text-cyan-400 mb-6">
                        Experience Timeline
                    </h3>

                    {experience.map((item, index) => (
                        <TimelineCard key={index} item={item} type="experience" />
                    ))}
                </div>

                <div>
                    <h3 className="text-2xl font-black text-cyan-400 mb-6">
                        Education Timeline
                    </h3>

                    {education.map((item, index) => (
                        <TimelineCard key={index} item={item} type="education" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TimelineSection
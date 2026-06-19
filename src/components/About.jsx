import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import Layout from "../layout/Layout"
import TimelineSection from "./TimelineSection"
import { db } from "../firebase/firebase"
import { useTheme } from "../context/ThemeContext"
import {
    Code2,
    Rocket,
    Target,
    Award,
    Globe,
    Database,
} from "lucide-react"

function About() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [profile, setProfile] = useState({
        name: "Ashish Kumar",
        title: "React & Firebase Developer",
        bio: "I build premium websites, web applications, dashboards and admin panels using React, Firebase, Tailwind CSS and clean UI design.",
        profileImage: "",
    })

    const features = [
        {
            icon: <Code2 />,
            title: "Clean Code",
            text: "Readable, scalable and maintainable code architecture.",
        },
        {
            icon: <Rocket />,
            title: "Fast Websites",
            text: "Optimized websites with high performance and responsiveness.",
        },
        {
            icon: <Target />,
            title: "Goal Focused",
            text: "Business-oriented solutions with real results.",
        },
        {
            icon: <Award />,
            title: "Premium Design",
            text: "Modern UI/UX with professional appearance.",
        },
        {
            icon: <Globe />,
            title: "Full Responsive",
            text: "Perfect experience across desktop, tablet and mobile.",
        },
        {
            icon: <Database />,
            title: "Firebase Expert",
            text: "Authentication, Firestore, Hosting and Admin Panels.",
        },
    ]

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
        <Layout>
            <section
                className={`relative px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%)]"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h1
                            className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            About{" "}
                            <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.8)]">
                                Me
                            </span>
                        </h1>

                        <p
                            className={`mt-4 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            Passionate Web Developer focused on creating modern websites, web
                            applications and premium admin dashboards.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div
                            className={`border rounded-3xl p-8 transition-all duration-500 ${isDark
                                ? "bg-white/5 border-white/10"
                                : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            {profile.profileImage && (
                                <img
                                    src={profile.profileImage}
                                    alt={profile.name}
                                    className={`w-full max-h-[320px] object-contain border border-cyan-400/20 rounded-2xl p-3 mb-6 ${isDark ? "bg-black/30" : "bg-white"
                                        }`}
                                />
                            )}

                            <h2 className="text-3xl font-bold text-cyan-400 mb-5">
                                Who Am I?
                            </h2>

                            <p
                                className={`leading-8 ${isDark ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                I'm{" "}
                                <span className="text-cyan-400 font-bold">
                                    {profile.name}
                                </span>
                                , a passionate {profile.title} who builds premium websites, web
                                applications, dashboards and admin panels.
                            </p>

                            <p
                                className={`leading-8 mt-4 ${isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                {profile.bio}
                            </p>

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
                                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
                                                }`}
                                        >
                                            {item[1]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                            {features.map((item) => (
                                <div
                                    key={item.title}
                                    className={`border rounded-2xl p-6 hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)] transition-all duration-500 ${isDark
                                        ? "bg-white/5 border-white/10"
                                        : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-4">
                                        {item.icon}
                                    </div>

                                    <h3
                                        className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {item.title}
                                    </h3>

                                    <p
                                        className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <TimelineSection />
                </div>
            </section>
        </Layout>
    )
}

export default About
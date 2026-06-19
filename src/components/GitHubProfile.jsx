import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import {
    Users,
    BookOpen,
    GitFork,
    Star,
    ExternalLink,
    Code2,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function GitHubProfile() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const username = "ashishkoted"

    const [profile, setProfile] = useState(null)
    const [repos, setRepos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showGithub, setShowGithub] = useState(true)

    useEffect(() => {
        const fetchGitHub = async () => {
            try {
                const userRes = await fetch(`https://api.github.com/users/${username}`)
                const repoRes = await fetch(
                    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
                )

                const userData = await userRes.json()
                const repoData = await repoRes.json()

                setProfile(userData)
                setRepos(Array.isArray(repoData) ? repoData : [])
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchGitHub()
    }, [])

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const snap = await getDoc(
                    doc(db, "settings", "profile")
                )

                if (snap.exists()) {
                    setShowGithub(
                        snap.data().showGithub ?? true
                    )
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchSettings()
    }, [])

    if (loading) {
        return (
            <section
                className={`px-6 py-20 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    Loading GitHub profile...
                </div>
            </section>
        )
    }

    if (!profile) return null
    if (!showGithub) return null

    return (
        <section
            className={`relative px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]"></div>

            <div className="relative max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                        <Code2 size={20} />
                        GitHub Activity
                    </p>

                    <h2
                        className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                            }`}
                    >
                        My <span className="text-cyan-400">GitHub</span>
                    </h2>

                    <p
                        className={`mt-4 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Live GitHub profile data, repositories and coding activity.
                    </p>
                </div>

                <div
                    className={`grid lg:grid-cols-3 gap-8 border rounded-3xl p-6 md:p-8 mb-10 ${isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-gray-50 border-gray-200"
                        }`}
                >
                    <div className="lg:col-span-1 text-center">
                        <img
                            src={profile.avatar_url}
                            alt={profile.login}
                            className="w-36 h-36 rounded-full mx-auto border-4 border-cyan-400/40 object-cover"
                        />

                        <h3
                            className={`text-3xl font-black mt-5 ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            {profile.name || profile.login}
                        </h3>

                        <p className="text-cyan-400 font-bold mt-1">@{profile.login}</p>

                        <p
                            className={`mt-4 leading-7 ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            {profile.bio || "GitHub developer profile"}
                        </p>

                        <a
                            href={profile.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 mt-6 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                        >
                            Visit GitHub <ExternalLink size={18} />
                        </a>
                    </div>

                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
                        <div
                            className={`rounded-2xl p-6 border ${isDark
                                ? "bg-black/30 border-white/10"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <BookOpen className="text-cyan-400 mb-3" />
                            <h4 className="text-3xl font-black text-cyan-400">
                                {profile.public_repos}
                            </h4>
                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                Public Repositories
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl p-6 border ${isDark
                                ? "bg-black/30 border-white/10"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <Users className="text-cyan-400 mb-3" />
                            <h4 className="text-3xl font-black text-cyan-400">
                                {profile.followers}
                            </h4>
                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                Followers
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl p-6 border ${isDark
                                ? "bg-black/30 border-white/10"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <GitFork className="text-cyan-400 mb-3" />
                            <h4 className="text-3xl font-black text-cyan-400">
                                {profile.following}
                            </h4>
                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                Following
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl p-6 border ${isDark
                                ? "bg-black/30 border-white/10"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <Star className="text-cyan-400 mb-3" />
                            <h4 className="text-3xl font-black text-cyan-400">
                                Active
                            </h4>
                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                GitHub Status
                            </p>
                        </div>
                    </div>
                </div>

                <h3
                    className={`text-3xl font-black mb-6 ${isDark ? "text-white" : "text-gray-900"
                        }`}
                >
                    Latest Repositories
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo) => (
                        <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className={`group border rounded-2xl p-6 hover:border-cyan-400/40 hover:-translate-y-1 transition ${isDark
                                ? "bg-white/5 border-white/10"
                                : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <h4 className="text-xl font-bold text-cyan-400 group-hover:underline">
                                {repo.name}
                            </h4>

                            <p
                                className={`mt-3 line-clamp-3 min-h-[72px] ${isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                {repo.description || "No description added."}
                            </p>

                            <div className="flex items-center justify-between mt-5 text-sm">
                                <span className={isDark ? "text-gray-500" : "text-gray-600"}>
                                    {repo.language || "Code"}
                                </span>

                                <span className="text-cyan-400 flex items-center gap-1">
                                    <Star size={15} />
                                    {repo.stargazers_count}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default GitHubProfile
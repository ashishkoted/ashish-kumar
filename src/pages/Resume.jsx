import Layout from "../layout/Layout"
import { Download, Eye, FileText, ExternalLink } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function Resume() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const resumeUrl = "/resume.pdf"

    return (
        <Layout>
            <section
                className={`px-6 py-20 min-h-screen transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <FileText className="text-cyan-400 mx-auto mb-4" size={44} />

                        <h1
                            className={`text-5xl font-black ${isDark ? "text-white" : "text-gray-900"
                                }`}
                        >
                            My <span className="text-cyan-400">Resume</span>
                        </h1>

                        <p className={`mt-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            View or download my latest resume.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div
                            className={`border rounded-2xl p-6 text-center ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <Eye className="text-cyan-400 mx-auto mb-3" />
                            <h2 className="text-3xl font-black text-cyan-400">Live</h2>
                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                Preview
                            </p>
                        </div>

                        <div
                            className={`border rounded-2xl p-6 text-center ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <Download className="text-cyan-400 mx-auto mb-3" />
                            <h2 className="text-3xl font-black text-cyan-400">PDF</h2>
                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                Download
                            </p>
                        </div>

                        <div
                            className={`border rounded-2xl p-6 text-center ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <FileText className="text-cyan-400 mx-auto mb-3" />
                            <h2 className="text-3xl font-black text-cyan-400">v1.0</h2>
                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                Version
                            </p>
                        </div>
                    </div>

                    <div
                        className={`border rounded-3xl p-5 ${isDark
                                ? "bg-white/5 border-white/10"
                                : "bg-gray-50 border-gray-200"
                            }`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                            <div>
                                <h2
                                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    Ashish Kumar Resume
                                </h2>

                                <p className={isDark ? "text-gray-500" : "text-gray-600"}>
                                    Static PDF from public folder
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="border border-cyan-400/40 text-cyan-400 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 hover:text-black transition"
                                >
                                    View Resume <ExternalLink size={18} />
                                </a>

                                <a
                                    href={resumeUrl}
                                    download="Ashish-Kumar-Resume.pdf"
                                    className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                                >
                                    Download Resume <Download size={18} />
                                </a>
                            </div>
                        </div>

                        <iframe
                            src={resumeUrl}
                            title="Resume PDF"
                            className={`w-full h-[800px] rounded-2xl border ${isDark
                                    ? "bg-black/40 border-white/10"
                                    : "bg-white border-gray-200"
                                }`}
                        ></iframe>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Resume
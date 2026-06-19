import { Code2 } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function LoadingPage() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <div
            className={`fixed inset-0 z-[99999] flex items-center justify-center ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                }`}
        >
            <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_45px_rgba(34,211,238,0.35)] animate-pulse">
                    <Code2 size={44} className="text-cyan-400" />
                </div>

                <h1 className="text-3xl font-black mt-6">
                    Ashish <span className="text-cyan-400">Kumar</span>
                </h1>

                <p className={isDark ? "text-gray-400 mt-2" : "text-gray-600 mt-2"}>
                    Loading premium portfolio...
                </p>

                <div className="w-56 h-2 rounded-full overflow-hidden bg-cyan-400/10 mx-auto mt-6">
                    <div className="h-full w-1/2 bg-cyan-400 animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingPage
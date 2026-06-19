import { Link } from "react-router-dom"
import { Home, ArrowLeft, AlertTriangle } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function NotFound() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <section
            className={`min-h-screen flex items-center justify-center px-6 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                }`}
        >
            <div className="text-center max-w-2xl">
                <AlertTriangle className="text-cyan-400 mx-auto mb-6" size={70} />

                <h1 className="text-8xl font-black text-cyan-400">404</h1>

                <h2 className="text-3xl font-black mt-4">Page Not Found</h2>

                <p className={isDark ? "text-gray-400 mt-4" : "text-gray-600 mt-4"}>
                    Bhai ye page exist nahi karta. Home page par wapas chalo.
                </p>

                <div className="flex justify-center gap-4 mt-8">
                    <Link
                        to="/"
                        className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="border border-cyan-400/40 text-cyan-400 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>
                </div>
            </div>
        </section>
    )
}

export default NotFound
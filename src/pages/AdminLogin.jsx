import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebase"
import { useNavigate } from "react-router-dom"
import { Lock, Mail, ShieldCheck } from "lucide-react"

function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState({
        show: false,
        type: "error",
        title: "",
        message: "",
    })

    const navigate = useNavigate()

    const showPopup = (type, title, message) => {
        setPopup({
            show: true,
            type,
            title,
            message,
        })
    }

    const closePopup = () => {
        setPopup({
            show: false,
            type: "error",
            title: "",
            message: "",
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!email.trim() || !password.trim()) {
            showPopup(
                "error",
                "Required",
                "Email aur Password required hai"
            )
            return
        }

        setLoading(true)

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            navigate("/admin")
        } catch (err) {
            console.log(err)

            showPopup(
                "error",
                "Login Failed",
                "Email ya password galat hai"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_35%)]"></div>

            <form
                onSubmit={handleLogin}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-lg border border-cyan-400/20 p-8 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.12)]"
            >
                <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                        <ShieldCheck
                            size={40}
                            className="text-cyan-400"
                        />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-cyan-400 text-center">
                    Admin Login
                </h1>

                <p className="text-center text-gray-400 mt-2 mb-8">
                    Ashish Kumar Portfolio Dashboard
                </p>

                <div className="relative mb-4">
                    <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="email"
                        placeholder="ex.ashishkumar@gmail.com"
                        className="w-full p-4 pl-12 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="relative mb-6">
                    <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-4 pl-12 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-cyan-400 text-black rounded-xl font-bold disabled:opacity-60"
                >
                    {loading ? "Logging In..." : "Login"}
                </button>
            </form>

            {popup.show && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 px-4">
                    <div className="w-full max-w-md bg-[#08111f] border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.25)]">

                        <h2
                            className={`text-2xl font-bold mb-3 ${popup.type === "success"
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                        >
                            {popup.title}
                        </h2>

                        <p className="text-gray-300 leading-7">
                            {popup.message}
                        </p>

                        <button
                            onClick={closePopup}
                            className="mt-6 bg-cyan-400 text-black px-5 py-2 rounded-xl font-bold"
                        >
                            OK
                        </button>

                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminLogin
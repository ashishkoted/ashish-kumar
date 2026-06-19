import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebase"
import { ShieldCheck } from "lucide-react"

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsub()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020817]">
                <div className="text-center">
                    <div className="w-24 h-24 rounded-3xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <ShieldCheck
                            size={40}
                            className="text-cyan-400"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-cyan-400">
                        Verifying Access
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Loading Admin Dashboard...
                    </p>

                    <div className="w-60 h-2 bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
                        <div className="h-full w-1/2 bg-cyan-400 animate-pulse rounded-full"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/admin-login" replace />
    }

    return children
}

export default ProtectedRoute
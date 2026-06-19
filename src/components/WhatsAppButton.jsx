import { useEffect, useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

function WhatsAppButton() {
    const [whatsapp, setWhatsapp] = useState("")
    const [open, setOpen] = useState(false)
    const [showWhatsapp, setShowWhatsapp] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const snap = await getDoc(doc(db, "settings", "profile"))

                if (snap.exists()) {
                    const data = snap.data()

                    setWhatsapp(data.whatsapp || "")
                    setShowWhatsapp(data.showWhatsapp ?? true)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchSettings()
    }, [])

    if (!showWhatsapp || !whatsapp) return null
    const cleanNumber = whatsapp.replace(/\D/g, "")

    const message =
        "Hello Ashish Kumar, I visited your portfolio and I want to discuss a website project."

    const whatsappLink = whatsapp.startsWith("http")
        ? whatsapp
        : `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`

    return (
        <div className="fixed bottom-6 right-6 z-[9998]">
            {open && (
                <div className="mb-4 w-72 bg-[#08111f] border border-cyan-400/20 rounded-2xl p-5 shadow-[0_0_35px_rgba(34,211,238,0.25)]">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-white font-bold text-lg">
                                Need a Website?
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Chat on WhatsApp for project discussion.
                            </p>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-400 hover:text-red-400"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 bg-cyan-400 text-black px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                    >
                        <MessageCircle size={18} />
                        Start Chat
                    </a>
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="w-16 h-16 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.6)] hover:scale-110 transition"
            >
                {open ? <X size={28} /> : <MessageCircle size={30} />}
            </button>
        </div>
    )
}

export default WhatsAppButton
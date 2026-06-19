import { useEffect, useState } from "react"
import {
    collection,
    getDocs,
    orderBy,
    query,
    deleteDoc,
    doc,
} from "firebase/firestore"

import { db } from "../firebase/firebase"
import AdminSidebar from "../components/AdminSidebar"

function AdminMessages() {
    const [messages, setMessages] = useState([])

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
        action: null,
    })

    const showPopup = (type, title, message, action = null) => {
        setPopup({
            show: true,
            type,
            title,
            message,
            action,
        })
    }

    const closePopup = () => {
        setPopup({
            show: false,
            type: "success",
            title: "",
            message: "",
            action: null,
        })
    }

    const fetchMessages = async () => {
        try {
            const q = query(
                collection(db, "messages"),
                orderBy("createdAt", "desc")
            )

            const snap = await getDocs(q)

            setMessages(
                snap.docs.map((item) => ({
                    id: item.id,
                    ...item.data(),
                }))
            )
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Messages load nahi hue")
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const confirmDelete = (id) => {
        showPopup(
            "confirm",
            "Delete Message?",
            "Kya aap is message ko delete karna chahte ho?",
            async () => {
                try {
                    await deleteDoc(doc(db, "messages", id))

                    closePopup()

                    showPopup(
                        "success",
                        "Deleted",
                        "Message successfully delete ho gaya"
                    )

                    await fetchMessages()
                } catch (error) {
                    console.log(error)

                    closePopup()

                    showPopup(
                        "error",
                        "Error",
                        "Message delete nahi hua"
                    )
                }
            }
        )
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <h1 className="text-4xl font-bold text-cyan-400 mb-2">
                    Contact Messages
                </h1>

                <p className="text-gray-400 mb-8">
                    All contact form messages will appear here.
                </p>

                <div className="space-y-5">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-cyan-400/30 transition"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {msg.name}
                                    </h3>

                                    <p className="text-cyan-400">
                                        {msg.email}
                                    </p>
                                    {msg.mobile && (
                                        <p className="text-gray-400 mt-1">
                                            Mobile: {msg.mobile}
                                        </p>
                                    )}
                                </div>

                                <span className="text-xs bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-3 py-1 rounded-full">
                                    {msg.status || "unread"}
                                </span>
                            </div>

                            <p className="text-gray-300 mt-4 leading-7">
                                {msg.message}
                            </p>

                            <button
                                onClick={() => confirmDelete(msg.id)}
                                className="mt-5 bg-red-500 px-4 py-2 rounded-lg font-bold"
                            >
                                Delete
                            </button>
                        </div>
                    ))}

                    {messages.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                            <p className="text-gray-500">
                                No messages found.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {popup.show && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 px-4">
                    <div className="w-full max-w-md bg-[#08111f] border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
                        <h2
                            className={`text-2xl font-bold mb-3 ${popup.type === "success"
                                ? "text-green-400"
                                : popup.type === "confirm"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                        >
                            {popup.title}
                        </h2>

                        <p className="text-gray-300 leading-7">
                            {popup.message}
                        </p>

                        <div className="flex gap-3 mt-6">
                            {popup.type === "confirm" ? (
                                <>
                                    <button
                                        onClick={popup.action}
                                        className="bg-red-500 px-5 py-2 rounded-xl font-bold"
                                    >
                                        Yes, Delete
                                    </button>

                                    <button
                                        onClick={closePopup}
                                        className="bg-gray-600 px-5 py-2 rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={closePopup}
                                    className="bg-cyan-400 text-black px-5 py-2 rounded-xl font-bold"
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMessages
import { useEffect, useState } from "react"
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore"

import {
    Trash2,
    Phone,
    Mail,
    User,
    BriefcaseBusiness,
    Wallet,
    Clock,
    MessageSquare,
    CheckCircle,
} from "lucide-react"

import { db } from "../firebase/firebase"
import AdminSidebar from "../components/AdminSidebar"

function AdminProjectRequests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(
            collection(db, "projectRequests"),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            setRequests(data)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            await updateDoc(doc(db, "projectRequests", id), {
                status,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const deleteRequest = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this request?"
        )

        if (!confirmDelete) return

        try {
            await deleteDoc(doc(db, "projectRequests", id))
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (date) => {
        if (!date?.toDate) return "N/A"
        return date.toDate().toLocaleString("en-IN")
    }

    return (
        <div className="min-h-screen bg-[#020817] flex">
            <AdminSidebar />

            <main className="flex-1 overflow-x-hidden p-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white">
                        Project <span className="text-cyan-400">Requests</span>
                    </h1>

                    <p className="text-gray-400 mt-2">
                        All project inquiries submitted from your portfolio website.
                    </p>
                </div>

                {loading ? (
                    <div className="text-gray-400">
                        Loading project requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                        <p className="text-gray-400">
                            No project requests found.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {requests.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white/5 border border-white/10 rounded-3xl p-6"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <User size={20} className="text-cyan-400" />
                                            {item.name}
                                        </h2>

                                        <p className="text-gray-400 mt-2">
                                            {formatDate(item.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <select
                                            value={item.status || "New"}
                                            onChange={(e) =>
                                                updateStatus(item.id, e.target.value)
                                            }
                                            className="bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2"
                                        >
                                            <option>New</option>
                                            <option>Contacted</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                            <option>Rejected</option>
                                        </select>

                                        <button
                                            onClick={() => deleteRequest(item.id)}
                                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 rounded-xl hover:bg-red-500 hover:text-white transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                                    <Info
                                        icon={<Phone size={18} />}
                                        label="WhatsApp"
                                        value={item.mobile}
                                    />

                                    <Info
                                        icon={<Mail size={18} />}
                                        label="Email"
                                        value={item.email}
                                    />

                                    <Info
                                        icon={<BriefcaseBusiness size={18} />}
                                        label="Project Type"
                                        value={item.projectType}
                                    />

                                    <Info
                                        icon={<Wallet size={18} />}
                                        label="Budget"
                                        value={item.budget}
                                    />

                                    <Info
                                        icon={<Clock size={18} />}
                                        label="Timeline"
                                        value={item.timeline}
                                    />

                                    <Info
                                        icon={<CheckCircle size={18} />}
                                        label="Status"
                                        value={item.status || "New"}
                                    />
                                </div>

                                <div className="mt-5 bg-black/20 border border-white/10 rounded-2xl p-5">
                                    <h3 className="flex items-center gap-2 text-cyan-400 font-bold mb-3">
                                        <MessageSquare size={18} />
                                        Project Description
                                    </h3>

                                    <p className="text-gray-300 whitespace-pre-wrap leading-7">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

function Info({ icon, label, value }) {
    return (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
            <p className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-2">
                {icon}
                {label}
            </p>

            <p className="text-gray-200 break-words">
                {value || "N/A"}
            </p>
        </div>
    )
}

export default AdminProjectRequests
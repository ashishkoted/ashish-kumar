import { useEffect, useState } from "react"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { uploadToCloudinary } from "../utils/uploadToCloudinary"
import AdminSidebar from "../components/AdminSidebar"

function AdminSettings() {
    const [form, setForm] = useState({
        name: "Ashish Kumar",
        title: "React Developer",
        subtitle: "Admin Panel Creator",
        bio: "",
        github: "",
        linkedin: "",
        email: "",
        whatsapp: "",
        resumeUrl: "",
        profileImage: "",
        showGithub: true,
        showTestimonials: true,
        showWhatsapp: true,
        showResume: true,
        showServices: true,
        showContact: true,
        showAvailability: true,
        availabilityText: "Available For Freelance Projects",
        responseTime: "Under 24 Hours",
    })

    const [profileFile, setProfileFile] = useState(null)
    const [resumeFile, setResumeFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
    })

    const showPopup = (type, title, message) => {
        setPopup({ show: true, type, title, message })
    }

    const closePopup = () => {
        setPopup({ show: false, type: "success", title: "", message: "" })
    }

    const fetchSettings = async () => {
        try {
            const ref = doc(db, "settings", "profile")
            const snap = await getDoc(ref)

            if (snap.exists()) {
                setForm((prev) => ({
                    ...prev,
                    ...snap.data(),
                }))
            }
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Settings load nahi hui")
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleToggle = (name) => {
        setForm({
            ...form,
            [name]: !form[name],
        })
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!form.name.trim() || !form.title.trim()) {
            showPopup("error", "Required", "Name aur Title required hai")
            return
        }

        setLoading(true)

        try {
            let profileImage = form.profileImage
            let resumeUrl = form.resumeUrl

            if (profileFile) {
                profileImage = await uploadToCloudinary(profileFile)
            }

            if (resumeFile) {
                resumeUrl = await uploadToCloudinary(resumeFile)
            }

            await setDoc(
                doc(db, "settings", "profile"),
                {
                    ...form,
                    profileImage,
                    resumeUrl,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            )

            setForm((prev) => ({
                ...prev,
                profileImage,
                resumeUrl,
            }))

            setProfileFile(null)
            setResumeFile(null)

            showPopup("success", "Saved", "Website settings successfully save ho gayi")
        } catch (error) {
            console.log(error)
            showPopup("error", "Error", "Settings save nahi hui")
        } finally {
            setLoading(false)
        }
    }

    const ToggleBox = ({ label, name }) => (
        <button
            type="button"
            onClick={() => handleToggle(name)}
            className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl hover:border-cyan-400/30 transition"
        >
            <span className="text-white font-medium">{label}</span>

            <span
                className={`w-12 h-6 rounded-full p-1 transition ${form[name] ? "bg-cyan-400" : "bg-gray-600"
                    }`}
            >
                <span
                    className={`block w-4 h-4 rounded-full bg-black transition ${form[name] ? "translate-x-6" : "translate-x-0"
                        }`}
                ></span>
            </span>
        </button>
    )

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <h1 className="text-4xl font-black text-cyan-400 mb-2">
                    Website Settings
                </h1>

                <p className="text-gray-400 mb-8">
                    Hero, profile, resume, social links aur website sections manage karo.
                </p>

                <form
                    onSubmit={handleSave}
                    className="max-w-4xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
                >
                    <div className="grid md:grid-cols-2 gap-5">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Main Title"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="subtitle"
                            value={form.subtitle}
                            onChange={handleChange}
                            placeholder="Subtitle"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="github"
                            value={form.github}
                            onChange={handleChange}
                            placeholder="GitHub Link"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="linkedin"
                            value={form.linkedin}
                            onChange={handleChange}
                            placeholder="LinkedIn Link"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="whatsapp"
                            value={form.whatsapp}
                            onChange={handleChange}
                            placeholder="WhatsApp Number / Link"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="availabilityText"
                            value={form.availabilityText}
                            onChange={handleChange}
                            placeholder="Availability Text"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="responseTime"
                            value={form.responseTime}
                            onChange={handleChange}
                            placeholder="Response Time"
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                        />


                    </div>

                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Short Bio"
                        rows="5"
                        className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-cyan-400"
                    />

                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                            <label className="block text-cyan-400 font-bold mb-3">
                                Profile Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfileFile(e.target.files[0] || null)}
                                className="w-full"
                            />

                            {form.profileImage && (
                                <img
                                    src={form.profileImage}
                                    alt="Profile"
                                    className="mt-4 w-32 h-32 object-cover rounded-xl border border-cyan-400/20"
                                />
                            )}
                        </div>


                    </div>

                    <div className="bg-black/30 border border-white/10 rounded-xl p-5">
                        <h3 className="text-cyan-400 font-bold text-xl mb-5">
                            Website Sections Control
                        </h3>

                        <div className="grid md:grid-cols-2 gap-5">
                            <ToggleBox label="Show Testimonials" name="showTestimonials" />
                            <ToggleBox label="Show WhatsApp Button" name="showWhatsapp" />
                            <ToggleBox label="Show Resume Button" name="showResume" />
                            <ToggleBox label="Show Services" name="showServices" />
                            <ToggleBox label="Show Contact" name="showContact" />
                            <ToggleBox
                                label="Show GitHub Section"
                                name="showGithub"
                            />
                            <ToggleBox
                                label="Show Availability Status"
                                name="showAvailability"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save Settings"}
                    </button>
                </form>
            </div>

            {popup.show && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 px-4">
                    <div className="w-full max-w-md bg-[#08111f] border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
                        <h2
                            className={`text-2xl font-bold mb-3 ${popup.type === "success" ? "text-green-400" : "text-red-400"
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

export default AdminSettings
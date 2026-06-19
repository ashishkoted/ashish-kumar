import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { ChevronDown, HelpCircle } from "lucide-react"
import { db } from "../firebase/firebase"
import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"

function FAQ() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const [faqs, setFaqs] = useState([])
    const [openIndex, setOpenIndex] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const q = query(collection(db, "faqs"), orderBy("createdAt", "desc"))
                const snap = await getDocs(q)

                const data = snap.docs
                    .map((item) => ({
                        id: item.id,
                        ...item.data(),
                    }))
                    .filter((item) => item.active !== false)

                setFaqs(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchFaqs()
    }, [])

    const toggleFAQ = (index) => {
        playSound("click")
        setOpenIndex(openIndex === index ? null : index)
    }

    if (loading) return null
    if (faqs.length === 0) return null

    return (
        <section
            className={`relative px-6 py-20 overflow-hidden transition-all duration-500 ${isDark ? "bg-[#020817] text-white" : "bg-white text-gray-900"
                }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_35%)]"></div>

            <div className="relative max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-cyan-400 font-bold flex items-center justify-center gap-2 mb-3">
                        <HelpCircle size={18} />
                        Frequently Asked Questions
                    </p>

                    <h2
                        className={`text-5xl md:text-6xl font-black ${isDark ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Common <span className="text-cyan-400">Questions</span>
                    </h2>

                    <p
                        className={`mt-4 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Here are some common questions clients usually ask before starting a project.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq.id}
                            className={`border rounded-2xl overflow-hidden transition ${isDark
                                    ? "bg-white/5 border-white/10"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                            >
                                <div>
                                    {faq.category && (
                                        <p className="text-cyan-400 text-xs font-bold mb-1">
                                            {faq.category}
                                        </p>
                                    )}

                                    <h3
                                        className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {faq.question}
                                    </h3>
                                </div>

                                <ChevronDown
                                    className={`text-cyan-400 transition ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                    size={24}
                                />
                            </button>

                            {openIndex === index && (
                                <div
                                    className={`px-5 pb-5 leading-7 ${isDark ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQ
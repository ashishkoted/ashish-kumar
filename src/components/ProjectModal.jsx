import { useState } from "react"
import {
    X,
    Code2,
    ExternalLink,
    Globe2,
    CheckCircle,
    Lightbulb,
    Wrench,
    Images,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Star,
    Layers,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { playSound } from "../utils/playSound"

function getOptimizedImage(url, width = 1000) {
    if (!url) return ""

    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
        return url.replace(
            "/upload/",
            `/upload/f_auto,q_auto,w_${width},dpr_auto/`
        )
    }

    return url
}

function ProjectModal({ project, onClose }) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const [activeImage, setActiveImage] = useState(null)

    if (!project) return null

    const techList = project.techStack?.length
        ? project.techStack
        : project.tech?.split(",").map((item) => item.trim()).filter(Boolean) || []

    const featureList = project.features?.length ? project.features : []
    const screenshotList = project.screenshots?.length ? project.screenshots : []

    const openImage = (index) => {
        playSound("click")
        setActiveImage(index)
    }

    const closeImage = () => {
        playSound("click")
        setActiveImage(null)
    }

    const closeModal = () => {
        playSound("click")
        onClose()
    }

    const prevImage = () => {
        playSound("click")
        setActiveImage((prev) =>
            prev === 0 ? screenshotList.length - 1 : prev - 1
        )
    }

    const nextImage = () => {
        playSound("click")
        setActiveImage((prev) =>
            prev === screenshotList.length - 1 ? 0 : prev + 1
        )
    }

    return (
        <>
            <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div
                    className={`w-full max-w-6xl max-h-[92vh] overflow-y-auto border rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.28)] transition-all duration-500 ${isDark
                            ? "bg-[#08111f] border-cyan-400/20 text-white"
                            : "bg-white border-gray-200 text-gray-900"
                        }`}
                >
                    <div
                        className={`sticky top-0 z-10 flex justify-between items-center p-5 border-b backdrop-blur-xl ${isDark
                                ? "bg-[#08111f]/95 border-white/10"
                                : "bg-white/95 border-gray-200"
                            }`}
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl md:text-3xl font-black text-cyan-400">
                                    {project.title}
                                </h2>

                                <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center gap-1">
                                    <Star size={13} />
                                    Premium Project
                                </span>
                            </div>

                            <p
                                className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-600"
                                    }`}
                            >
                                Advanced project details, features, tech stack and gallery.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label="Close project details"
                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition ${isDark ? "bg-white/10" : "bg-gray-100"
                                }`}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className={isDark ? "bg-black/30 p-4" : "bg-gray-50 p-4"}>
                        {project.imageUrl ? (
                            <img
                                src={getOptimizedImage(project.imageUrl, 1000)}
                                alt={`${project.title || "Project"} main screenshot`}
                                width="1000"
                                height="600"
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                                className="w-full max-h-[420px] object-contain rounded-2xl border border-cyan-400/20"
                            />
                        ) : (
                            <div
                                className={`h-72 flex flex-col items-center justify-center gap-3 rounded-2xl border ${isDark
                                        ? "bg-black/30 border-white/10 text-gray-500"
                                        : "bg-white border-gray-200 text-gray-400"
                                    }`}
                            >
                                <Code2 size={44} />
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-10">
                        <div>
                            <div className="flex flex-wrap gap-3 mb-5">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-bold">
                                    <Globe2 size={15} />
                                    {project.category || "Web App"}
                                </div>

                                {screenshotList.length > 0 && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-400/10 border border-purple-400/30 text-purple-300 text-sm font-bold">
                                        <Images size={15} />
                                        {screenshotList.length} Screenshots
                                    </div>
                                )}

                                {featureList.length > 0 && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/10 border border-green-400/30 text-green-300 text-sm font-bold">
                                        <Layers size={15} />
                                        {featureList.length} Features
                                    </div>
                                )}
                            </div>

                            <p
                                className={`leading-8 text-lg ${isDark ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                {project.description}
                            </p>
                        </div>

                        {techList.length > 0 && (
                            <div>
                                <h3
                                    className={`text-xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    Tech Stack
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {techList.map((item, index) => (
                                        <span
                                            key={`${item}-${index}`}
                                            className="px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-bold"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-red-500/10 border border-red-400/20">
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-red-400">
                                    <Lightbulb size={22} />
                                    Problem
                                </h3>

                                <p
                                    className={`leading-7 ${isDark ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    {project.problem || "Problem section admin se add karo."}
                                </p>
                            </div>

                            <div className="p-6 rounded-3xl bg-green-500/10 border border-green-400/20">
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-green-400">
                                    <Wrench size={22} />
                                    Solution
                                </h3>

                                <p
                                    className={`leading-7 ${isDark ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    {project.solution || "Solution section admin se add karo."}
                                </p>
                            </div>
                        </div>

                        {featureList.length > 0 && (
                            <div>
                                <h3
                                    className={`text-xl font-black mb-5 ${isDark ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    Key Features
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {featureList.map((feature, index) => (
                                        <div
                                            key={`${feature}-${index}`}
                                            className={`p-4 rounded-2xl border flex gap-3 ${isDark
                                                    ? "bg-white/5 border-white/10"
                                                    : "bg-gray-50 border-gray-200"
                                                }`}
                                        >
                                            <CheckCircle
                                                className="text-cyan-400 mt-1 shrink-0"
                                                size={20}
                                            />
                                            <p
                                                className={
                                                    isDark ? "text-gray-300" : "text-gray-700"
                                                }
                                            >
                                                {feature}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {screenshotList.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between gap-4 mb-5">
                                    <h3
                                        className={`text-xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        <Images size={22} className="text-cyan-400" />
                                        Screenshots Gallery
                                    </h3>

                                    <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm">
                                        {screenshotList.length} Images
                                    </span>
                                </div>

                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                                    {screenshotList.map((img, index) => (
                                        <button
                                            type="button"
                                            onClick={() => openImage(index)}
                                            key={`${img}-${index}`}
                                            aria-label={`Open project screenshot ${index + 1}`}
                                            className={`group relative rounded-2xl overflow-hidden border text-left ${isDark
                                                    ? "border-white/10 bg-white/5"
                                                    : "border-gray-200 bg-gray-50"
                                                }`}
                                        >
                                            <img
                                                src={getOptimizedImage(img, 600)}
                                                alt={`Project Screenshot ${index + 1}`}
                                                width="600"
                                                height="350"
                                                loading="lazy"
                                                fetchPriority="low"
                                                decoding="async"
                                                className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                                            />

                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition flex items-center justify-center">
                                                <Maximize2 className="opacity-0 group-hover:opacity-100 transition text-cyan-300" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 pt-4">
                            {project.liveLink && (
                                <a
                                    href={project.liveLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => playSound("click")}
                                    className="bg-cyan-400 text-black px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] transition"
                                >
                                    Live Demo <ExternalLink size={16} />
                                </a>
                            )}

                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => playSound("click")}
                                    className={`border px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:text-cyan-400 hover:border-cyan-400/40 transition ${isDark
                                            ? "bg-white/10 border-white/10 text-white"
                                            : "bg-gray-50 border-gray-200 text-gray-800"
                                        }`}
                                >
                                    <Code2 size={16} /> GitHub
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {activeImage !== null && (
                <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={closeImage}
                        aria-label="Close image preview"
                        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 transition text-white"
                    >
                        <X size={22} />
                    </button>

                    {screenshotList.length > 1 && (
                        <button
                            type="button"
                            onClick={prevImage}
                            aria-label="Previous screenshot"
                            className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-400 hover:text-black transition text-white"
                        >
                            <ChevronLeft size={26} />
                        </button>
                    )}

                    <img
                        src={getOptimizedImage(screenshotList[activeImage], 1400)}
                        alt={`Project screenshot preview ${activeImage + 1}`}
                        width="1400"
                        height="900"
                        loading="eager"
                        decoding="async"
                        className="max-w-[92vw] max-h-[82vh] object-contain rounded-2xl border border-white/10"
                    />

                    {screenshotList.length > 1 && (
                        <button
                            type="button"
                            onClick={nextImage}
                            aria-label="Next screenshot"
                            className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-400 hover:text-black transition text-white"
                        >
                            <ChevronRight size={26} />
                        </button>
                    )}

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-gray-300">
                        {activeImage + 1} / {screenshotList.length}
                    </div>
                </div>
            )}
        </>
    )
}

export default ProjectModal
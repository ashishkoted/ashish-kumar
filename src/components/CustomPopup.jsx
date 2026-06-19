function CustomPopup({
    show,
    title,
    message,
    type = "success",
    onClose,
}) {
    if (!show) return null

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10">

            <div className="w-[90%] max-w-md bg-[#08111f] border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.2)] animate-bounce">

                <h2
                    className={`text-2xl font-bold mb-3 ${type === "success"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                >
                    {title}
                </h2>

                <p className="text-gray-300">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="mt-5 bg-cyan-400 text-black px-5 py-2 rounded-xl font-bold"
                >
                    OK
                </button>

            </div>

        </div>
    )
}

export default CustomPopup
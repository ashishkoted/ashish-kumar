export const uploadToCloudinary = async (file) => {
    const cloudName = "dlqxgrmzg"
    const uploadPreset = "ashish-kumar"

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    )

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed")
    }

    // Optimized Cloudinary URL
    const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_800,dpr_auto/"
    )

    return optimizedUrl
}
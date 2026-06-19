export const playSound = (sound = "click") => {
    const enabled = JSON.parse(
        localStorage.getItem("soundEnabled") ?? "true"
    )

    if (!enabled) return

    try {
        const audio = new Audio(`/sounds/${sound}.mp3`)
        audio.volume = 0.35
        audio.play().catch(() => { })
    } catch (error) {
        console.log(error)
    }
}
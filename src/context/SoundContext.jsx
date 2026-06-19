import { createContext, useContext, useEffect, useState } from "react"

const SoundContext = createContext()

export function SoundProvider({ children }) {
    const [soundEnabled, setSoundEnabled] = useState(true)

    useEffect(() => {
        const saved = localStorage.getItem("soundEnabled")

        if (saved !== null) {
            setSoundEnabled(JSON.parse(saved))
        }
    }, [])

    const toggleSound = () => {
        const value = !soundEnabled
        setSoundEnabled(value)
        localStorage.setItem("soundEnabled", JSON.stringify(value))
    }

    return (
        <SoundContext.Provider
            value={{
                soundEnabled,
                toggleSound,
            }}
        >
            {children}
        </SoundContext.Provider>
    )
}

export const useSound = () => useContext(SoundContext)
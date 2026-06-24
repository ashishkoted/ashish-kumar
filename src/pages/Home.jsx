import { lazy, Suspense } from "react"

import Navbar from "../components/Navbar"
import Hero from "../components/Hero"

const Footer = lazy(() => import("../components/Footer"))
const Testimonials = lazy(() => import("../components/Testimonials"))
const WhatsAppButton = lazy(() => import("../components/WhatsAppButton"))
const GitHubProfile = lazy(() => import("../components/GitHubProfile"))
const FAQ = lazy(() => import("../components/FAQ"))

function Home() {
    return (
        <>
            <Navbar />
            <Hero />

            <Suspense fallback={null}>
                <GitHubProfile />
                <Testimonials />
                <FAQ />
                <Footer />
                <WhatsAppButton />
            </Suspense>
        </>
    )
}

export default Home
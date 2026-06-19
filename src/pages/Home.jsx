import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Footer from "../components/Footer"
import Testimonials from "../components/Testimonials"
import WhatsAppButton from "../components/WhatsAppButton"
import GitHubProfile from "../components/GitHubProfile"
import FAQ from "../components/FAQ"

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <GitHubProfile />
            <Testimonials />
            <FAQ />
            <Footer />
            <WhatsAppButton />
        </>
    )
}

export default Home
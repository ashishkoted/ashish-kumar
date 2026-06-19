import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import WhatsAppButton from "../components/WhatsAppButton"

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    )
}

export default Layout
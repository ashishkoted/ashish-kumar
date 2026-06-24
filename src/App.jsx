import { useEffect, useState, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { ThemeProvider } from "./context/ThemeContext"
import LoadingPage from "./components/LoadingPage"

import ProtectedRoute from "./components/ProtectedRoute"

// Public Pages
const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("./components/About"))
const Skills = lazy(() => import("./components/Skills"))
const Projects = lazy(() => import("./components/Projects"))
const Services = lazy(() => import("./components/Services"))
const Contact = lazy(() => import("./components/Contact"))
const Resume = lazy(() => import("./pages/Resume"))
const NotFound = lazy(() => import("./pages/NotFound"))
const ProjectRequest = lazy(() => import("./pages/ProjectRequest"))
const Blog = lazy(() => import("./pages/Blog"))
const BlogDetails = lazy(() => import("./pages/BlogDetails"))

// Admin Pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))
const AdminProjects = lazy(() => import("./pages/AdminProjects"))
const AdminSkills = lazy(() => import("./pages/AdminSkills"))
const AdminMessages = lazy(() => import("./pages/AdminMessages"))
const AdminServices = lazy(() => import("./pages/AdminServices"))
const AdminSettings = lazy(() => import("./pages/AdminSettings"))
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"))
const AdminFAQ = lazy(() => import("./pages/AdminFAQ"))
const AdminBlogs = lazy(() => import("./pages/AdminBlogs"))
const AdminProjectRequests = lazy(() => import("./pages/AdminProjectRequests"))

function AppContent() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingPage />

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project-request" element={<ProjectRequest />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <AdminSkills />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <AdminServices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <AdminTestimonials />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/faq"
            element={
              <ProtectedRoute>
                <AdminFAQ />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminBlogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/project-requests"
            element={
              <ProtectedRoute>
                <AdminProjectRequests />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
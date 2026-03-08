import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/landing/HeroSection';
import Footer from './components/layout/Footer';
import FeaturesGrid from './components/landing/FeaturesGrid';
import HowItWorks from './components/landing/HowItWorks';
import AboutUsSection from './components/landing/AboutUsSection';
import ContactUsSection from './components/contact-us/ContactUs';
import SignupPage from './components/signup/SignUpPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-background text-text-main">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<>
              <HeroSection />
              <FeaturesGrid />
              <HowItWorks />
              <AboutUsSection />
            </>} />
            <Route path="/explore" element={<div className="p-8"><h1 className="text-3xl font-bold">Explore Page</h1></div>} />
            <Route path="/features" element={<div className="p-8"><h1 className="text-3xl font-bold">Features Page</h1></div>} />
            <Route path="/destinations" element={<div className="p-8"><h1 className="text-3xl font-bold">Destinations Page</h1></div>} />
            <Route path="/pricing" element={<div className="p-8"><h1 className="text-3xl font-bold">Pricing Page</h1></div>} />
            {/* <Route path="/signup" element={<div className="p-8"><h1 className="text-3xl font-bold text-secondary">Join Yatra Page</h1></div>} /> */}
            <Route path="/contact-us" element={<ContactUsSection />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

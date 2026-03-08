import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/landing/HeroSection';
import Footer from './components/layout/Footer';
import FeaturesGrid from './components/landing/FeaturesGrid';
import HowItWorks from './components/landing/HowItWorks';
import AboutUsSection from './components/landing/AboutUsSection';
import ContactUsSection from './components/contact-us/ContactUs';
import SignupPage from './components/signup/SignUpPage';
import LoginPage from './components/login/LoginPage';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import CookiePolicy from './components/legal/CookiePolicy';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If there's a hash, wait a tiny bit for the page to render, then scroll to the element.
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Otherwise, just scroll to the top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-background text-text-main">
        <Navbar />
        <main className="grow">
          <ScrollToTop />
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

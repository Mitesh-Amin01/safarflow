import type { RouteObject } from "react-router-dom";
import HeroSection from "../components/landing/HeroSection";
import FeaturesGrid from "../components/landing/FeaturesGrid";
import HowItWorks from "../components/landing/HowItWorks";
import AboutUsSection from "../components/landing/AboutUsSection";
import ContactUsSection from "../components/contact-us/ContactUs";
import SignupPage from "../components/signup/SignUpPage";
import LoginPage from "../components/login/LoginPage";
import PrivacyPolicy from "../components/legal/PrivacyPolicy";
import TermsOfService from "../components/legal/TermsOfService";
import CookiePolicy from "../components/legal/CookiePolicy";
import UserDashboard from "../components/dashboard/user/UserDashboard";
import { Navigate } from "react-router-dom";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: (
            <>
                <HeroSection />
                <FeaturesGrid />
                <HowItWorks />
                <AboutUsSection />
            </>
        ),
    },
    {
        path: "/contact-us",
        element: <ContactUsSection />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/privacy",
        element: <PrivacyPolicy />,
    },
    {
        path: "/terms",
        element: <TermsOfService />,
    },
    {
        path: "/cookies",
        element: <CookiePolicy />,
    },
    {
        path: "/dashboard",
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard/user" replace />,
            },
            {
                path: "user",
                element: <UserDashboard />,
            },
        ],
    },
];

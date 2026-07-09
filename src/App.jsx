import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MainLayout from "./layout/MainLayout";

// Main site pages
import Home from "./pages/Home/Home";
import InnerPage1 from "./pages/Innerpage1/InnerPage1";
import InnerPage2 from "./pages/Innerpage2/InnerPage2";
import AboutUs from "./pages/AboutUs/AboutUs";
import Mobilis4 from "./pages/Mobilis4/Mobilis4";
import Careers from "./pages/Careers/Careers";
import Appointment from "./pages/Appointment/Appointment";
import Blog from "./pages/Blog/Blog";
import NewsMedia from "./pages/NewsMedia/NewsMedia";
import Download from "./pages/Download/Download";
import OurPartner from "./pages/OurPartner/OurPartner";
import Process from "./pages/Process/Process";
import Team from "./pages/Team/Team";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions/TermsConditions";

// Dashboard
import { AuthProvider } from "./dashboard/context/AuthContext";
import DashboardLayout from "./dashboard/pages/Dashboard/DashboardLayout";
import DashboardHome from "./dashboard/pages/Dashboard/Dashboard";
import Bitcoin from "./dashboard/pages/Bitcoin/Bitcoin";
import BitcoinTest from "./dashboard/pages/BitcoinTest/BitcoinTest";
import WalletPage from "./dashboard/pages/Wallet/Wallet";
import Profile from "./dashboard/pages/Profile/Profile";
import Admin from "./dashboard/pages/Admin/Admin";
import AdminRoute from "./dashboard/components/AdminRoute";
import Login from "./dashboard/pages/Login/Login";
import "./dashboard/styles/global.css";

// Wraps main site with Header + MainLayout(Outlet) + Footer
function MainSiteWrapper() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Wraps pages that need RelatedServices (non-home pages)
function MainSiteWrapperWithRelated() {
  return (
    <>
      <Header />
      <MainLayout />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Main site — uses MainLayout which handles RelatedServices + Outlet ── */}
          <Route element={<MainSiteWrapperWithRelated />}>
            <Route path="/" element={<Home />} />
            <Route path="/inner-page-1" element={<InnerPage1 />} />
            <Route path="/inner-page-2" element={<InnerPage2 />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/mobilis-4" element={<Mobilis4 />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/news-media" element={<NewsMedia />} />
            <Route path="/download" element={<Download />} />
            <Route path="/our-partner" element={<OurPartner />} />
            <Route path="/process" element={<Process />} />
            <Route path="/team" element={<Team />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ── Dashboard (no main Header/Footer) ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="bitcoin" element={<Bitcoin />} />
            <Route path="bitcoin-test" element={<BitcoinTest />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

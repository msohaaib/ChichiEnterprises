/* eslint-disable react/prop-types */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./Components/Navebar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import OurServices from "./Pages/OurServices";
import About from "./Pages/About";
import UmrahPackages from "./Pages/UmrahPackages";
import UmrahDetail from "./Pages/UmrahPackageDetail";
import HajjPackages from "./Pages/HajjPackages";
import ContactUs from "./Pages/ContactUs";
import Tracker from "./Pages/Tracker";
import ServiceDetail from "./Pages/ServiceDetails";
import AdminLogin from "./Pages/AdminLogin";
import AdminPanel from "./Pages/AdminPanel";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin-login" replace />;
};

// Logout handler inside a component with access to useNavigate
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login"); // Redirect after logout
  };

  return <button onClick={handleLogout}>Logout</button>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/OurServices" element={<OurServices />} />
          <Route path="/about" element={<About />} />
          <Route path="/UmrahPackages" element={<UmrahPackages />} />
          <Route path="/umrahDetail/:id" element={<UmrahDetail />} />
          <Route path="/HajjPackages" element={<HajjPackages />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Tracker" element={<Tracker />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminPanel />
                <LogoutButton />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;

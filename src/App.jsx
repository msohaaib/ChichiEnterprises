import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navebar";
import Home from "./Pages/Home";
import OurServices from "./Pages/OurServices";
import About from "./Pages/About";
import UmrahPackages from "./Pages/UmrahPackages";
import HajjPackages from "./Pages/HajjPackages";
import ContactUs from "./Pages/ContactUs";
import Footer from "./Components/Footer";
import Tracker from "./Pages/Tracker";
import ServiceDetail from "./Pages/ServiceDetails";
import AdminLogin from "./Pages/AdminLogin";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ourServices" element={<OurServices />} />
        <Route path="/about" element={<About />} />
        <Route path="/umrahPackages" element={<UmrahPackages />} />
        <Route path="/hajjPackages" element={<HajjPackages />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/processtracking" element={<Tracker />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />{" "}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

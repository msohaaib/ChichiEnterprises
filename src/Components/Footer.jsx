import Logo from "../assets/Logo.png";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    id: 1,
    name: "Track Your Process",
    path: "/Tracker",
  },
  {
    id: 2,
    name: "Hajj Packages",
    path: "/HajjPackages",
  },
  {
    id: 3,
    name: "Umrah Packages",
    path: "/UmrahPackages",
  },
];

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font bg-gray-50">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap md:text-left text-center justify-center md:justify-between gap-8">
          {/* Quick Links Section */}
          <div className="flex-col">
            <h2 className="title-font font-semibold text-gray-900 tracking-tight text-base mb-4 uppercase">
              Quick Links
            </h2>
            <nav className="list-none mb-10 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.path}
                    className="text-gray-700 hover:text-indigo-600 text-base font-light transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </nav>
          </div>

          {/* Subscribe Section */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-semibold text-gray-900 tracking-tight text-base mb-4 uppercase">
              Subscribe
            </h2>
            <div className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start gap-4">
              <div className="relative w-full sm:w-auto max-w-xs">
                <input
                  type="email" // Changed to email for better semantics
                  id="footer-field"
                  name="footer-field"
                  placeholder="Enter your email"
                  className="w-full bg-white rounded-full border border-gray-300 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-600 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>
              <button className="flex-shrink-0 inline-flex items-center text-white bg-indigo-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-700 rounded-full text-base font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
            <p className="text-gray-700 text-sm mt-3 md:text-left text-center font-light">
              Stay updated with our latest offers and news
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col justify-between">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img className="w-10 h-10" src={Logo} alt="Chichi Enterprises" />
            <span className="ml-3 text-xl">CHICHI ENTERPRISES</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">
            © 2025 All right Reserved —
            <a
              href="https://twitter.com/knyttneve"
              rel="noopener noreferrer"
              className="text-gray-600 ml-1"
              target="_blank"
            >
              @chichienterprises
            </a>
          </p>
          <div className="flex space-x-4 text-gray-500 my-2">
            <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaWhatsapp className="hover:text-pink-500 cursor-pointer" />
            <FaXTwitter className="hover:text-blue-400 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

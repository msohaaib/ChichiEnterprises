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
        <div className="flex flex-wrap md:text-left text-center order-first justify-center md:justify-between">
          <div className="flex-col">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Quick Links
            </h2>
            <nav className="list-none mb-10">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              SUBSCRIBE
            </h2>
            <div className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
              <div className="relative sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                <input
                  type="text"
                  id="footer-field"
                  name="footer-field"
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <button className="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-[#096BAC] border-0 py-2 px-6 focus:outline-none hover:bg-[#2F3E81] rounded my-2 sm:my-0">
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2 md:text-left text-center">
              Subscribe Us to Stay Updated
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

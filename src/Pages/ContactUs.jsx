import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast, Toaster } from "react-hot-toast";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6"; // Import Icons
import Contact_Home from "../assets/services/contact_Home.jpg";

const ContactUs = () => {
  const form = useRef(null);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.current) {
      console.error("Form reference is null");
      setLoading(false);
      return;
    }

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          form.current.reset();
        },
        () => {
          toast.error("Failed to send message. Please try again later.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-16 space-y-16">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
        <img
          src={Contact_Home}
          alt="Contact Us Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            Get in Touch with Chichi Enterprises
          </h1>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-100 shadow-lg rounded-xl p-8 space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            Contact Info
          </h2>
          <div className="text-lg text-gray-700 space-y-4">
            <p>
              <strong>Office:</strong> <br />
              Chichi Tower, Opposite Nawab city Tower, New Road, Mingora, Swat
            </p>
            <p>
              <strong>Phone:</strong> <br />
              0092-946729685, <br />
              0092-946713083, <br />
              0092-346 9338816, <br />
              0092-300 9320418
            </p>
            <p>
              <strong>Email:</strong> <br />
              chichienterprises@hotmail.com
            </p>
            <p>
              <strong>Business Hours:</strong> <br />
              Mon-Fri: 9:00 AM - 5:00 PM <br />
              Sat: 9:00 AM - 2:00 PM
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Send Us a Message
          </h2>
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="user_name"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="user_email"
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 mt-12">
        <a
          href="https://www.facebook.com/yourpage"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-3xl transition-all"
        >
          <FaFacebook />
        </a>
        <a
          href="https://www.instagram.com/yourpage"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-800 text-3xl transition-all"
        >
          <FaInstagram />
        </a>
        <a
          href="https://twitter.com/yourpage"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700 text-3xl transition-all"
        >
          <FaXTwitter />
        </a>
        <a
          href="https://wa.me/yourwhatsappnumber"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 text-3xl transition-all"
        >
          <FaWhatsapp />
        </a>
      </div>
    </div>
  );
};

export default ContactUs;

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

      {/* Hero Section (Unchanged) */}
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

      {/* Updated Contact Section */}
      <div className="space-y-12">
        {/* Contact Information and Form in a Single Card */}
        <div className="bg-gray-100 shadow-xl rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-3">
                Reach Out to Us
              </h2>
              <div className="space-y-6 text-gray-700">
                {/* Branch 1 */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-600">
                    Head Office
                  </h3>
                  <p className="mt-2">
                    <strong>Address:</strong> Chichi Tower, New Road, Mingora,
                    Swat
                  </p>
                  <p>
                    <strong>Phone:</strong> <br />
                    0092-946729685 <br />
                    0092-946713083 <br />
                    0092-346 9338816 <br />
                    0092-300 9320418
                  </p>
                  <p>
                    <strong>Email:</strong> chichienterprises@hotmail.com
                  </p>
                  <p>
                    <strong>Business Hours:</strong> <br />
                    Mon-Fri: 9:00 AM - 5:00 PM <br />
                    Sat: 9:00 AM - 2:00 PM
                  </p>
                </div>

                {/* Branch 2 */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-600">
                    Matta Branch
                  </h3>
                  <p className="mt-2">
                    <strong>Address:</strong> Matta Swat
                  </p>
                  <p>
                    <strong>Phone:</strong> <br />
                    0092-3240044449 <br />
                    +966-50-9876543 <br />
                    +966-55-1112233
                  </p>
                  <p>
                    <strong>Email:</strong> saudi@chichienterprises.com
                  </p>
                  <p>
                    <strong>Business Hours:</strong> <br />
                    Sun-Thu: 9:00 AM - 5:00 PM <br />
                    Fri: 9:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white shadow-inner rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Drop Us a Message
              </h2>
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="user_name"
                      placeholder="Your Name"
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="user_email"
                      placeholder="Your Email"
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Your Message"
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all flex items-center justify-center shadow-md"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Connect With Us
          </h3>
          <div className="flex justify-center gap-8">
            <a
              href="https://www.facebook.com/chichienterprises/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-4xl transition-transform transform hover:scale-110"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 text-4xl transition-transform transform hover:scale-110"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700 text-4xl transition-transform transform hover:scale-110"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://wa.me/923469338816"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 text-4xl transition-transform transform hover:scale-110"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import Services_Home from "../assets/services/Serivces_Home.jpg";
import { services } from "../data/data";
import { Link } from "react-router-dom";

const OurServices = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 space-y-16 lg:space-y-20">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
        <img
          src={Services_Home}
          alt="Chichi Enterprises - Our Services Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            Our Services
          </h1>
        </div>
      </div>

      {/* Services Overview */}
      <div className="text-center sm:text-left mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-start mb-4">
          Tailored Staffing Solutions for KSA & Beyond
        </h2>
        <p className="text-gray-700 text-lg text-start leading-relaxed">
          At Chichi Enterprises, we specialize in the recruitment and placement
          of skilled workers in Saudi Arabia across multiple sectors. Whether
          you are looking for experienced laborers, skilled tradespeople, or
          professional staff, we have the expertise to deliver high-quality
          workers that meet your specific needs.
        </p>
      </div>

      {/* Services Section */}
      <div className="max-w-5xl mx-auto space-y-16 lg:space-y-20">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`flex flex-col-reverse md:flex-row items-center md:gap-12 lg:gap-16 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Service Text */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {service.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {service.description}{" "}
                <Link
                  className="text-blue-600 font-medium hover:underline"
                  to={`/services/${service.id}`}
                >
                  Learn More...
                </Link>
              </p>
            </div>

            {/* Service Image */}
            <div className="flex-1 flex justify-center">
              <img
                src={service.image}
                alt={`${service.title} - Chichi Enterprises`}
                className="w-full max-w-md md:max-w-lg h-auto max-h-80 md:max-h-96 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;

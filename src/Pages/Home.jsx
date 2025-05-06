import { useEffect, useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import Riyadh from "../assets/services/Riyadh.jpeg";
import Hajj from "../assets/services/Hajj.jpg";
import Umrah from "../assets/services/Umrah.jpg";
import Hajj2 from "../assets/services/Hajj2.jpg";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, limit } from "firebase/firestore";
import PackageCard from "../Components/Package";

const Home = () => {
  const [hajjPackages, setHajjPackages] = useState([]);
  const [umrahPackages, setUmrahPackages] = useState([]);
  const [loadingHajj, setLoadingHajj] = useState(true);
  const [loadingUmrah, setLoadingUmrah] = useState(true);
  const [errorHajj, setErrorHajj] = useState(null);
  const [errorUmrah, setErrorUmrah] = useState(null);

  // Client-side caching functions
  const cacheData = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  const getCachedData = (key, maxAge = 5 * 60 * 1000) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > maxAge) return null; // Cache expires after 5 minutes
      return data;
    } catch (err) {
      console.error(`Error parsing cached data for ${key}:`, err);
      return null;
    }
  };

  // Fetch packages with caching and timeout
  const fetchPackages = useCallback(
    async (collectionName, setPackages, setLoading, setError) => {
      const cacheKey = `cached-${collectionName}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setPackages(cachedData);
        setLoading(false);
        return;
      }

      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 10000); // 10 seconds timeout
        });

        const q = query(collection(db, collectionName), limit(4));
        const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);

        const fetchedPackages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPackages(fetchedPackages);
        cacheData(cacheKey, fetchedPackages); // Cache the data
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(`Failed to load ${collectionName}. Please try again later.`);
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPackages(
      "hajjPackages",
      setHajjPackages,
      setLoadingHajj,
      setErrorHajj
    );
    fetchPackages(
      "umrahPackages",
      setUmrahPackages,
      setLoadingUmrah,
      setErrorUmrah
    );
  }, [fetchPackages]);

  // Static testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Khan",
      feedback:
        "Chichi Enterprises made my Umrah journey seamless and unforgettable. Their attention to detail and support were exceptional!",
      role: "Traveler",
    },
    {
      id: 2,
      name: "Fatima Ali",
      feedback:
        "I highly recommend Chichi Enterprises for Hajj packages. The team was professional, and everything was perfectly organized.",
      role: "Pilgrim",
    },
    {
      id: 3,
      name: "Omar Farooq",
      feedback:
        "Thanks to Chichi Enterprises, my family and I had a stress-free trip. Their services are top-notch and truly reliable.",
      role: "Customer",
    },
  ];

  // Memoized Testimonial Card component
  const TestimonialCard = memo(({ testimonial }) => (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="p-6 sm:p-8 text-center">
        <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 italic leading-relaxed">
          {testimonial.feedback}
        </p>
        <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
          {testimonial.name}
        </h3>
        <p className="text-indigo-600 text-sm sm:text-base font-medium">
          {testimonial.role}
        </p>
      </div>
    </div>
  ));

  TestimonialCard.displayName = "TestimonialCard";

  TestimonialCard.propTypes = {
    testimonial: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      feedback: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <>
      {/* Hero Section */}
      <section className="text-gray-600 body-font bg-gradient-to-r from-indigo-50 to-gray-100 relative">
        <div className="container mx-auto flex px-5 sm:px-8 py-20 sm:py-28 md:py-32 flex-col md:flex-row items-center relative overflow-hidden">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-12 sm:mb-16 md:mb-0 items-center text-center z-10">
            <h1 className="title-font text-3xl sm:text-4xl mb-6 sm:mb-8 font-bold text-gray-900 leading-tight tracking-tight">
              Discover Your Journey with
              <span className="block text-indigo-600 mt-2 sm:mt-3">
                Chichi Enterprises
              </span>
            </h1>
            <p className="mb-8 sm:mb-10 text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 font-light max-w-md">
              Transform your travel dreams into reality with seamless, tailored
              solutions for vacations, adventures, and business trips.
            </p>
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <Link to="/OurServices">
                <button className="inline-flex items-center text-white bg-indigo-600 border-0 py-3 sm:py-4 px-8 sm:px-12 focus:outline-none hover:bg-indigo-700 rounded-full text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
                  Explore More
                </button>
              </Link>
              <Link
                to="/ContactUs"
                className="inline-flex items-center text-indigo-600 bg-transparent border-2 border-indigo-600 py-3 sm:py-4 px-6 sm:px-10 focus:outline-none hover:bg-indigo-600 hover:text-white rounded-full text-base sm:text-lg font-semibold transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-full sm:w-5/6 relative z-10">
            <div className="relative">
              <img
                className="object-cover object-center rounded-2xl shadow-2xl w-full h-64 sm:h-80 md:h-96"
                alt="hero"
                src={Riyadh}
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 w-24 sm:w-32 h-24 sm:h-32 bg-indigo-200 rounded-full opacity-40 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-20 sm:w-24 h-20 sm:h-24 bg-indigo-300 rounded-full opacity-40 blur-xl"></div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-full max-w-4xl h-80 sm:h-96 bg-indigo-200 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Umrah Packages Section */}
      <section className="text-gray-600">
        <div className="container px-5 sm:px-8 py-20 sm:py-28 mx-auto">
          <div className="flex justify-between items-center mb-12 sm:mb-16 flex-col md:flex-row">
            <div className="text-left mb-8 md:mb-0">
              <h1 className="sm:text-4xl text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                Umrah Packages
              </h1>
              <p className="text-base sm:text-lg text-gray-700 font-light max-w-md">
                Explore our carefully curated Umrah packages for a spiritual
                journey.
              </p>
            </div>
            <Link
              to="/umrahPackages"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 text-base sm:text-lg transition-colors duration-300 hover:underline"
              aria-label="View More Umrah Packages"
            >
              More Packages →
            </Link>
          </div>

          {errorUmrah && !loadingUmrah && (
            <p className="text-center text-red-600 text-base sm:text-xl font-light mb-6 sm:mb-8">
              {errorUmrah}
            </p>
          )}

          {loadingUmrah ? (
            <p className="text-center text-gray-700 text-base sm:text-xl font-light animate-pulse">
              Loading Umrah packages...
            </p>
          ) : umrahPackages.length === 0 ? (
            <p className="text-center text-gray-700 text-base sm:text-xl font-light">
              No Umrah packages available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {umrahPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} type="Umrah" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hajj Packages Section */}
      <section className="text-gray-600">
        <div className="container px-5 sm:px-8 py-20 sm:py-28 mx-auto">
          <div className="flex justify-between items-center mb-12 sm:mb-16 flex-col md:flex-row">
            <div className="text-left mb-8 md:mb-0">
              <h1 className="sm:text-4xl text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                Hajj Packages
              </h1>
              <p className="text-base sm:text-lg text-gray-700 font-light max-w-md">
                Discover our Hajj packages designed for a fulfilling pilgrimage.
              </p>
            </div>
            <Link
              to="/hajjPackages"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 text-base sm:text-lg transition-colors duration-300 hover:underline"
              aria-label="View More Hajj Packages"
            >
              More Packages →
            </Link>
          </div>

          {errorHajj && !loadingHajj && (
            <p className="text-center text-red-600 text-base sm:text-xl font-light mb-6 sm:mb-8">
              {errorHajj}
            </p>
          )}

          {loadingHajj ? (
            <p className="text-center text-gray-700 text-base sm:text-xl font-light animate-pulse">
              Loading Hajj packages...
            </p>
          ) : hajjPackages.length === 0 ? (
            <p className="text-center text-gray-700 text-base sm:text-xl font-light">
              No Hajj packages available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {hajjPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} type="Hajj" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What People Say About Us Section */}
      <section className="text-gray-600 relative">
        <div className="container px-5 sm:px-8 py-20 sm:py-28 mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="sm:text-4xl text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
              What People Say About Us
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-light max-w-md mx-auto">
              Hear from our satisfied customers about their experiences with
              Chichi Enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-full max-w-4xl h-80 sm:h-96 bg-indigo-200 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="text-gray-600 relative overflow-hidden">
        <div className="container mx-auto px-5 sm:px-8 py-16 sm:py-24 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-3 leading-tight tracking-tight">
              About Us
            </h1>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 font-light max-w-md mb-4 sm:mb-6 md:mb-6">
              Founded in 2007,{" "}
              <span className="font-bold">Chichi Enterprises</span> is a leading
              recruitment agency specializing in providing top-tier manpower to
              the Kingdom of Saudi Arabia (KSA). With over a decade of
              experience in the industry, we have earned a reputation for
              delivering reliable, skilled, and hardworking professionals to
              meet the growing demands of diverse sectors.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 text-base sm:text-lg md:text-lg transition-colors duration-300 hover:underline py-2 sm:py-4 md:py-4"
              aria-label="Learn More About Chichi Enterprises"
            >
              Learn More →
            </Link>
          </div>
          <div className="w-full md:w-1/2 flex justify-center relative z-10">
            {/* Mobile View: Single-column grid */}
            <div className="md:hidden grid grid-cols-1 gap-4 max-w-sm">
              <div className="relative w-full h-48 sm:h-64">
                <img
                  className="object-cover w-full h-full rounded-xl shadow-md"
                  alt="About Chichi Enterprises 1"
                  src={Hajj}
                  loading="lazy"
                />
              </div>
              <div className="relative w-full h-48 sm:h-64">
                <img
                  className="object-cover w-full h-full rounded-xl shadow-md"
                  alt="About Chichi Enterprises 2"
                  src={Umrah}
                  loading="lazy"
                />
              </div>
              <div className="relative w-full h-48 sm:h-64">
                <img
                  className="object-cover w-full h-full rounded-xl shadow-md"
                  alt="About Chichi Enterprises 3"
                  src={Hajj2}
                  loading="lazy"
                />
              </div>
            </div>
            {/* Desktop View: Original overlapping stack */}
            <div className="hidden md:flex -space-x-4">
              <div className="relative w-32 h-[30rem]">
                <img
                  className="object-cover w-full h-full rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
                  alt="About Chichi Enterprises 1"
                  src={Hajj}
                  loading="lazy"
                />
              </div>
              <div className="relative top-20 w-32 h-[30rem]">
                <img
                  className="object-cover w-full h-full rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
                  alt="About Chichi Enterprises 2"
                  src={Umrah}
                  loading="lazy"
                />
              </div>
              <div className="relative w-32 h-[30rem]">
                <img
                  className="object-cover w-full h-full rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
                  alt="About Chichi Enterprises 3"
                  src={Hajj2}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-start opacity-15 pointer-events-none">
            <div className="w-2/3 h-3/4 sm:h-full bg-indigo-200 rounded-r-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

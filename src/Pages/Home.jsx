import { useEffect, useState } from "react";
import Banner1 from "../assets/banner1.avif";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, limit, query } from "firebase/firestore";

const Home = () => {
  const [hajjPackages, setHajjPackages] = useState([]);
  const [umrahPackages, setUmrahPackages] = useState([]);
  const [loadingHajj, setLoadingHajj] = useState(true);
  const [loadingUmrah, setLoadingUmrah] = useState(true);

  // Fetch limited Hajj and Umrah packages
  useEffect(() => {
    const hajjQuery = query(collection(db, "hajjPackages"), limit(4));
    const unsubscribeHajj = onSnapshot(
      hajjQuery,
      (snapshot) => {
        const fetchedPackages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHajjPackages(fetchedPackages);
        setLoadingHajj(false);
      },
      (err) => {
        console.error("Error fetching Hajj packages:", err);
        setLoadingHajj(false);
      }
    );

    const umrahQuery = query(collection(db, "umrahPackages"), limit(4));
    const unsubscribeUmrah = onSnapshot(
      umrahQuery,
      (snapshot) => {
        const fetchedPackages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUmrahPackages(fetchedPackages);
        setLoadingUmrah(false);
      },
      (err) => {
        console.error("Error fetching Umrah packages:", err);
        setLoadingUmrah(false);
      }
    );

    return () => {
      unsubscribeHajj();
      unsubscribeUmrah();
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="text-gray-600 body-font bg-gradient-to-r from-indigo-50 to-gray-100 relative">
        <div className="container mx-auto flex px-5 py-28 md:flex-row flex-col items-center relative overflow-hidden">
          {/* Left Side: Text Content */}
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center z-10">
            <h1 className="title-font sm:text-5xl text-4xl mb-6 font-bold text-gray-900 leading-tight tracking-tight">
              Discover Your Journey with
              <span className="block text-indigo-600 mt-2">
                Chichi Enterprises
              </span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-700 font-light max-w-md">
              Transform your travel dreams into reality with seamless, tailored
              solutions for vacations, adventures, and business trips.
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/OurServices">
                <button className="inline-flex items-center text-white bg-indigo-600 border-0 py-3 px-10 focus:outline-none hover:bg-indigo-700 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
                  Explore More
                </button>
              </Link>
              <Link
                to="/ContactUs"
                className="inline-flex items-center text-indigo-600 bg-transparent border-2 border-indigo-600 py-3 px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded-full text-lg font-semibold transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 relative z-10">
            <div className="relative">
              <img
                className="object-cover object-center rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                alt="hero"
                src={Banner1}
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-full opacity-40 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-300 rounded-full opacity-40 blur-xl"></div>
            </div>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-full max-w-4xl h-96 bg-indigo-200 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Umrah Packages Section */}
      <section className="text-gray-600 bg-gradient-to-r from-indigo-50 to-gray-100">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row">
            <div className="text-left mb-6 md:mb-0">
              <h1 className="sm:text-4xl text-3xl font-bold title-font text-gray-900 mb-3 leading-tight tracking-tight">
                Umrah Packages
              </h1>
              <p className="text-lg leading-relaxed text-gray-700 font-light max-w-md">
                Explore our carefully curated Umrah packages for a spiritual
                journey.
              </p>
            </div>
            <Link
              to="/umrahPackages"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 text-lg transition-colors duration-300 hover:underline"
            >
              More Packages →
            </Link>
          </div>

          {loadingUmrah ? (
            <p className="text-center text-gray-700 text-xl font-light animate-pulse">
              Loading Umrah packages...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {umrahPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  {pkg.makkahHotelImages?.length > 0 ? (
                    <img
                      src={pkg.makkahHotelImages[0]}
                      alt={pkg.name || "Umrah Package"}
                      className="w-full h-48 object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-2xl" />
                  )}
                  <div className="p-6 text-center">
                    <h2 className="text-gray-900 text-xl font-semibold mb-4 truncate">
                      {pkg.name || "Unnamed Package"}
                    </h2>
                    <p className="text-gray-700 text-base mb-2">
                      <span className="font-medium text-indigo-600">
                        Price:
                      </span>{" "}
                      {pkg.price ? `${pkg.price.toLocaleString()} PKR` : "N/A"}
                    </p>
                    <p className="text-gray-700 text-base mb-2">
                      <span className="font-medium text-indigo-600">
                        Duration:
                      </span>{" "}
                      {pkg.duration || "N/A"} days
                    </p>
                    <p className="text-gray-700 text-base">
                      <span className="font-medium text-indigo-600">
                        Distance:
                      </span>{" "}
                      {pkg.distanceMakkah || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hajj Packages Section */}
      <section className="text-gray-600 bg-gradient-to-r from-indigo-50 to-gray-100">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row">
            <div className="text-left mb-6 md:mb-0">
              <h1 className="sm:text-4xl text-3xl font-bold title-font text-gray-900 mb-3 leading-tight tracking-tight">
                Hajj Packages
              </h1>
              <p className="text-lg leading-relaxed text-gray-700 font-light max-w-md">
                Discover our Hajj packages designed for a fulfilling pilgrimage.
              </p>
            </div>
            <Link
              to="/hajjPackages"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 text-lg transition-colors duration-300 hover:underline"
            >
              More Packages →
            </Link>
          </div>

          {loadingHajj ? (
            <p className="text-center text-gray-700 text-xl font-light animate-pulse">
              Loading Hajj packages...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {hajjPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  {pkg.makkahHotelImages?.length > 0 ? (
                    <img
                      src={pkg.makkahHotelImages[0]}
                      alt={pkg.name || "Hajj Package"}
                      className="w-full h-48 object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-2xl" />
                  )}
                  <div className="p-6 text-center">
                    <h2 className="text-gray-900 text-xl font-semibold mb-4 truncate">
                      {pkg.name || "Unnamed Package"}
                    </h2>
                    <p className="text-gray-700 text-base mb-2">
                      <span className="font-medium text-indigo-600">
                        Price:
                      </span>{" "}
                      {pkg.price ? `${pkg.price.toLocaleString()} PKR` : "N/A"}
                    </p>
                    <p className="text-gray-700 text-base mb-2">
                      <span className="font-medium text-indigo-600">
                        Duration:
                      </span>{" "}
                      {pkg.duration || "N/A"} days
                    </p>
                    <p className="text-gray-700 text-base">
                      <span className="font-medium text-indigo-600">
                        Distance:
                      </span>{" "}
                      {pkg.distanceMakkah || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;

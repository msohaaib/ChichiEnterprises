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
      <section className="text-gray-600 body-font bg-gradient-to-r from-indigo-50 to-gray-100">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center relative overflow-hidden">
          {/* Left Side: Text Content */}
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center z-10">
            <h1 className="title-font sm:text-5xl text-4xl mb-6 font-bold text-gray-900 leading-tight tracking-tight">
              Discover Your Journey with
              <span className="block text-indigo-600">Chichi Enterprises</span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-700 font-light max-w-md">
              Transform your travel dreams into reality with seamless, tailored
              solutions for vacations, adventures, and business trips.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/OurServices">
                <button className="inline-flex items-center text-white bg-indigo-600 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-700 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
                  Explore More
                </button>
              </Link>
              <Link
                to="/ContactUs"
                className="inline-flex items-center text-indigo-600 bg-transparent border-2 border-indigo-600 py-3 px-6 focus:outline-none hover:bg-indigo-600 hover:text-white rounded-full text-lg font-semibold transition-all duration-300"
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
              />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-300 rounded-full opacity-50 blur-xl"></div>
            </div>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-96 h-96 bg-indigo-200 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Umrah Packages Section */}
      <section className="text-gray-600">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row">
            <div className="text-left mb-6 md:mb-0">
              <h1 className="sm:text-3xl text-2xl font-semibold title-font text-gray-900 mb-2">
                Umrah Packages
              </h1>
              <p className="text-base leading-relaxed text-gray-500 max-w-lg">
                Explore our carefully curated Umrah packages for a spiritual
                journey.
              </p>
            </div>
            <Link
              to="/umrahPackages"
              className="text-indigo-500 font-medium hover:underline text-lg"
            >
              More Packages →
            </Link>
          </div>

          {loadingUmrah ? (
            <p className="text-center text-gray-600 text-lg">
              Loading Umrah packages...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {umrahPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {pkg.makkahHotelImages?.length > 0 ? (
                    <img
                      src={pkg.makkahHotelImages[0]}
                      alt={pkg.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200" />
                  )}
                  <div className="p-5 text-center">
                    <h2 className="text-gray-900 text-xl font-semibold mb-3">
                      {pkg.name || "Unnamed Package"}
                    </h2>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Price:</span>{" "}
                      {pkg.price ? `${pkg.price.toLocaleString()} PKR` : "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Duration:</span>{" "}
                      {pkg.duration || "N/A"} days
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Distance:</span>{" "}
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
      <section className="text-gray-600">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row">
            <div className="text-left mb-6 md:mb-0">
              <h1 className="sm:text-3xl text-2xl font-semibold title-font text-gray-900 mb-2">
                Hajj Packages
              </h1>
              <p className="text-base leading-relaxed text-gray-500 max-w-lg">
                Discover our Hajj packages designed for a fulfilling pilgrimage.
              </p>
            </div>
            <Link
              to="/hajjPackages"
              className="text-indigo-500 font-medium hover:underline text-lg"
            >
              More Packages →
            </Link>
          </div>

          {loadingHajj ? (
            <p className="text-center text-gray-600 text-lg">
              Loading Hajj packages...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {hajjPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {pkg.makkahHotelImages?.length > 0 ? (
                    <img
                      src={pkg.makkahHotelImages[0]}
                      alt={pkg.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200" />
                  )}
                  <div className="p-5 text-center">
                    <h2 className="text-gray-900 text-xl font-semibold mb-3">
                      {pkg.name || "Unnamed Package"}
                    </h2>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Price:</span>{" "}
                      {pkg.price ? `${pkg.price.toLocaleString()} PKR` : "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Duration:</span>{" "}
                      {pkg.duration || "N/A"} days
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Distance:</span>{" "}
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

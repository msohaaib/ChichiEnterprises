import { useEffect, useState } from "react";
import Banner1 from "../assets/banner1.avif";
// import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, limit, query } from "firebase/firestore";

const Home = () => {
  const [hajjPackages, setHajjPackages] = useState([]);
  const [umrahPackages, setUmrahPackages] = useState([]);
  const [loadingHajj, setLoadingHajj] = useState(true);
  const [loadingUmrah, setLoadingUmrah] = useState(true);

  // Fetch limited Hajj packages
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

    // Fetch limited Umrah packages
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
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Welcome to Chichi Enterprises
              <br className="lg:inline-block" /> Your Trusted Travel Partner!
            </h1>
            <p className="mb-8 leading-relaxed">
              At CHICHI ENTERPRISES, we turn your travel dreams into reality.
              Whether you&apos;re planning a relaxing vacation, an adventurous
              getaway, or a business trip, we provide seamless and hassle-free
              travel solutions tailored to your needs.
            </p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Explore Now
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src={Banner1}
            />
          </div>
        </div>
      </section>

      {/* Umrah Packages Section */}
      <section className="text-gray-600">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex justify-between items-center mb-10 flex-col md:flex-row">
            <div className="text-left mb-5 md:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                Umrah Packages
              </h1>
              <p className="text-base leading-relaxed text-gray-500 max-w-lg">
                Explore our carefully curated Umrah packages for a spiritual
                journey.
              </p>
            </div>
            <Link
              to="/umrahPackages"
              className="text-indigo-500 font-medium hover:underline"
            >
              More Packages →
            </Link>
          </div>

          {loadingUmrah ? (
            <p className="text-center text-gray-600">
              Loading Umrah packages...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {umrahPackages.map((pkg) => (
                <div key={pkg.id} className="p-6 bg-white shadow-lg rounded-xl">
                  <div className="flex flex-col items-center text-center">
                    {pkg.makkahHotelImages?.length > 0 ? (
                      <img
                        src={pkg.makkahHotelImages[0]}
                        alt={pkg.name}
                        className="w-20 h-20 object-cover rounded-full mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full mb-3" />
                    )}
                    <h2 className="text-gray-900 text-lg font-medium mb-2">
                      {pkg.name || "Unnamed Package"}
                    </h2>
                    <p className="leading-relaxed text-base text-gray-600">
                      Price:{" "}
                      {pkg.price ? `${pkg.price.toLocaleString()} PKR` : "N/A"}
                    </p>
                    <p className="leading-relaxed text-base text-gray-600">
                      Duration: {pkg.duration || "N/A"} days
                    </p>
                    <p className="leading-relaxed text-base text-gray-600">
                      Distance: {pkg.distanceMakkah || "N/A"}
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
          <div className="flex justify-between items-center mb-10 flex-col md:flex-row">
            <div className="text-left mb-5 md:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                Hajj Packages
              </h1>
              <p className="text-base leading-relaxed text-gray-500 max-w-lg">
                Discover our Hajj packages designed for a fulfilling pilgrimage.
              </p>
            </div>
            <Link
              to="/hajjPackages"
              className="text-indigo-500 font-medium hover:underline"
            >
              More Packages →
            </Link>
          </div>

          {loadingHajj ? (
            <p className="text-center text-gray-600">
              Loading Hajj packages...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {hajjPackages.map((pkg) => (
                <div key={pkg.id} className="p-6 bg-white shadow-lg rounded-xl">
                  <div className="flex flex-col items-center text-center">
                    {pkg.makkahHotelImages?.length > 0 ? (
                      <img
                        src={pkg.makkahHotelImages[0]}
                        alt={pkg.name}
                        className="w-20 h-20 object-cover rounded-full mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full mb-3" />
                    )}
                    <h2 className="text-gray-900 text-lg font-medium mb-2">
                      {pkg.name || "Unnamed Package"}
                    </h2>
                    <p className="leading-relaxed text-base text-gray-600">
                      Price:{" "}
                      {pkg.price ? `${pkg.price.toLocaleString()} PKR` : "N/A"}
                    </p>
                    <p className="leading-relaxed text-base text-gray-600">
                      Duration: {pkg.duration || "N/A"} days
                    </p>
                    <p className="leading-relaxed text-base text-gray-600">
                      Distance: {pkg.distanceMakkah || "N/A"}
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

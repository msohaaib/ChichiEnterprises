import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import PackageCard from "../Components/Package";

const UmrahPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    priceMax: "",
    duration: "",
    daysInMakkah: "",
    daysInMadinah: "",
    distanceMakkah: "",
  });

  // Fetch Umrah packages from Firestore
  useEffect(() => {
    const collectionRef = collection(db, "umrahPackages");
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const fetchedPackages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Umrah Package",
            price: Number(data.price) || 0,
            duration: Number(data.duration) || 0,
            daysInMakkah: Number(data.daysInMakkah) || 0,
            daysInMadinah: Number(data.daysInMadinah) || 0,
            distanceMakkah: data.distanceMakkah || "",
            distanceMadinah: data.distanceMadinah || "",
            visaIncluded: data.visaIncluded || false,
            transport: data.transport ?? false,
            makkahHotel: data.makkahHotel || { name: "", starRating: "" },
            madinahHotel: data.madinahHotel || { name: "", starRating: "" },
            makkahHotelImages: data.makkahHotelImages || [],
            madinahHotelImages: data.madinahHotelImages || [],
            inclusions: data.inclusions || [],
            departureDates: data.departureDates || [],
          };
        });
        setPackages(fetchedPackages);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching Umrah packages:", err);
        setError("Failed to load Umrah packages. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : value.replace(/[^0-9]/g, "");
    setFilters((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceMax: "",
      duration: "",
      daysInMakkah: "",
      daysInMadinah: "",
      distanceMakkah: "",
    });
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const distanceMakkahNum = pkg.distanceMakkah
        ? Number(pkg.distanceMakkah.replace(/[^0-9]/g, ""))
        : 0;

      return (
        (!filters.priceMax || pkg.price <= Number(filters.priceMax)) &&
        (!filters.duration || pkg.duration === Number(filters.duration)) &&
        (!filters.daysInMakkah ||
          pkg.daysInMakkah === Number(filters.daysInMakkah)) &&
        (!filters.daysInMadinah ||
          pkg.daysInMadinah === Number(filters.daysInMadinah)) &&
        (!filters.distanceMakkah ||
          distanceMakkahNum <= Number(filters.distanceMakkah))
      );
    });
  }, [packages, filters]);

  const retryFetch = useCallback(() => {
    setLoading(true);
    setError(null);
    const collectionRef = collection(db, "umrahPackages");
    onSnapshot(
      collectionRef,
      (snapshot) => {
        const fetchedPackages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Umrah Package",
            price: Number(data.price) || 0,
            duration: Number(data.duration) || 0,
            daysInMakkah: Number(data.daysInMakkah) || 0,
            daysInMadinah: Number(data.daysInMadinah) || 0,
            distanceMakkah: data.distanceMakkah || "",
            distanceMadinah: data.distanceMadinah || "",
            visaIncluded: data.visaIncluded || false,
            transport: data.transport ?? false,
            makkahHotel: data.makkahHotel || { name: "", starRating: "" },
            madinahHotel: data.madinahHotel || { name: "", starRating: "" },
            makkahHotelImages: data.makkahHotelImages || [],
            madinahHotelImages: data.madinahHotelImages || [],
            inclusions: data.inclusions || [],
            departureDates: data.departureDates || [],
          };
        });
        setPackages(fetchedPackages);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching Umrah packages:", err);
        setError("Failed to load Umrah packages. Please try again later.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <section className="text-gray-600 min-h-screen">
      <div className="container px-5 sm:px-8 py-16 sm:py-20 mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 sm:mb-12 flex-col md:flex-row">
          <div className="text-left mb-6 md:mb-0">
            <h1 className="sm:text-4xl text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight tracking-tight">
              Umrah Packages
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-light">
              Discover our Umrah packages designed for a fulfilling pilgrimage.
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Filter Umrah Packages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "priceMax", placeholder: "Max Price (PKR)" },
              { name: "duration", placeholder: "Duration (days)" },
              { name: "daysInMakkah", placeholder: "Days in Makkah" },
              { name: "daysInMadinah", placeholder: "Days in Madinah" },
              {
                name: "distanceMakkah",
                placeholder: "Max Distance Makkah (m)",
              },
            ].map((filter) => (
              <input
                key={filter.name}
                type="text"
                name={filter.name}
                value={filters[filter.name]}
                onChange={handleFilterChange}
                placeholder={filter.placeholder}
                className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          <button
            onClick={resetFilters}
            className="mt-3 bg-indigo-600 text-white py-1 px-3 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset Filters
          </button>
        </div>

        {/* Packages Display */}
        {loading ? (
          <p className="text-center text-gray-700 text-base sm:text-lg font-light animate-pulse">
            Loading Umrah packages...
          </p>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600 text-base sm:text-lg font-light mb-4">
              {error}
            </p>
            <button
              onClick={retryFetch}
              className="bg-indigo-600 text-white py-1 px-3 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        ) : filteredPackages.length === 0 ? (
          <p className="text-center text-gray-700 text-base sm:text-lg font-light">
            No Umrah packages match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} type="Umrah" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UmrahPackages;

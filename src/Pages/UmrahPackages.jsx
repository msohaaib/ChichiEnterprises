import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

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
            transport: data.transport || "Not specified",
            makkahHotel: data.makkahHotel || {},
            makkahHotelImages: data.makkahHotelImages || [],
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

  return (
    <section className="text-gray-600">
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
              { name: "priceMax", placeholder: "Max Price (USD)" },
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
          <p className="text-center text-red-600 text-base sm:text-lg font-light mb-4 sm:mb-6">
            {error}
          </p>
        ) : filteredPackages.length === 0 ? (
          <p className="text-center text-gray-700 text-base sm:text-lg font-light">
            No Umrah packages match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs w-full transition-colors duration-200 hover:bg-gray-50 self-start"
              >
                {/* Key Fields Section */}
                <div className="space-y-1">
                  <h2 className="text-gray-900 text-lg font-semibold truncate">
                    {pkg.name}
                  </h2>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm font-medium">
                      Price:
                    </span>
                    <span className="text-gray-900 text-sm">
                      ${pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm font-medium">
                      Duration:
                    </span>
                    <span className="text-gray-900 text-sm">
                      {pkg.duration} days
                    </span>
                  </div>
                </div>

                {/* Secondary Fields */}
                <div className="mt-2 space-y-0.5 text-gray-900 text-xs">
                  {pkg.daysInMakkah && (
                    <p>
                      <span className="text-gray-600 capitalize">
                        Makkah Stay:
                      </span>{" "}
                      {pkg.daysInMakkah} days
                    </p>
                  )}
                  {pkg.daysInMadinah && (
                    <p>
                      <span className="text-gray-600 capitalize">
                        Madinah Stay:
                      </span>{" "}
                      {pkg.daysInMadinah} days
                    </p>
                  )}
                  {pkg.distanceMakkah && (
                    <p>
                      <span className="text-gray-600 capitalize">
                        Distance to Haram:
                      </span>{" "}
                      {pkg.distanceMakkah}
                    </p>
                  )}
                  {pkg.makkahHotel.name && (
                    <p>
                      <span className="text-gray-600 capitalize">Hotel:</span>{" "}
                      {pkg.makkahHotel.name} ({pkg.makkahHotel.starRating}★)
                    </p>
                  )}
                  {pkg.transport && (
                    <p>
                      <span className="text-gray-600 capitalize">
                        Transport:
                      </span>{" "}
                      {pkg.transport}
                    </p>
                  )}
                  {pkg.inclusions.length > 0 && (
                    <div>
                      <span className="text-gray-600 capitalize">
                        Inclusions:
                      </span>
                      <ul className="list-disc list-inside truncate">
                        {pkg.inclusions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.departureDates.length > 0 && (
                    <p>
                      <span className="text-gray-600 capitalize">
                        Next Departure:
                      </span>{" "}
                      {new Date(pkg.departureDates[0]).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Hotel Image */}
                {pkg.makkahHotelImages?.length > 0 && (
                  <div className="mt-2">
                    <img
                      src={pkg.makkahHotelImages[0]}
                      alt={`${pkg.name} - Hotel`}
                      className="w-full h-28 object-cover rounded-md"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* View Details Button */}
                <div className="mt-3">
                  <a
                    href={`/umrahPackages/${pkg.id}`}
                    className="block text-center bg-indigo-100 text-indigo-700 py-1 px-3 rounded-md text-sm font-medium hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UmrahPackages;

import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const HajjPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPackageId, setExpandedPackageId] = useState(null);

  const [filters, setFilters] = useState({
    priceMax: "",
    duration: "",
    distanceMakkah: "",
  });

  // Fetch Hajj packages from Firestore
  useEffect(() => {
    const collectionRef = collection(db, "hajjPackages");
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const fetchedPackages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Hajj Package",
            price: Number(data.price) || 0,
            duration: Number(data.duration) || 0,
            distanceMakkah: data.distanceMakkah || "",
            visaIncluded: data.visaIncluded || false,
            transport: data.transport || "Not specified",
            makkahHotel: data.makkahHotel || {},
            makkahHotelImages: data.makkahHotelImages || [],
            inclusions: data.inclusions || [],
            departureDates: data.departureDates || [],
            campType: data.campType || "Standard",
            minaDays: Number(data.minaDays) || 0,
          };
        });
        setPackages(fetchedPackages);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching Hajj packages:", err);
        setError("Failed to load Hajj packages. Please try again later.");
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
        (!filters.distanceMakkah ||
          distanceMakkahNum <= Number(filters.distanceMakkah))
      );
    });
  }, [packages, filters]);

  const toggleExpand = useCallback((id) => {
    setExpandedPackageId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section className="text-gray-600">
      <div className="container px-5 sm:px-8 py-16 sm:py-20 mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 sm:mb-12 flex-col md:flex-row">
          <div className="text-left mb-6 md:mb-0">
            <h1 className="sm:text-4xl text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight tracking-tight">
              Hajj Packages
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-light">
              Discover our Hajj packages designed for a fulfilling pilgrimage.
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Filter Hajj Packages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "priceMax", placeholder: "Max Price (PKR)" },
              { name: "duration", placeholder: "Duration (days)" },
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
            Loading Hajj packages...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-base sm:text-lg font-light mb-4 sm:mb-6">
            {error}
          </p>
        ) : filteredPackages.length === 0 ? (
          <p className="text-center text-gray-700 text-base sm:text-lg font-light">
            No Hajj packages match your filters.
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
                      {pkg.price.toLocaleString()} PKR
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

                {/* Default Fields */}
                <div className="mt-2 space-y-0.5 text-gray-900 text-xs">
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
                  <p>
                    <span className="text-gray-600 capitalize">Camp Type:</span>{" "}
                    {pkg.campType}
                  </p>
                  <p>
                    <span className="text-gray-600 capitalize">Mina Stay:</span>{" "}
                    {pkg.minaDays} days
                  </p>
                  {pkg.inclusions.length > 0 && (
                    <div>
                      <span className="text-gray-600 capitalize">
                        Inclusions:
                      </span>
                      <ul className="list-disc list-inside truncate">
                        {pkg.inclusions.slice(0, 2).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                        {pkg.inclusions.length > 2 &&
                          expandedPackageId !== pkg.id && <li>...</li>}
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

                {/* Expanded Content */}
                {expandedPackageId === pkg.id && (
                  <div className="mt-3 space-y-2 text-gray-900 text-xs">
                    {pkg.visaIncluded && (
                      <p>
                        <span className="text-gray-600 capitalize">Visa:</span>{" "}
                        Included
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
                    {pkg.inclusions.length > 2 && (
                      <div>
                        <span className="text-gray-600 capitalize">
                          All Inclusions:
                        </span>
                        <ul className="list-disc list-inside">
                          {pkg.inclusions.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pkg.departureDates.length > 1 && (
                      <div>
                        <span className="text-gray-600 capitalize">
                          All Departure Dates:
                        </span>
                        <ul className="list-disc list-inside">
                          {pkg.departureDates.map((date, index) => (
                            <li key={index}>
                              {new Date(date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pkg.makkahHotelImages?.length > 1 && (
                      <div>
                        <span className="text-gray-600 capitalize">
                          More Hotel Images:
                        </span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {pkg.makkahHotelImages.slice(1).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`${pkg.name} - Hotel ${index + 2}`}
                              className="w-full h-20 object-cover rounded-md"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* View Details Button */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleExpand(pkg.id)}
                    className="block text-center bg-indigo-100 text-indigo-700 py-1 px-3 rounded-md text-sm font-medium hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    {expandedPackageId === pkg.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HajjPackages;

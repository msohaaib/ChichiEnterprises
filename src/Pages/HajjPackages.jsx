import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const HajjPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    priceMax: "",
    duration: "",
    distanceMakkah: "",
    visaIncluded: "",
    transportType: "",
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
      [name]:
        name === "visaIncluded" || name === "transportType"
          ? value
          : numericValue,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceMax: "",
      duration: "",
      distanceMakkah: "",
      visaIncluded: "",
      transportType: "",
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
          distanceMakkahNum <= Number(filters.distanceMakkah)) &&
        (filters.visaIncluded === "" ||
          pkg.visaIncluded.toString() === filters.visaIncluded) &&
        (filters.transportType === "" ||
          pkg.transport === filters.transportType)
      );
    });
  }, [packages, filters]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Hajj Packages
      </h2>

      {/* Filter Section */}
      <div className="container mx-auto mb-8 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Hajj Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "priceMax", placeholder: "Max Price (PKR)" },
            { name: "duration", placeholder: "Duration (days)" },
            { name: "distanceMakkah", placeholder: "Max Distance Makkah (m)" },
          ].map((filter) => (
            <input
              key={filter.name}
              type="text"
              name={filter.name}
              value={filters[filter.name]}
              onChange={handleFilterChange}
              placeholder={filter.placeholder}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <select
            name="visaIncluded"
            value={filters.visaIncluded}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Visa: All</option>
            <option value="true">Visa Included</option>
            <option value="false">Visa Not Included</option>
          </select>
          <select
            name="transportType"
            value={filters.transportType}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Transport: All</option>
            <option value="Private">Private</option>
            <option value="Shared">Shared</option>
            <option value="Not specified">Not Specified</option>
          </select>
        </div>
        <button
          onClick={resetFilters}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Packages Display */}
      <div className="container mx-auto p-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading Hajj packages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredPackages.length === 0 ? (
          <p className="text-center text-gray-600">
            No Hajj packages match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow"
              >
                <h2 className="font-semibold text-xl text-gray-800 mb-2">
                  {pkg.name}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>Price: {pkg.price.toLocaleString()} PKR</p>
                  <p>Duration: {pkg.duration} days</p>
                  {pkg.distanceMakkah && (
                    <p>Distance to Haram: {pkg.distanceMakkah}</p>
                  )}
                  {pkg.makkahHotel.name && (
                    <p>
                      Hotel: {pkg.makkahHotel.name} (
                      {pkg.makkahHotel.starRating}★)
                    </p>
                  )}
                  <p>Visa: {pkg.visaIncluded ? "Included" : "Not Included"}</p>
                  <p>Transport: {pkg.transport}</p>
                  <p>Camp Type: {pkg.campType}</p>
                  <p>Mina Stay: {pkg.minaDays} days</p>
                  {pkg.inclusions.length > 0 && (
                    <div>
                      <p className="font-semibold">Inclusions:</p>
                      <ul className="list-disc list-inside">
                        {pkg.inclusions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.departureDates.length > 0 && (
                    <p>
                      Next Departure:{" "}
                      {new Date(pkg.departureDates[0]).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {pkg.makkahHotelImages?.length > 0 && (
                  <img
                    src={pkg.makkahHotelImages[0]}
                    alt={`${pkg.name} - Hotel`}
                    className="mt-4 w-full h-48 object-cover rounded"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HajjPackages;

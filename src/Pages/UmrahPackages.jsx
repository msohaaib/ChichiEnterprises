import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const UmrahPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state with initial numeric values
  const [filters, setFilters] = useState({
    priceMax: "",
    duration: "",
    daysInMakkah: "",
    daysInMadinah: "",
    distanceMakkah: "",
  });

  // Fetch packages
  useEffect(() => {
    const collectionRef = collection(db, "umrahPackages");
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const fetchedPackages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPackages(fetchedPackages);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Debounced filter handler
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    // Only allow numbers and empty string
    const numericValue = value === "" ? "" : value.replace(/[^0-9]/g, "");
    setFilters((prev) => ({ ...prev, [name]: numericValue }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      priceMax: "",
      duration: "",
      daysInMakkah: "",
      daysInMadinah: "",
      distanceMakkah: "",
    });
  }, []);

  // Memoized filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Convert package values to numbers, handling undefined/null cases
      const price = Number(pkg.price) || 0;
      const duration = Number(pkg.duration) || 0;
      const daysMakkah = Number(pkg.daysInMakkah) || 0;
      const daysMadinah = Number(pkg.daysInMadinah) || 0;
      const distanceMakkahNum = pkg.distanceMakkah
        ? Number(pkg.distanceMakkah.replace(/[^0-9]/g, ""))
        : 0;

      // Apply filters only if they have values
      if (filters.priceMax && price > Number(filters.priceMax)) return false;
      if (filters.duration && duration !== Number(filters.duration))
        return false;
      if (filters.daysInMakkah && daysMakkah !== Number(filters.daysInMakkah))
        return false;
      if (
        filters.daysInMadinah &&
        daysMadinah !== Number(filters.daysInMadinah)
      )
        return false;
      if (
        filters.distanceMakkah &&
        distanceMakkahNum > Number(filters.distanceMakkah)
      )
        return false;

      return true;
    });
  }, [packages, filters]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Umrah Packages
      </h2>

      {/* Filter Section */}
      <div className="container mx-auto mb-8 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "priceMax", placeholder: "Max Price ($)" },
            { name: "duration", placeholder: "Duration (days)" },
            { name: "daysInMakkah", placeholder: "Days in Makkah" },
            { name: "daysInMadinah", placeholder: "Days in Madinah" },
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
          <p className="text-center text-gray-600">Loading packages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredPackages.length === 0 ? (
          <p className="text-center text-gray-600">
            No packages match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow"
              >
                <h2 className="font-semibold text-xl text-gray-800 mb-2">
                  {pkg.name || "Unnamed Package"}
                </h2>
                <p className="text-gray-600">Price: ${pkg.price || "N/A"}</p>
                <p className="text-gray-600">
                  Duration: {pkg.duration || "N/A"} days
                </p>
                <p className="text-gray-600">
                  Makkah: {pkg.daysInMakkah || "N/A"} days
                </p>
                <p className="text-gray-600">
                  Madinah: {pkg.daysInMadinah || "N/A"} days
                </p>
                {pkg.distanceMakkah && (
                  <p className="text-gray-600">
                    Distance (Makkah): {pkg.distanceMakkah}
                  </p>
                )}
                {pkg.distanceMadinah && (
                  <p className="text-gray-600">
                    Madinah Distance: {pkg.distanceMadinah}
                  </p>
                )}
                {pkg.makkahHotelImages?.length > 0 && (
                  <img
                    src={pkg.makkahHotelImages[0]}
                    alt={`${pkg.name} - Makkah Hotel`}
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

export default UmrahPackages;

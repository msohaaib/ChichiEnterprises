import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Hajj");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPackageId, setEditingPackageId] = useState(null);

  // Initial state tailored for Hajj and Umrah (without hotel images)
  const getInitialPackageState = (type) => ({
    name: "",
    price: "",
    duration: "",
    distanceMakkah: "",
    visaIncluded: false,
    transportIncluded: false,
    inclusions: [],
    departureDates: [],
    makkahHotel: { name: "", starRating: "" },
    ...(type === "Hajj"
      ? {
          campType: "",
          minaDays: "",
        }
      : {
          daysInMakkah: "",
          daysInMadinah: "",
          hotelInMakkah: "",
          hotelInMadinah: "",
          distanceMadinah: "",
          madinahHotel: { name: "", starRating: "" },
        }),
    type,
  });

  const [newPackage, setNewPackage] = useState(
    getInitialPackageState(selectedTab)
  );

  if (!user) {
    console.log("No user authenticated, redirecting to login");
    return <Navigate to="/admin-login" replace />;
  }
  console.log("Authenticated user:", user.uid, user.email);

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const collectionName =
        selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages";
      const querySnapshot = await getDocs(collection(db, collectionName));
      const packagesData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Package",
            price: Number(data.price) || 0,
            duration: Number(data.duration) || 0,
            distanceMakkah: data.distanceMakkah || "",
            visaIncluded: data.visaIncluded || false,
            transport: data.transport ?? false,
            inclusions: data.inclusions || [],
            departureDates: data.departureDates || [],
            makkahHotel: data.makkahHotel || { name: "", starRating: "" },
            ...(selectedTab === "Hajj"
              ? {
                  campType: data.campType || "",
                  minaDays: Number(data.minaDays) || 0,
                }
              : {
                  daysInMakkah: Number(data.daysInMakkah) || 0,
                  daysInMadinah: Number(data.daysInMadinah) || 0,
                  hotelInMakkah: data.hotelInMakkah || "",
                  hotelInMadinah: data.hotelInMadinah || "",
                  distanceMadinah: data.distanceMadinah || "",
                  madinahHotel: data.madinahHotel || {
                    name: "",
                    starRating: "",
                  },
                }),
          };
        })
        .filter((pkg) => pkg && pkg.id && pkg.name); // Filter out invalid packages
      setPackages(packagesData);
    } catch (error) {
      console.error(`Error fetching ${selectedTab} packages:`, error);
      setError(
        `Failed to fetch ${selectedTab} packages: ${
          error.message.includes("permission")
            ? "Please ensure you are logged in and have admin permissions."
            : error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchPackages();
    setNewPackage(getInitialPackageState(selectedTab));
    setEditingPackageId(null);
  }, [selectedTab, fetchPackages]);

  // Validate form
  const validateForm = () => {
    if (!newPackage.name) return "Package name is required.";
    if (!newPackage.price || isNaN(Number(newPackage.price)))
      return "Valid price is required.";
    if (!newPackage.duration || isNaN(Number(newPackage.duration)))
      return "Valid duration is required.";
    if (!newPackage.distanceMakkah) return "Distance to Makkah is required.";
    if (selectedTab === "Hajj" && !newPackage.campType)
      return "Camp type is required for Hajj.";
    if (
      selectedTab === "Hajj" &&
      (!newPackage.minaDays || isNaN(Number(newPackage.minaDays)))
    )
      return "Valid Mina days is required for Hajj.";
    if (
      selectedTab === "Umrah" &&
      (!newPackage.daysInMakkah || isNaN(Number(newPackage.daysInMakkah)))
    )
      return "Valid days in Makkah is required for Umrah.";
    if (
      selectedTab === "Umrah" &&
      (!newPackage.daysInMadinah || isNaN(Number(newPackage.daysInMadinah)))
    )
      return "Valid days in Madinah is required for Umrah.";
    return null;
  };

  // Add or Update package
  const addOrUpdatePackage = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const packageData = {
        ...newPackage,
        createdAt: new Date().toISOString(),
        price: Number(newPackage.price) || 0,
        duration: Number(newPackage.duration) || 0,
        inclusions: newPackage.inclusions.length
          ? newPackage.inclusions.split(",").map((item) => item.trim())
          : [],
        departureDates: newPackage.departureDates.length
          ? newPackage.departureDates.split(",").map((date) => date.trim())
          : [],
        transport: newPackage.transportIncluded ?? false,
        ...(selectedTab === "Hajj"
          ? { minaDays: Number(newPackage.minaDays) || 0 }
          : {
              daysInMakkah: Number(newPackage.daysInMakkah) || 0,
              daysInMadinah: Number(newPackage.daysInMadinah) || 0,
            }),
      };

      const collectionName =
        selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages";
      const packageCollection = collection(db, collectionName);

      if (editingPackageId) {
        const packageRef = doc(db, collectionName, editingPackageId);
        await updateDoc(packageRef, packageData);
        setEditingPackageId(null);
      } else {
        await addDoc(packageCollection, packageData);
      }

      setNewPackage(getInitialPackageState(selectedTab));
      await fetchPackages();
    } catch (error) {
      console.error(`Error saving ${selectedTab} package:`, error);
      setError(
        `Failed to save ${selectedTab} package: ${
          error.message.includes("permission")
            ? "Please ensure you are logged in and have admin permissions."
            : error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete package
  const deletePackage = async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Attempting to delete package:", id, "User:", user?.uid);
      const collectionName =
        selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages";
      await deleteDoc(doc(db, collectionName, id));
      await fetchPackages();
    } catch (error) {
      console.error(`Error deleting ${selectedTab} package:`, error);
      setError(
        `Failed to delete ${selectedTab} package: ${
          error.message.includes("permission")
            ? "Please ensure you are logged in and have admin permissions. Check Firestore security rules."
            : error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit package
  const editPackage = (pkg) => {
    setNewPackage({
      ...pkg,
      inclusions: pkg.inclusions?.join(", ") || "",
      departureDates: pkg.departureDates?.join(", ") || "",
      makkahHotel: pkg.makkahHotel || { name: "", starRating: "" },
      ...(selectedTab === "Umrah" && {
        madinahHotel: pkg.madinahHotel || { name: "", starRating: "" },
      }),
    });
    setEditingPackageId(pkg.id);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPackage((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle nested makkahHotel and madinahHotel changes
  const handleHotelChange = (e, hotelType) => {
    const { name, value } = e.target;
    setNewPackage((prev) => ({
      ...prev,
      [hotelType]: {
        ...prev[hotelType],
        [name]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {["Hajj", "Umrah"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTab(type)}
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  selectedTab === type
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type} Packages
              </button>
            ))}
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Package Form */}
        <div className="mt-8 p-6 bg-gray-100 shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {editingPackageId ? "Edit" : "Add"} {selectedTab} Package
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newPackage.name || ""}
                onChange={handleInputChange}
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={newPackage.price || ""}
                onChange={handleInputChange}
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="number"
                name="duration"
                value={newPackage.duration || ""}
                onChange={handleInputChange}
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Distance Makkah
              </label>
              <input
                type="text"
                name="distanceMakkah"
                value={newPackage.distanceMakkah || ""}
                onChange={handleInputChange}
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Visa Included
              </label>
              <input
                type="checkbox"
                name="visaIncluded"
                checked={newPackage.visaIncluded || false}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Transport Included
              </label>
              <input
                type="checkbox"
                name="transportIncluded"
                checked={newPackage.transportIncluded || false}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Inclusions (comma-separated)
              </label>
              <input
                type="text"
                name="inclusions"
                value={newPackage.inclusions || ""}
                onChange={handleInputChange}
                placeholder="e.g., Breakfast, Guided Tours"
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Departure Dates (comma-separated)
              </label>
              <input
                type="text"
                name="departureDates"
                value={newPackage.departureDates || ""}
                onChange={handleInputChange}
                placeholder="e.g., 2025-06-01, 2025-06-15"
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Makkah Hotel Name
              </label>
              <input
                type="text"
                name="name"
                value={newPackage.makkahHotel?.name || ""}
                onChange={(e) => handleHotelChange(e, "makkahHotel")}
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Makkah Hotel Star Rating
              </label>
              <input
                type="number"
                name="starRating"
                value={newPackage.makkahHotel?.starRating || ""}
                onChange={(e) => handleHotelChange(e, "makkahHotel")}
                className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {selectedTab === "Hajj" ? (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Camp Type
                  </label>
                  <input
                    type="text"
                    name="campType"
                    value={newPackage.campType || ""}
                    onChange={handleInputChange}
                    className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Mina Days
                  </label>
                  <input
                    type="number"
                    name="minaDays"
                    value={newPackage.minaDays || ""}
                    onChange={handleInputChange}
                    className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Days in Makkah
                  </label>
                  <input
                    type="number"
                    name="daysInMakkah"
                    value={newPackage.daysInMakkah || ""}
                    onChange={handleInputChange}
                    className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Days in Madinah
                  </label>
                  <input
                    type="number"
                    name="daysInMadinah"
                    value={newPackage.daysInMadinah || ""}
                    onChange={handleInputChange}
                    className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Distance Madinah
                  </label>
                  <input
                    type="text"
                    name="distanceMadinah"
                    value={newPackage.distanceMadinah || ""}
                    onChange={handleInputChange}
                    className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Madinah Hotel Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newPackage.madinahHotel?.name || ""}
                    onChange={(e) => handleHotelChange(e, "madinahHotel")}
                    className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Madinah Hotel Star Rating
                  </label>
                  <input
                    type="number"
                    name="starRating"
                    value={newPackage.madinahHotel?.starRating || ""}
                    onChange={(e) => handleHotelChange(e, "madinahHotel")}
                    className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
          <button
            onClick={addOrUpdatePackage}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full transition disabled:bg-blue-300"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingPackageId
              ? "Update Package"
              : "Add Package"}
          </button>
        </div>

        {/* Display Packages */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">{selectedTab} Packages</h3>
          {loading ? (
            <p className="text-gray-600">Loading packages...</p>
          ) : packages.length === 0 ? (
            <p className="text-gray-600">No {selectedTab} packages found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) =>
                pkg ? (
                  <div key={pkg.id} className="p-4 bg-white shadow rounded-lg">
                    <h4 className="font-bold text-lg text-gray-800">
                      {pkg.name || "Unnamed Package"}
                    </h4>
                    <p className="text-gray-600">
                      Price: {pkg.price.toLocaleString()}{" "}
                      {selectedTab === "Umrah" ? "PKR" : "PKR"}
                    </p>
                    <p className="text-gray-600">
                      Duration: {pkg.duration} days
                    </p>
                    <p className="text-gray-600">
                      Distance Makkah: {pkg.distanceMakkah || "N/A"}
                    </p>
                    {selectedTab === "Hajj" ? (
                      <>
                        <p className="text-gray-600">
                          Camp Type: {pkg.campType || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          Mina Days: {pkg.minaDays || 0}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600">
                          Makkah Days: {pkg.daysInMakkah || 0}
                        </p>
                        <p className="text-gray-600">
                          Madinah Days: {pkg.daysInMadinah || 0}
                        </p>
                        <p className="text-gray-600">
                          Distance Madinah: {pkg.distanceMadinah || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          Makkah Hotel: {pkg.makkahHotel?.name || "N/A"} (
                          {pkg.makkahHotel?.starRating || 0}★)
                        </p>
                        <p className="text-gray-600">
                          Madinah Hotel: {pkg.madinahHotel?.name || "N/A"} (
                          {pkg.madinahHotel?.starRating || 0}★)
                        </p>
                      </>
                    )}
                    <p className="text-gray-600">
                      Transport: {pkg.transport ? "Included" : "Not Included"}
                    </p>
                    <p className="text-gray-600">
                      Inclusions: {pkg.inclusions?.join(", ") || "None"}
                    </p>
                    <p className="text-gray-600">
                      Departure Dates:{" "}
                      {pkg.departureDates?.join(", ") || "None"}
                    </p>
                    <div className="mt-3 space-x-2">
                      <button
                        onClick={() => editPackage(pkg)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

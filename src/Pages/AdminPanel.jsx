import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { db, storage } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Hajj");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);

  // Initial state tailored for Hajj and Umrah
  const getInitialPackageState = (type) => ({
    name: "",
    price: "",
    duration: "",
    distanceMakkah: "", // Added for both Hajj and Umrah
    visaIncluded: false,
    transportIncluded: false, // Changed to boolean
    makkahHotelImages: [],
    inclusions: [],
    departureDates: [""],
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
          madinahHotelImages: [],
        }),
    type,
  });

  const [newPackage, setNewPackage] = useState(
    getInitialPackageState(selectedTab)
  );

  if (!user) return <Navigate to="/admin-login" replace />;

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const collectionName =
        selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages";
      const querySnapshot = await getDocs(collection(db, collectionName));
      const packagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPackages(packagesData);
    } catch (error) {
      console.error(`Error fetching ${selectedTab} packages:`, error);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchPackages();
    setNewPackage(getInitialPackageState(selectedTab));
    setEditingPackageId(null);
  }, [selectedTab, fetchPackages]);

  // Handle file uploads
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return [];
    const fileArray = Array.from(files);
    return Promise.all(
      fileArray.map(async (file) => {
        const storageRef = ref(
          storage,
          `packages/${selectedTab}/${uuidv4()}-${file.name}`
        );
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      })
    );
  };

  // Add or Update package
  const addOrUpdatePackage = async () => {
    if (!newPackage.name || !newPackage.price) return;
    setLoading(true);

    try {
      const packageData = {
        ...newPackage,
        makkahHotelImages:
          newPackage.makkahHotelImages instanceof FileList ||
          Array.isArray(newPackage.makkahHotelImages)
            ? await handleFileUpload(newPackage.makkahHotelImages)
            : newPackage.makkahHotelImages,
        ...(selectedTab === "Umrah" && {
          madinahHotelImages:
            newPackage.madinahHotelImages instanceof FileList ||
            Array.isArray(newPackage.madinahHotelImages)
              ? await handleFileUpload(newPackage.madinahHotelImages)
              : newPackage.madinahHotelImages,
        }),
        createdAt: new Date().toISOString(),
        price: Number(newPackage.price) || 0,
        duration: Number(newPackage.duration) || 0,
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
    } finally {
      setLoading(false);
    }
  };

  // Delete package
  const deletePackage = async (id) => {
    try {
      const collectionName =
        selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages";
      await deleteDoc(doc(db, collectionName, id));
      await fetchPackages();
    } catch (error) {
      console.error(`Error deleting ${selectedTab} package:`, error);
    }
  };

  // Edit package
  const editPackage = (pkg) => {
    setNewPackage({
      ...pkg,
      makkahHotelImages: pkg.makkahHotelImages || [],
      ...(selectedTab === "Umrah" && {
        madinahHotelImages: pkg.madinahHotelImages || [],
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

        {/* Package Form */}
        <div className="mt-8 p-6 bg-gray-100 shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {editingPackageId ? "Edit" : "Add"} {selectedTab} Package
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(newPackage)
              .filter(
                ([key]) =>
                  ![
                    "makkahHotelImages",
                    "madinahHotelImages",
                    "type",
                    "createdAt",
                    "inclusions",
                    "departureDates",
                  ].includes(key)
              )
              .map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  {key === "visaIncluded" || key === "transportIncluded" ? (
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4"
                    />
                  ) : (
                    <input
                      type={
                        key.includes("days") ||
                        key.includes("price") ||
                        key.includes("duration")
                          ? "number"
                          : key.includes("distance")
                          ? "text" // Keep distance as text to allow "m" suffix
                          : "text"
                      }
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Makkah Hotel Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    makkahHotelImages: e.target.files,
                  })
                }
                className="border p-2 rounded mt-1"
              />
            </div>
            {selectedTab === "Umrah" && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Madinah Hotel Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setNewPackage({
                      ...newPackage,
                      madinahHotelImages: e.target.files,
                    })
                  }
                  className="border p-2 rounded mt-1"
                />
              </div>
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
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-white shadow rounded-lg">
                  <h4 className="font-bold text-lg text-gray-800">
                    {pkg.name}
                  </h4>
                  <p className="text-gray-600">
                    Price: {pkg.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600">Duration: {pkg.duration} days</p>
                  <p className="text-gray-600">
                    Distance Makkah: {pkg.distanceMakkah}
                  </p>
                  {selectedTab === "Hajj" ? (
                    <>
                      <p className="text-gray-600">Camp Type: {pkg.campType}</p>
                      <p className="text-gray-600">Mina Days: {pkg.minaDays}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        Makkah Days: {pkg.daysInMakkah}
                      </p>
                      <p className="text-gray-600">
                        Madinah Days: {pkg.daysInMadinah}
                      </p>
                      <p className="text-gray-600">
                        Distance Madinah: {pkg.distanceMadinah}
                      </p>
                    </>
                  )}
                  <p className="text-gray-600">
                    Transport:{" "}
                    {pkg.transportIncluded ? "Included" : "Not Included"}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

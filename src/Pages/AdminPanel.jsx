import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    duration: "",
    daysInMakkah: "",
    daysInMadinah: "",
    hotelInMakkah: "",
    hotelInMadinah: "",
    distanceMakkah: "",
    distanceMadinah: "",
    roomType: "",
    makkahHotelLocation: "",
    madinahHotelLocation: "",
    makkahHotelImages: [],
    madinahHotelImages: [],
  });

  if (!user) return <Navigate to="/admin-login" replace />;

  useEffect(() => {
    fetchPackages();
  }, [selectedTab]);

  const fetchPackages = async () => {
    const querySnapshot = await getDocs(
      collection(db, selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages")
    );
    const packagesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPackages(packagesData);
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return [];
    const fileArray = Array.from(files);
    return await Promise.all(
      fileArray.map(async (file) => {
        const storageRef = ref(storage, `packages/${uuidv4()}-${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      })
    );
  };

  const addOrUpdatePackage = async () => {
    if (!newPackage.name || !newPackage.price) return;
    setLoading(true);

    try {
      const makkahImages = await handleFileUpload(newPackage.makkahHotelImages);
      const madinahImages = await handleFileUpload(
        newPackage.madinahHotelImages
      );

      const packageData = {
        ...newPackage,
        makkahHotelImages:
          makkahImages.length > 0 ? makkahImages : newPackage.makkahHotelImages,
        madinahHotelImages:
          madinahImages.length > 0
            ? madinahImages
            : newPackage.madinahHotelImages,
      };

      const packageCollection = collection(
        db,
        selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages"
      );

      if (editingPackageId) {
        await updateDoc(
          doc(db, packageCollection.path, editingPackageId),
          packageData
        );
        setEditingPackageId(null);
      } else {
        await addDoc(packageCollection, packageData);
      }

      setNewPackage({
        name: "",
        price: "",
        duration: "",
        daysInMakkah: "",
        daysInMadinah: "",
        hotelInMakkah: "",
        hotelInMadinah: "",
        distanceMakkah: "",
        distanceMadinah: "",
        roomType: "",
        makkahHotelLocation: "",
        madinahHotelLocation: "",
        makkahHotelImages: [],
        madinahHotelImages: [],
      });

      fetchPackages();
    } catch (error) {
      console.error("Error adding package:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id) => {
    await deleteDoc(
      doc(db, selectedTab === "Hajj" ? "hajjPackages" : "umrahPackages", id)
    );
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const editPackage = (pkg) => {
    setNewPackage(pkg);
    setEditingPackageId(pkg.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center space-x-4 mb-6">
          {["Hajj", "Umrah"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedTab(type);
                setEditingPackageId(null);
              }}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                selectedTab === type
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {type} Packages
            </button>
          ))}
        </div>

        {/* Package Form */}
        <div className="mt-8 p-6 bg-gray-100 shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {editingPackageId ? "Edit" : "Add"} {selectedTab} Package
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(newPackage)
              .filter((key) => !key.includes("Images") && key !== "id")
              .map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                  className="border p-2 rounded"
                  value={newPackage[key]}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, [key]: e.target.value })
                  }
                />
              ))}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setNewPackage({
                  ...newPackage,
                  makkahHotelImages: Array.from(e.target.files),
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setNewPackage({
                  ...newPackage,
                  madinahHotelImages: Array.from(e.target.files),
                })
              }
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={addOrUpdatePackage}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full transition"
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
          <h3 className="text-xl font-bold mb-4">Existing Packages</h3>
          <div className="grid grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-4 bg-white shadow rounded">
                <h4 className="font-bold">{pkg.name}</h4>
                <p className="text-gray-600">{pkg.price}</p>
                <button
                  onClick={() => editPackage(pkg)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePackage(pkg.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

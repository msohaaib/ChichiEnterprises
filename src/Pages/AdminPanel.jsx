import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Shawal 14 Days (Taiba Al Taiba)",
      price: 222830,
      hotel: "Taiba Al Taiba",
      location: "Madina",
      distance: "200m",
      sharing: "Quad",
      mapLink:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.901878382714!2d39.6142!3d24.4674",
    },
  ]);

  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    hotel: "",
    location: "",
    distance: "",
    sharing: "",
    mapLink: "",
  });

  const addPackage = () => {
    if (newPackage.name && newPackage.price) {
      setPackages([...packages, { id: Date.now(), ...newPackage }]);
      setNewPackage({
        name: "",
        price: "",
        hotel: "",
        location: "",
        distance: "",
        sharing: "",
        mapLink: "",
      });
    }
  };

  const deletePackage = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
      >
        Logout
      </button>

      {/* Package List */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Umrah Packages</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Hotel</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Distance</th>
              <th className="border px-4 py-2">Sharing</th>
              <th className="border px-4 py-2">Map</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="text-center">
                <td className="border px-4 py-2">{pkg.name}</td>
                <td className="border px-4 py-2">{pkg.price}</td>
                <td className="border px-4 py-2">{pkg.hotel}</td>
                <td className="border px-4 py-2">{pkg.location}</td>
                <td className="border px-4 py-2">{pkg.distance}</td>
                <td className="border px-4 py-2">{pkg.sharing}</td>
                <td className="border px-4 py-2">
                  {pkg.mapLink ? (
                    <a
                      href={pkg.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Map
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => deletePackage(pkg.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Package Form */}
      <div className="mt-6 w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Add New Package</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Package Name"
            className="border p-2 rounded"
            value={newPackage.name}
            onChange={(e) =>
              setNewPackage({ ...newPackage, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            value={newPackage.price}
            onChange={(e) =>
              setNewPackage({ ...newPackage, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Hotel Name"
            className="border p-2 rounded"
            value={newPackage.hotel}
            onChange={(e) =>
              setNewPackage({ ...newPackage, hotel: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-2 rounded"
            value={newPackage.location}
            onChange={(e) =>
              setNewPackage({ ...newPackage, location: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Distance"
            className="border p-2 rounded"
            value={newPackage.distance}
            onChange={(e) =>
              setNewPackage({ ...newPackage, distance: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Sharing Type"
            className="border p-2 rounded"
            value={newPackage.sharing}
            onChange={(e) =>
              setNewPackage({ ...newPackage, sharing: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Google Maps Embed URL"
            className="border p-2 rounded col-span-2"
            value={newPackage.mapLink}
            onChange={(e) =>
              setNewPackage({ ...newPackage, mapLink: e.target.value })
            }
          />
        </div>
        <button
          onClick={addPackage}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Add Package
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

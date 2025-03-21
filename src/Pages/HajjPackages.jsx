import { Link } from "react-router-dom";

const packages = [
  {
    id: 1,
    name: "Shawal 14 Days (Taiba Al Taiba)",
    price: 222830,
    distance: "200m from Haram",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    name: "Shawal 20 Days (Pullman Zamzam)",
    price: 245500,
    distance: "150m from Haram",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    name: "Eid 14 Days (Hilton Makkah)",
    price: 259900,
    distance: "100m from Haram",
    image: "https://via.placeholder.com/300",
  },
];

const HajjPackages = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Umrah Packages
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-lg p-4 transform transition duration-300 hover:scale-105"
          >
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold mt-3 text-gray-700">
              {pkg.name}
            </h3>
            <p className="text-gray-600 text-sm">💰 Price: {pkg.price} PKR</p>
            <p className="text-gray-600 text-sm">📍 {pkg.distance}</p>
            <Link
              to={`/hajjDetail/${pkg.id}`}
              className="mt-3 block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HajjPackages;

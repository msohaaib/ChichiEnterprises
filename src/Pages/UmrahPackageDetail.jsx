import { useParams, useNavigate } from "react-router-dom";

const packages = [
  {
    id: 1,
    name: "Shawal 14 Days (Taiba Al Taiba)",
    price: 222830,
    distance: "200m from Haram",
    hotel: "Taiba Al Taiba",
    location: "Madina",
    sharing: "Quad",
    mapLink: "https://www.google.com/maps?q=Madina",
    image: "https://via.placeholder.com/500",
  },
  {
    id: 2,
    name: "Shawal 20 Days (Pullman Zamzam)",
    price: 245500,
    distance: "150m from Haram",
    hotel: "Pullman Zamzam",
    location: "Makkah",
    sharing: "Triple",
    mapLink: "https://www.google.com/maps?q=Makkah",
    image: "https://via.placeholder.com/500",
  },
];

const UmrahDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packages.find((p) => p.id === parseInt(id));

  if (!pkg) {
    return (
      <h2 className="text-center text-xl font-bold mt-10">Package Not Found</h2>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{pkg.name}</h2>
      <img
        src={pkg.image}
        alt={pkg.name}
        className="w-full max-w-2xl h-80 object-cover rounded-lg shadow-lg"
      />
      <div className="bg-white shadow-md p-6 rounded-lg mt-6 w-full max-w-2xl">
        <p className="text-lg text-gray-700">
          <strong>Price:</strong> {pkg.price} PKR
        </p>
        <p className="text-lg text-gray-700">
          <strong>Distance:</strong> {pkg.distance}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Hotel:</strong> {pkg.hotel}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Location:</strong> {pkg.location}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Sharing:</strong> {pkg.sharing}
        </p>
        <a
          href={pkg.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-blue-500 underline"
        >
          View Location on Google Maps
        </a>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
      >
        Back to Packages
      </button>
    </div>
  );
};

export default UmrahDetail;

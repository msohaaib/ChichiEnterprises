import { useParams } from "react-router-dom";
import { services } from "../data/data"; // Ensure you have service data

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = services.find((s) => s.id === parseInt(serviceId)); // Ensure correct data type

  if (!service) {
    return <h2 className="text-center text-red-500">Service Not Found</h2>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{service.title}</h1>
      <img
        src={service.image}
        alt={service.title}
        className="rounded-lg shadow-md"
      />
      <p className="text-gray-700 text-lg">{service.description}</p>
    </div>
  );
};

export default ServiceDetail;

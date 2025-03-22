import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const Detail = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "hajjPackages"); // or "umrahPackages"
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      setPackages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Packages</h1>
      <div className="grid grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white p-4 shadow-lg rounded">
            <h2 className="font-semibold text-lg">{pkg.name}</h2>
            <p>Price: ${pkg.price}</p>
            <p>Duration: {pkg.duration} days</p>
            <p>Makkah: {pkg.daysInMakkah} days</p>
            <p>Madinah: {pkg.daysInMadinah} days</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;

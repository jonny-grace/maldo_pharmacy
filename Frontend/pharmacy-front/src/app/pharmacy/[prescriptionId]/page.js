'use client';
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

function PrescriptionDetail() {
  const router = useRouter();
  const path = usePathname();
  const doctorIndex = path.indexOf("pharmacy/");
  const prescriptionId =
    doctorIndex !== -1 ? path.slice(doctorIndex + "pharmacy/".length) : "";

  const [prescription, setPrescription] = useState({});
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        if (prescriptionId) {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://127.0.0.1:3000/pharmacy/prescription/${prescriptionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          console.log(data);
          setPrescription(data);
          setMedicines(
            data.medicines.map((medicine) => ({
              ...medicine,
              price: "",
              availablity: false,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching prescription:", error);
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

  const handleConfirm = () => {
    const token = localStorage.getItem('token');

axios

    .post(`http://localhost:3000/pharmacy/response/${prescriptionId}`,  medicines, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the Authorization header
      }
    })
    .then((response) => {
      console.log(response.data);
      router.push("/pharmacy");
      // Handle the response data here
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors that occur during the request
    });
};

  const handlePrint = () => {
    console.log("Placing order for prescription:", prescriptionId);
    console.log("Medicines:", medicines);

    // Make API request to place the order
    axios
      .post(`http://localhost:3000/reception/response/${prescriptionId}`)
      .then((response) => {
        console.log(response.data);
        router.push("/pharmacy");
        // Handle the response data here
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors that occur during the request
      });
  };

  const PrintPrescription=()=>{
    router.push(`/print/${prescriptionId}`);
  }

  const handlePriceChange = (index, event) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].price = event.target.value;
    setMedicines(updatedMedicines);
  };

  const handleAvailablityChange = (index, event) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].availablity = !event.target.checked;
    setMedicines(updatedMedicines);
  };

  return (
    <div className="bg-white max-w-6xl mx-auto my-6 border border-black border-opacity-30 rounded shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Prescription</h2>
      <div className="flex flex-col md:flex-row gap-16">
        <div className="mb-6">
          <p className="font-bold">Patient Name:</p>
          <p>{prescription.patientFullName}</p>
        </div>
        <div className="mb-6">
          <p className="font-bold">Patient ID:</p>
          <p>{prescription.patientId}</p>
        </div>
        <div className="mb-6">
          <p className="font-bold">Patient Age:</p>
          <p>{prescription.patientAge}</p>
        </div>
      </div>
      <div className="mb-6">
        <p className="font-bold">Doctor Name:</p>
        <p>{prescription.doctorFullName}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">
          List of Medicines with Description
        </h3>
        <div className="flex justify-between mx-8">
          <h2 className="underline pb-3">Medicine Name</h2>
         <h2></h2>
         <h2 className="underline pb-3">Price</h2>
         
        </div>
        <div className="flex flex-col gap-4">
          {medicines.map((medicine, index) => (
            <div key={index} className="flex justify-between border-b-2 mx-8">
              <p className="font-bold text-left w-[250px]">{medicine.name}</p>
              <div className="">
              <input
                type="checkbox"
                
                checked={!medicine.availablity}
                onChange={(event) => handleAvailablityChange(index, event)}
              /><h2 className=" pb-3">not available</h2>
              </div>
             <div><input
                type="text"
                value={medicine.price}
                onChange={(event) => handlePriceChange(index, event)}
                disabled={medicine.availablity=== false}
                className="w-[150px] px-2 py-1 rounded border border-gray-300"
              /> </div> 
               
              
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleConfirm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
        >
          Confirm
        </button>
        {prescription.status === "assigned" && (
          <button
            onClick={PrintPrescription}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Print
          </button>
        )}
      </div>
    </div>
  );
}

export default PrescriptionDetail;
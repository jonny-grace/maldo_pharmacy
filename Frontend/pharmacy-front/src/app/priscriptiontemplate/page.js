"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

function PrescriptionDetail() {
  const router = useRouter();
  const path = usePathname();
  const doctorIndex = path.indexOf("reception/");
  const prescriptionId =
    doctorIndex !== -1 ? path.slice(doctorIndex + "reception/".length) : "";

  const [prescription, setPrescription] = useState({});

  const [medicines, setMedicines] = useState([
  ]);

  useEffect(() => {
    const fetchApointment = async () => {
      try {
        if (prescriptionId) {
          // Check if prescriptionId is available
          const response = await fetch(
            `http://127.0.0.1:3000/reception/prescription/${prescriptionId}`
          );
          const data = await response.json();
          setPrescription(data.prescription);
          setMedicines(data.medicines);
          
        }
      } catch (error) {
        console.error("Error fetching prescription:", error);
      }
    };

    fetchApointment();
  }, [prescriptionId]); 

  const handlePrint = () => {
    // Logic for printing the prescription
    router.push(`/reception/print/${prescriptionId}`);
  };

  const handleOrder = () => {
    console.log("Placing order for prescription:", prescriptionId);
  
    axios.get(`http://localhost:3000/reception/order/${prescriptionId}`)
      .then(response => {
        console.log(response.data);
        router.push('/reception')
        // Handle the response data here
      })
      .catch(error => {
        console.error(error);
        // Handle any errors that occur during the request
      });
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
        <div className=" flex justify-between mx-8 ">
          <h2 className=" underline pb-3">Medicine Name</h2>
          <h2 className=" underline pb-3">Medicine Description</h2>
          <h2 className=" underline pb-3">Medicine Price</h2>
        </div>
<div className=" flex flex-col gap-4">{medicines.map((medicine, index) => (
          <div key={index}>
            <div className=" flex justify-between border-b-2   mx-8">
              <p className="font-bold text-left  w-[250px]">{medicine.name}</p>

              <div className=" b w-[450px]">
                <p className=" text-left ">{medicine.description}</p>
              </div>
              <p className="">{medicine.price}</p>
             
            </div>
          </div>
        ))}</div>
        
      </div>
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
        >
          Print
        </button>
        {prescription.status == "assigned" && (
          <button
            onClick={handleOrder}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Order
          </button>
        )}
      </div>
    </div>
  );
}

export default PrescriptionDetail;

'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import moment from 'moment';

const PrescriptionCard = () => {
  const router = useRouter();
  const path = usePathname();

  const prescriptionIndex = path.indexOf('reception/print/');
  const prescriptionId =
    prescriptionIndex !== -1 ? path.slice(prescriptionIndex + 'reception/print/'.length) : '';

  const [prescription, setPrescription] = useState({});
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        if (prescriptionId) {
          const response = await fetch(`http://127.0.0.1:3000/reception/prescription/${prescriptionId}`);
          const data = await response.json();
          console.log(data.prescription);
          setPrescription(data.prescription);
          setMedicines(data.medicines);
        }
      } catch (error) {
        console.error('Error fetching prescription:', error);
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

  console.log('prescription', prescription);
  console.log('medicines', medicines);

  const handlePrint = async () => {
    try {
      // Make the API request to update the prescription status
      if (prescriptionId) {
       const response= await axios.put(`http://127.0.0.1:3000/reception/prescription/${prescriptionId}`, {
          status: 'completed',
        });
        console.log(response.data);
      }
  
      // Print the page
      
      
      // window.print();
    } catch (error) {
      console.error('Error updating prescription status:', error);
    }
  };

  const currentDate = moment().format('MMMM D, YYYY');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm">{currentDate}</p>
      </div>

      <div className="mb-4">
        <p>
          Patient Name: <u>{prescription.patientFullName}</u>
        </p>
        <p>
          Patient Age: <u>{prescription.patientAge}</u>
        </p>
        <p>
          Patient ID: <u>{prescription.patiendId}</u>
        </p>
      </div>

      <p className="text-center font-bold mb-4">List of Medicines</p>

      <table className="w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Medicine Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{medicine.name}</td>
              <td className="border px-4 py-2">{medicine.description}</td>
              {medicine.price === null ? (
                <td>not available</td>
              ) : (
                <td className="border px-4 py-2">{medicine.price}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-5">
        <p>
          Doctor Name: <u>Dr. John Doe</u>
        </p>
        <p>
          speciality: <u>Radiologist</u>
        </p>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 print:hidden"
        onClick={handlePrint}
      >
        Print
      </button>
    </div>
  );
};

export default PrescriptionCard;
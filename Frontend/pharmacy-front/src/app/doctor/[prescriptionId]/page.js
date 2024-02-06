"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const PatientRegistration = () => {
    const router=useRouter()
  const path = usePathname();
  const doctorIndex = path.indexOf("doctor/");
  const apointmentId =
    doctorIndex !== -1 ? path.slice(doctorIndex + "doctor/".length) : "";
    
    const [medicines, setMedicines] = useState([{ name: '', description: '' }]); 

     const [apointment, setApointment] = useState({});
  const [patient, setPatient] = useState({});

  useEffect(() => {
    const fetchApointment = async () => {
      try {
        if (apointmentId) {
          // Check if prescriptionId is available
          const response = await fetch(
            `http://127.0.0.1:3000/doctor/appointment/${apointmentId}`
          );
          const data = await response.json();
          setApointment(data);
        //   console.log("data", data);

          if (data.patient) {
            // Check if patient data is available
            setPatient(data.patient);
          }
        }
      } catch (error) {
        console.error("Error fetching prescription:", error);
      }
    };

    fetchApointment();
  }, [apointmentId]); // Include prescriptionId in the dependency array

  const handleMedicineChange = (index, name) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].name = name;
    setMedicines(updatedMedicines);
  };
  const handleDescriptionChange = (index, description) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].description = description;
    setMedicines(updatedMedicines);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', description: '' }]);
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    const prescriptionData = {
      patientId: patient.patientId,
      pfirstname: patient.firstname,
      plastname: patient.lastname,
      dfirstname:  apointment.doctor.firstname,
      dlastname: apointment.doctor.lastname,
      patientAge: patient.age,
      medicines: medicines,
      apointmentId: apointmentId
    };
    // console.log('medicine with description', prescriptionData);

    try {
      const response = await axios.post('http://localhost:3000/doctor/create/prescription', prescriptionData);
      console.log('Prescription created:', response.data);

     if (response.status === 200) {
    router.push('/doctor');
  } else {
    console.error('Error creating prescription:', response.data);
  }
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

 
  return (
    <div className="flex mx-auto max-w-4xl  pb-12">
      <div className="p-4  w-full mt-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold underline">Patient Name: {patient.firstname} {patient.lastname}</h2>
          <h2 className=" underline">Patient Number: {patient.patientId}</h2>
          <h2 className=" underline">Age: {patient.age}</h2>
        </div>

<div className=" mt-16">
    <h2 className="text-lg font-bold underline">
        Add Medicines 
    </h2>
</div>
<div className="mt-10 flex flex-col mx-auto">
        <form   onSubmit={handleSubmit}>
        {medicines.map((medicine, index) => (
  <div key={index} className="mb-4">
    <input
      type="text"
      className="p-2 border border-gray-300 rounded"
      placeholder="Medicine Name"
      value={medicine.name}
      onChange={(e) => handleMedicineChange(index, e.target.value)}
    />
    <input
      type="text"
      className="p-2 border border-gray-300 rounded"
      placeholder="Medicine Description"
      value={medicine.description}
      onChange={(e) => handleDescriptionChange(index, e.target.value)}
    />
  </div>
))}

          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAddMedicine}
          >
            Add More Medicine
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded ml-4"
          >
            Submit Prescription
          </button>
        </form></div>
      </div>
    </div>
  );
};

export default PatientRegistration;

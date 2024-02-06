'use client';
import React, { useState } from 'react';

const GeneratePrescription = () => {
  const [medicines, setMedicines] = useState(['']);

  const handleMedicineChange = (index, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index] = value;
    setMedicines(updatedMedicines);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('List of Medicines:', medicines);
  };

  // Generate random patient data
  const patientName = 'John Doe';
  const patientId = '123456';
  const patientAge = '30';

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">{patientName}</h2>
        <h2>Patient ID: {patientId}</h2>
        <h2>Age: {patientAge}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {medicines.map((medicine, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              className="p-2 border border-gray-300 rounded"
              placeholder="Medicine Name"
              value={medicine}
              onChange={(e) => handleMedicineChange(index, e.target.value)}
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
          className="px-4 py-2 bg-green-500  text-white rounded ml-4"
        >
          Submit Prescription
        </button>
      </form>
    </div>
  );
};

export default GeneratePrescription;
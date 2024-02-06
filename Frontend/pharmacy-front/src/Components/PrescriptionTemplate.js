'use client';
import React from 'react';
import moment from 'moment';
import Image from 'next/image';

const PrescriptionCard = () => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = moment().format('MMMM D, YYYY');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <Image src="/assets/logo-black.png" alt="Logo" className="w-16 h-16" />
        <div className="text-center">
          <h2 className="text-lg font-bold">Company Name</h2>
          <p className="text-sm">{currentDate}</p>
        </div>
      </div>

      <div className="mb-4">
        <p>
          Patient Name: <u>John Doe</u>
        </p>
        <p>
          Patient Age: <u>30</u>
        </p>
        <p>Patient ID: 123456</p>
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
          <tr>
            <td className="border px-4 py-2">Medicine 1</td>
            <td className="border px-4 py-2">Description 1</td>
            <td className="border px-4 py-2">$10.00</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Medicine 2</td>
            <td className="border px-4 py-2">Description 2</td>
            <td className="border px-4 py-2">$15.00</td>
          </tr>
        </tbody>
      </table>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handlePrint}
      >
        Print
      </button>
    </div>
  );
};

export default PrescriptionCard;
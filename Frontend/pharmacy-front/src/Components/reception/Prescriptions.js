
import React, { useState } from 'react';

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([
      {
        PID: 1,
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        age: 30,
        pharmacy: 'ABC Pharmacy',
        status: 'Pending',
      },
      {
        PID: 2,
        patientName: 'Jane Smith',
        doctorName: 'Dr. Johnson',
        age: 45,
        pharmacy: 'XYZ Pharmacy',
        status: 'Completed',
      },
      // Add more prescription objects here
    ]);

    const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }; 

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    `${prescription.patientName} ${prescription.doctorName} ${prescription.PID} ${prescription.pharmacy}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
    const handlePrint = (prescription) => {
      // Logic to print prescription
    };
  
    const handleOrder = (prescription) => {
      // Logic to order prescription
    };
  
    return (<>
    <div className=' my-4 content-end flex justify-between' >
        <div></div>
    <input type="text" className="w-72 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
    placeholder="Search prescriptions..."
    value={searchTerm}
    onChange={handleSearch} />
</div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              PID
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Doctor Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Pharmacy
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {filteredPrescriptions.map((prescription) => (
            <tr key={prescription.PID}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.PID}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.patientName}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.doctorName}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.age}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.pharmacy}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.status}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handlePrint(prescription)}
                >
                  Print
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleOrder(prescription)}
                >
                  Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
    );
  };
  
  export default Prescriptions;
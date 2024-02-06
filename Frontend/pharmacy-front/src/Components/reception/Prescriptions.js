'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const Prescriptions = () => {
  const router = useRouter();
    const [prescriptions, setPrescriptions] = useState([
      
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      const fetchPatients = async () => {
        try {
          const response = await fetch('http://127.0.0.1:3000/reception/prescriptions');
          const data = await response.json();
         
          console.log(data);
          setPrescriptions(data)
          // Log the fetched data
        } catch (error) {
          console.error('Error fetching patients:', error);
        }
      };
  
      fetchPatients();
    }, []);
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }; 

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    `${prescription.patientName} ${prescription.doctorName} ${prescription.PID} ${prescription.pharmacy}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
    const manangeViewDetail = (prescriptionId) => {
      router.push(`/reception/${prescriptionId}`);
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
          {filteredPrescriptions.map((prescription,index) => (
            <tr key={index}>
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
              
              <td className={`${prescription.status==='assigned' ? "text-blue-400":prescription.status==="waiting"?"text-gray-600":prescription.status==="completed"?"text-green-600":"text-black"}   px-6 py-4 whitespace-no-wrap border-b border-gray-500`}>
                
                {prescription.status}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => manangeViewDetail(prescription.prescriptionId)}
                >
                  View Detail
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
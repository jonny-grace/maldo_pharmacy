'use client';
import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css';

const ManagePatients = () => {
  const router = useRouter();
const [prescriptions,setPrescriptions]=useState([]);
const [appointments,setAppointments]=useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token'); 
        // Get the token from localStorage
        const response = await fetch('http://127.0.0.1:3000/pharmacy/prescriptions', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        const data = await response.json();
           
           setPrescriptions(data);
          
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
  
    fetchPrescriptions();
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    `${prescription.patientFullName} ${prescription.doctorFullName} ${prescription.age} `
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

const viewPrescriptionDetail = async (prescriptionId) => {
  router.push(
         `/pharmacy/${prescriptionId}`,
        );
    }


const createAppointment = async (apointment) => {
  
  const doctor = doctors.find(
    (doctor) => `${doctor.firstname} ${doctor.lastname}` === doctorFullName
  );

  const url = 'http://127.0.0.1:3000/reception/create/appointment';
  const data = {
    PID: patientId,
    doctorId: doctor.userId
  };
  console.log(data)
  try {
    const response = await axios.post(url, data);
    // Handle success
    // console.log('Appointment created successfully');
    
    if(response.data.message==='successfully appointed'){
        // setHasApointment(true);
        console.log('Appointment created successfully',response.data.doctor);
    }
  } catch (error) {
    // Handle errors
    console.error('Error creating appointment:', error);
  }

  setShowAppointmentModal(false);
};

const handlePrint = (prescriptionId) => {
  // Logic for printing the prescription
  router.push(`print/${prescriptionId}`);
};

  
  return (
    <div>
      <div className="flex justify-between mb-4 ">
      
        
        <div></div>
        <div >
    <input type="text" className="w-72 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
    placeholder="Search patients..."
    value={searchTerm}
    onChange={handleSearch} />
</div>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Doctor Name
            </th>
           
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Patient Age
            </th>
            {/* <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th> */}
           
          </tr>
        </thead>
        <tbody>
          {prescriptions.length<=0&&<tr><td>No appointment found</td></tr>}
          {filteredPrescriptions.map((prescription,index) => (
            
            <tr key={index}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.patientFullName}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.doctorFullName} 
              </td>
             
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {prescription.age}
              </td>
              
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                
                {prescription.status!== 'completed' ?
                  <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => viewPrescriptionDetail(prescription.prescriptionId)}
                >
                 View Detail
                </button>
                :
                <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => handlePrint(prescription.prescriptionId)}
              >
               print
              </button>
                }
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default ManagePatients;
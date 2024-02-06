'use client';
import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css';

const ManagePatients = () => {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
const [selectedDoctor,setSelectedDoctor]=useState('');;
const [appointments,setAppointments]=useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token'); 
        // Get the token from localStorage
        const response = await fetch('http://127.0.0.1:3000/doctor/appointments', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        const data = await response.json();
           
           setAppointments(data);
           
        // setPatients(patients);
        
        // Log the fetched data
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
  
    fetchPatients();
  }, []);

   
  console.log(appointments);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstname} ${patient.lastname} ${patient.PID} `
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  //Create an apointment 

const openCreatePrescription = async (appointment) => {
  router.push(
         `/doctor/${appointment.apointmentId}`,
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
  

  const handleSelectDoctor = (event) => {
    setSelectedDoctor(event.target.value);
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
              PID
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              FullName
            </th>
           
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.length<=0&&<tr><td>No appointment found</td></tr>}
          {appointments.map((apointment) => (
            
            <tr key={apointment.patient.patientId}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {apointment.patient.patientId}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {apointment.patient.firstname} {apointment.patient.lastname}
              </td>
             
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {apointment.patient.age}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {apointment.patient.address}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => openCreatePrescription(apointment)}
                >
                  Create Prescriptions
                </button>
                
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default ManagePatients;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
const [selectedDoctor,setSelectedDoctor]=useState('');;

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/reception/patients');
        const data = await response.json();
       
        console.log(data);
        setPatients(data.patients)
        // Log the fetched data
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/reception/doctors');
        const data = await response.json();
      
        setDoctors(data); // Update with an array of doctors
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
  
    fetchDoctors();
  }, []);



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstname} ${patient.lastname} ${patient.PID} `
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  //Create an apointment 


const createAppointment = async (patientId, doctorFullName) => {
  const doctor = doctors.find(
    (doctor) => `${doctor.firstname} ${doctor.lastname}` === doctorFullName
  );

  const url = 'http://127.0.0.1:3000/reception/create/appointment';
  const data = {
    PID: patientId,
    doctorId: doctor._id
  };

  console.log('details',data)
  try {
    const response = await axios.post(url, data);
    // Handle success
    // console.log('Appointment created successfully');
    if(response.data===false){
        console.log('Response:', 'Appointment already exists',response.data.activeAppointment);
    }else if(response.data.message==='successfully appointed'){
        // setHasApointment(true);
        toast.success('Appointment created successfully');
    }
  } catch (error) {
    // Handle errors
    console.error('Error creating appointment:', error);
  }

  setShowAppointmentModal(false);
};
  const openModalCreateAppointment = (patient) => {
    setSelectedPatient(patient);
    setShowAppointmentModal(true);
  };

  const handleEditPatient = (patient) => {
    // Logic to edit patient details
  };

  const handleRegisterPatient = () => {
    // Logic to navigate to registration page
  };
  const handleSelectDoctor = (event) => {
    setSelectedDoctor(event.target.value);
  };
 

  return (
    <div>
      <div className="flex justify-between mb-4">
      
        
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
          onClick={handleRegisterPatient}
        >
          Register Patient
        </button>
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
              First Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Last Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.patientId}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {patient.patientId}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {patient.firstname}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {patient.lastname}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {patient.age}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {patient.address}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleEditPatient(patient)}
                >
                  Edit
                </button>
                
                {!patient.hasAppointment &&
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => openModalCreateAppointment(patient)}
                >
                  Create Appointment
                </button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAppointmentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8">
  <h2 className="text-lg font-bold mb-4">
    Create Appointment for {selectedPatient?.firstname} {selectedPatient?.lastname}
  </h2>
  <select className="bg-gray-200 py-2 px-4 rounded" value={selectedDoctor}
        onChange={handleSelectDoctor}>
            <option></option>
    {doctors.map((doctor) => (
        
      <option key={doctor._id}>{doctor.firstname + " " + doctor.lastname}</option>
    ))}
  </select>
  <button
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
    onClick={() => {
      
        createAppointment(selectedPatient.patientId, selectedDoctor);
    }}
  >
    Create
  </button>
</div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
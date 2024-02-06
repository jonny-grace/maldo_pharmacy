'use client';
import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
const PatientRegistration = () => {
    const router = useRouter();
    const [patients, setPatients] = useState({
      firstname: "",
      lastname: "",
      phoneNumber: "",
      email: "",
      patientId: "",
      username: "",
      address: "",
      age: "",
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPatients((prevPatients) => ({
        ...prevPatients,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(patients);

      const token = localStorage.getItem('token');
      axios
  .post(`http://localhost:3000/reception/register/patient/`, patients, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    console.log(response.data);
    router.push("/reception");
    // Handle the response data here
  })
  .catch((error) => {
    console.error(error);
    // Handle any errors that occur during the request
  });

      // Perform further actions with the patients' data
    };
  
    return (
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-7xl bg-white">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-5">
            Patient Form
          </h2>
          <form className="flex flex-col w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input required
                type="text"
                name="firstname"
                id="firstname"
                value={patients.firstname}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input required
                type="text"
                name="lastname"
                id="lastname"
                value={patients.lastname}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input required
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={patients.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input required
                type="email"
                name="email"
                id="email"
                value={patients.email}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                 UserName
              </label>
              <input required
                type="text"
                name="username"
                id="username"
                value={patients.username}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input required
                type="text"
                name="address"
                id="address"
                value={patients.address}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input required
                type="number"
                name="age"
                id="age"
                value={patients.age}
                onChange={handleInputChange}
                className="mt-1 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default PatientRegistration;
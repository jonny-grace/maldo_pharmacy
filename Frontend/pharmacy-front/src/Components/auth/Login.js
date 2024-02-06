'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import withAuth from './withAuth';
function Login() {
const apiUrl=process.env.APIURL;

const router = useRouter();
const [username, setUsername] = useState('reception');
const [password, setPassword] = useState('reception@gmail.com');

const handleUsernameChange = (event) => {
  setUsername(event.target.value);
};

const handlePasswordChange = (event) => {
  setPassword(event.target.value);
};

const handleSubmit = (event) => {
    console.log(apiUrl);
    console.log(username,password);
    event.preventDefault();
    // Make API call to login endpoint with username and password
    fetch(`http://127.0.0.1:3000/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      // Handle login response
      console.log(data);

      // Store the token in localStorage
      localStorage.setItem('token', data.token);

      // Assign the role value to the 'role' variable
      const role = data.userData.role;
      localStorage.setItem('role', role);
      console.log('Role:', role);

      // Navigate based on the role
      if (role === 'reception') {
        router.push('/reception');
      } else if (role === 'pharmacy') {
        router.push('/pharmacy');
      } else if (role === 'doctor') {
        router.push('/doctor');
      }
    })
      .catch(error => {
        // Handle error
        console.error(error);
      });
  };
  return (
    <>
    <div className="py-8 w-full h-full">
        
    <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto  max-w-sm lg:max-w-7xl">
        <div className="hidden lg:block lg:w-1/2 bg-cover"
        style={{ backgroundImage: "url(../assets/maldo_login.png)" }} 
        >
        </div>
        <div className="w-full p-8 lg:w-1/2">
            {/* <h2 className="text-2xl font-semibold text-gray-700 text-center">Doctor</h2> */}
            <p className="text-xl text-gray-600 text-center">Welcome back!</p>
            <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <a href="#" className="text-xs text-center text-gray-500 uppercase">login Here</a>
                <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <form className="mt-8" onSubmit={handleSubmit}>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">username</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" />
            </div>
            <div className="mt-4">
                <div className="flex justify-between">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    {/* <a href="#" className="text-xs text-gray-500">Forget Password?</a> */}
                </div>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" />
            </div>
            <div className="mt-8">
                <button type='submit' className="bg-gray-700  text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">Login</button>
            </div>
            </form>
            
        </div>
    </div>
    </div>
        </>
  )
}

export default withAuth(Login)
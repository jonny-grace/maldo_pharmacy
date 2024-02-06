'use client';
import React, { useState } from 'react'
import Logo from './Logo'
import { useRouter } from 'next/navigation'



function TopBar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  const handleLogout = () => {
    // Clear token and role from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Update the logged-in status to false
    setIsLoggedIn(false);

    // Redirect to home page
    router.push('/');
  };

  useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const isLoggedIn = token && role;

    setIsLoggedIn(isLoggedIn);
  }, []);
  
  return (
    <div>
        <nav className="flex items-center px-5 bg-orange-300 md:px-8 lg:px-16 py-4 w-full bg-cover"
         style={{ backgroundImage: "url('../assets/pharma_banner.jpg')" }}>
  <div className="px-3 sm:px-5 xll:px-28  justify-between flex flex-col md:flex-row  py-3 w-full">
    {/* <div className="flex justify-between bg-gray-50 gap-x-3"> */}
      <Logo />
      <div className=' items-center gap-x-3 content-end md:mr-48'>
        <h3 className="text-white text-4xl font-bold">Maldo Epharma</h3>
        <p className="text-white text-xl">Your number one choice</p>
      </div>
      <div>

      {isLoggedIn && (
              <button onClick={handleLogout} className=' py-2 px-3 print:hidden'>Logout</button>
            )}
      </div>
    {/* </div> */}
  </div>
</nav>
    </div>
  )
}

export default TopBar
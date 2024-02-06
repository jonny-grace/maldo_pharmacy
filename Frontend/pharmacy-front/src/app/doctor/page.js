
import ManagePatients from '@/Components/doctor/ManagePatients'
import React from 'react'

function page() {
  return (
    <div>
        <h1>Doctor Dashboard</h1>
       <div className='mx-10 my-10 min-h-screen  '><ManagePatients/></div> 
    </div>
  )
}

export default page
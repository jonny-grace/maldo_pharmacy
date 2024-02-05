import React from 'react'

function Footer() {
  return (
    <div>
        <footer className=" bg-gray-300 flex justify-end border-none text-xl pr-24">
            maldo-e-pharma &copy; {new Date().getFullYear()}
            </footer>
    </div>
  )
}

export default Footer
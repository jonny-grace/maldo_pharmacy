import React from 'react'

function Footer() {
  return (
    <div>
        <footer className=" bg-gray-300 flex justify-end border-none text-xl px-5 print:hidden pr-24">
            maldo-e-pharma &copy; {new Date().getFullYear()}
            </footer>
    </div>
  )
}

export default Footer
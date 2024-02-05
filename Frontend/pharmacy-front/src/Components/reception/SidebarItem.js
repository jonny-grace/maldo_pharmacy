import React from 'react'

function SidebarItem({name, active, onClick}) {
    return (
      <li 
        onClick={onClick}
        className={`px-4 py-2 rounded cursor-pointer ${active ? 'bg-blue-500 text-white' : ''}`}
      >
        {name}
      </li>
    );
  }

export default SidebarItem
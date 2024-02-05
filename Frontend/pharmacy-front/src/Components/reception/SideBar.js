import React from 'react'
import SidebarItem from './SidebarItem';

function Sidebar({options, activeOption, onOptionClick}) {
    return (
      <div className="w-64 p-5 border-r bg-gray-100">
        <ul>
          {options.map(option => (
            <SidebarItem 
              key={option.name}
              name={option.name}
              active={option.name === activeOption}
              onClick={() => onOptionClick(option.name)} 
            />
          ))}
        </ul>
      </div>
    );
  }

export default Sidebar
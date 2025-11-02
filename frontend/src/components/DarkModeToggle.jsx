import React from 'react';
export default function DarkModeToggle({darkMode, setDarkMode}){
  return (
    <div className="fixed right-4 top-4 z-30">
      <button onClick={()=>setDarkMode(!darkMode)} className="p-2 bg-white dark:bg-gray-700 rounded shadow">{darkMode? 'Light' : 'Dark'}</button>
    </div>
  );
}

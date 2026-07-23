import React from 'react';
import Principalsgrid from "../../components/Principalsgrid";


export default function PrincipalOfficers() {
  return (
    <div className="pt-10 pb-24 min-h-screen  bg-black/5">
      <div className="container  text-center">

      
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Principal Officers</h1>
        <p className="text-gray-500 text-sm lg:pb-10 ">
          Page shell for METI Principal Officers. Custom content will be added by developer.
        </p>

        <div className='px-5'>
          <Principalsgrid />

        </div>

      </div>
    </div>
  );
}

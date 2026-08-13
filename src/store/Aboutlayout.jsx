import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'

export default function Aboutlayout() {
    
  return (
    <div>


       <ScrollToTop/>

       <div className='  hover:text-black ' >
       <p className=''></p>
     <Link to={'/'} className='text-black font-bold hover:text-uniport-blue absolute ml-5 mt-5 bg-white px-2 rounded-lg '>
        {"< "}
        Back
     
     </Link>
       </div>
       

        <Outlet/>
      
    </div>
  )
}

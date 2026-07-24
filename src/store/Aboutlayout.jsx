import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'

export default function Aboutlayout() {
    
  return (
    <div>

       <div className=' bg-white hover:text-blue-600 hover:text-black ' >
       <p className='h-5'></p>
     <Link to={'/'} className='text-blue-500 hover:text-black  pt-5 ml-5 '>
        {"< "}
        Back
     
     </Link>
       </div>

       <ScrollToTop/>

       

        <Outlet/>
      
    </div>
  )
}

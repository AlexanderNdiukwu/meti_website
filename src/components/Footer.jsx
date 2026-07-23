import { ArrowBigLeft, LocateIcon, Mail, MapPin, MapPinPenIcon, PhoneCall, PhoneOff, PhoneOutgoingIcon, PinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">METI</h3>
          <p className="text-gray-400">
            Institute of Engineering, Technology and Innovation Management.
          </p>

          <div className='flex gap-6 items-center'>

           <div className='bg-white px-6 py-0.5  mt-2 animate-pulse text-center rounded-full text-black font-light hover:border hover:border-black hover:text-blue-700'>
            <Link to={'/signup'}>
              APPLY HERE
            </Link>
            </div>

            <ArrowBigLeft className='animate-ping'/>


          </div>

        </div>
        <div>
          <div className='flex gap-20'>
          <h4 className="font-semibold mb-4">Programs</h4>
           {/* <div className='bg-white px-6 py-0.5 h-7 rounded-full text-black font-light hover:border hover:border-black hover:text-blue-700'>
             APPLY HERE
            </div> */}

          </div>
          <ul className="space-y-2 text-gray-400">
            <div className='flex gap-20'>
            <li><Link to="/masters" className="hover:text-white transition ">Masters</Link></li>
            <Link >
           
            
            </Link>

            </div>
            <li><Link to="/phd" className="hover:text-white transition">PhD</Link></li>
            <li><Link to="/pgd" className="hover:text-white transition">PGD</Link></li>
          </ul>
        </div>

      


        <div>
          <h4 className="font-semibold mb-4 ">University</h4>
          <ul className=" text-gray-400">
            <li className='border-b w-14'>Address</li>

            <div className='flex gap-2 items-start'>
              <MapPin className='lg:size-14 size-12'/>

            <li className='lg:mt-4 mt-3 '>2nd Floor, ETF Gas Engineering Building, Faculty of Engineering, Abuja Park Campus,University of Port Harcourt, Rivers State, Nigeria

             
              
          </li>

            </div>
           
          </ul>
        </div>

          <div className=' '>
          <p>Fast links</p>

          <div className='text-blue-500 pt-5 '>
          <p>
          <Link to={'/faq'} className='hover:text-white '>Click to FAQs</Link>

          </p> 
          
            <p>
          <Link to={'/courses'} className='hover:text-white ' >Click to Courses </Link>

          </p>  
          
           <p>
          <Link to={'/about'} className='hover:text-white ' >Click to About Meti </Link>

          </p>

           <p>
          <Link to={'/lecturers'} className='hover:text-white ' >Click to lectures </Link>

          </p>

              <p>
          <Link to={'/about/duration'} className='hover:text-white ' >Click to program durations </Link>

          </p>

          </div>


       
        </div>


        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-gray-400">
            <li className='flex gap-2 items-center'><Mail className='size-4'/>
              meti@uniport.edu.ng</li>
            <li className='flex gap-2 item-center'> <PhoneCall className='size-4' />
              +234 816 468 3549</li>

               <li className='flex gap-2 item-center'> <PhoneOff className='size-4' />
              +234 805 3568220 (WhatsApp only)</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} METI - University of Port Harcourt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

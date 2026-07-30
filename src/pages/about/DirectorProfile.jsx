import { motion } from 'framer-motion';
import { Award, GraduationCap, ShieldCheck, BookOpen, Brain, Briefcase } from 'lucide-react';

export default function DirectorProfile() {
  return (
    <div className="pt-10 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 ">
        
        {/* Profile Card Header */}
        <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-md flex flex-col md:flex-row gap-8 items-center mb-8">
          
          {/* Image */}
          <div className="relative w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0 ">
            <img 
              src="/images/staff_of_meti7.jpeg" 
              alt="Dr. Akuro Big-Alabo" 
              className="w-full h-full object-cover"
            
            />
          </div>

          {/* Intro Text */}
          <div className="text-center md:text-left space-y-3">
            <span className="text-lg font-bold bg-blue-50 text-uniport-blue px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Institute Director Profile
            </span>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Dr. Akuro Big-Alabo</h1>
            <p className=" font-semibold text-[#1a4fa0]">
              Associate Professor of Mechanical Engineering & Director of METI
            </p>
            <p className="text-sm ">
              Former Head of Department of Mechanical Engineering (2020–2022) | Assistant Director of Intellectual Property and Technology Transfer Office (IPTTO), UNIPORT.
            </p>
          </div>
        </div>

        {/* Profile Details Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Bio and qualifications */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Biography */}
            <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Brain className="text-uniport-blue" size={20} />
                Biography
              </h3>
              <p className=" text-lg leading-relaxed">
                Dr. Akuro Big-Alabo is an Associate Professor of Mechanical Engineering at the University of Port Harcourt and currently serves as Director of the Institute of Engineering, Technology and Innovation Management (METI). He joined the University of Port Harcourt in 2008 and was promoted to Associate Professor in 2022.
              </p>
              <p className=" text-sm leading-relaxed">
                Dr. Big-Alabo has distinguished himself through academic excellence, research, and institutional leadership. His research specialization focuses on Applied Mechanics and Design, with extensive investigations into systems dynamics and innovation modeling.
              </p>
            </div>

            {/* Academic Qualifications */}
            <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-black border-b pb-2 flex items-center gap-2 ">
                <GraduationCap className="text-uniport-blue "  size={20} />
                Academic Qualifications & Fellowships
              </h3>
              <div className="relative border-l-2 border-gray-100 pl-4 space-y-6 text-sm ">
                <div className="relative">
                  <span className="absolute -left-5.5 top-2 size-2 rounded-full bg-uniport-blue" />
                  <span className="font-bold text-gray-900 text-lg block">Post-Doctoral Research Fellowship</span>
                  <span className=" block font-medium">University of Glasgow, United Kingdom</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-5.5 top-2 size-2 rounded-full bg-uniport-blue" />
                  <span className="font-bold text-gray-900 text-lg block">PhD Mechanical Engineering</span>
                  <span className=" block font-medium">University of Glasgow, United Kingdom</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-5.5 top-2 size-2 rounded-full bg-uniport-blue" />
                  <span className="font-bold text-gray-900 text-lg block">MSc Mechanical Engineering and Management ( Distinction)</span>
                  <span className="text-sm block font-medium">University of Glasgow, United Kingdom </span>
                </div>
                <div className="relative">
                  <span className="absolute -left-5.5 top-2 size-2 rounded-full bg-uniport-blue" />
                  <span className="font-bold text-gray-900 text-lg block">B.Eng  Mechanical Engineering (First Class Honours)</span>
                  <span className=" block font-medium">University of Port Harcourt, Rivers State, Nigeria </span>
                </div>
              </div>
            </div>

            {/* Publications */}
            <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <BookOpen className="text-uniport-blue" size={20} />
                Scholarly Publications
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Dr. Big-Alabo has published over <span className="font-bold text-gray-900">60 scholarly articles</span> in highly reputable local and international journals.
              </p>
              <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50 flex items-center justify-between text-xs">
                <span className="text-gray-500 text-lg font-semibold">Specialization Area:</span>
                <span className="font-extrabold text-lg  text-uniport-blue">Applied Mechanics & Structural Design</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Memberships, Leadership */}
          <div className="space-y-6">
            
            {/* Professional Memberships */}
            <div className="bg-white p-6 rounded-3xl border border-black/10 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <ShieldCheck className="text-uniport-blue" size={18} />
                Professional Memberships
              </h3>
              <ul className="space-y-3 text-lg text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#10b981]" />
                  <span>COREN Registered Engineer</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#10b981]" />
                  <span>Member, Nigerian Society of Engineers (MNSE)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#10b981]" />
                  <span>Member, International Association of Engineers (MIAENG), Hong Kong</span>
                </li>
              </ul>
            </div>

            {/* Leadership & Appointments */}
            <div className="bg-white p-6 rounded-3xl border border-black/10 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Briefcase className="text-uniport-blue" size={18} />
                Leadership Timeline
              </h3>
              <div className="space-y-3 text-lg text-gray-600">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-900 block leading-tight">Director</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">METI (Current)</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-900 block leading-tight">Head of Department</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mechanical Engineering (2020 - 2022)</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-900 block leading-tight">Assistant Director</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">IPTTO Office, UNIPORT</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

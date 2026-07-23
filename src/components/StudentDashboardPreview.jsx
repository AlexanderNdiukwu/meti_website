import { MonitorPlay, LayoutDashboard, Calendar, FileText } from 'lucide-react';

const StudentDashboardPreview = () => {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Student Dashboard Preview</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Our hybrid learning model is powered by a state-of-the-art student dashboard. Access your lectures, submit assignments, and interact with world-class facilitators from anywhere in the world.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                  <MonitorPlay className="w-6 h-6 text-uniport-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Live & Recorded Lectures</h4>
                  <p className="text-sm text-gray-500">Access high-quality video content anytime.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                  <FileText className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Assignment Management</h4>
                  <p className="text-sm text-gray-500">Easily track deadlines and submit projects.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Calendar className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Academic Calendar</h4>
                  <p className="text-sm text-gray-500">Stay up to date with schedules and events.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            {/* Minimalist Dashboard Mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4 space-y-4">
                  <div className="h-8 bg-gray-100 rounded"></div>
                  <div className="h-8 bg-blue-50 rounded border-l-4 border-uniport-blue"></div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
                <div className="w-full md:w-3/4 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-40 w-full bg-gray-100 rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-50 rounded-xl border border-gray-100"></div>
                    <div className="h-20 bg-gray-50 rounded-xl border border-gray-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default StudentDashboardPreview;

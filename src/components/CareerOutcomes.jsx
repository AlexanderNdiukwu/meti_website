import { Briefcase, Building2, TrendingUp } from 'lucide-react';

const CareerOutcomes = () => {
  return (
    <section className="py-20  border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Career Outcomes</h2>
          <p className=" text-xl max-w-2xl mx-auto">Our graduates are positioned for leadership roles across critical sectors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <Briefcase className="w-12 h-12 text-uniport-blue mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Executive Roles</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-uniport-blue rounded-full"></span> Chief Technology Officer (CTO)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-uniport-blue rounded-full"></span> Director of R&D</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-uniport-blue rounded-full"></span> Smart Manufacturing Director</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <Building2 className="w-12 h-12 text-indigo-500 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Management & Consulting</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Product Innovation Manager</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Technology Consultant</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Clean Tech Project Manager</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <TrendingUp className="w-12 h-12 text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Entrepreneurship</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Tech Startup Founder</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Venture Analyst</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Business Development Manager</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerOutcomes;

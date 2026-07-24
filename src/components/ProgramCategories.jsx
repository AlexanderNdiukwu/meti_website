import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Award } from 'lucide-react';

const ProgramCategories = () => {
  const categories = [
    {
      id: 'pgd',
      title: 'PGD Programs',
      desc: 'Foundational bridge for candidates from various backgrounds to enter technology management.',
      link: '/pgd',
      icon: <BookOpen className="w-10 h-10 text-cyan-600" />
    },
    {
      id: 'masters',
      title: 'MSc Programs',
      desc: 'Advanced technical acumen combined with strategic management skills. Full-time or Part-time available.',
      link: '/masters',
      icon: <GraduationCap className="w-10 h-10 text-blue-600" />
    },
    {
      id: 'phd',
      title: 'PhD Programs',
      desc: 'Deep, independent research solving complex technological and engineering management problems.',
      link: '/phd',
      icon: <Award className="w-10 h-10 text-indigo-600" />
    }
  ];

  return (
    <section className="py-20  border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Program Categories</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">Select the academic pathway that aligns with your career goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="mb-6 bg-gray-50 inline-block p-4 rounded-xl">
                {cat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{cat.title}</h3>
              <p className="text-gray-600 mb-8 grow">{cat.desc}</p>
              <Link to={cat.link} className="inline-flex items-center font-semibold text-uniport-blue hover:text-blue-800 transition-colors mt-auto">
                View details <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramCategories;

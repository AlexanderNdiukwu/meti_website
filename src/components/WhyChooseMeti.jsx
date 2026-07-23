import { CheckCircle2 } from 'lucide-react';

const WhyChooseMeti = () => {
  const reasons = [
    { title: "World-Class Facilitators", desc: "Learn from industry veterans and top academic minds." },
    { title: "Cutting-Edge Research", desc: "Engage in research that solves real-world technological challenges." },
    { title: "Industry Connections", desc: "Extensive networking opportunities with leading tech and engineering firms." },
    { title: "Modern Curriculum", desc: "Programs tailored to current labor market demands and Industry 4.0." },
    { title: "Flexible Learning", desc: "Hybrid delivery modes combining virtual and in-person experiences." },
    { title: "Career Acceleration", desc: "Equipping you to transition into senior management and executive roles." }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose METI Uniport?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover the advantages that make our Institute the premier choice for engineering and technology management.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow bg-gray-50/50">
              <CheckCircle2 className="w-8 h-8 text-uniport-blue flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{reason.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMeti;

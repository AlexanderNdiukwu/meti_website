import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);


  
  const faqs = [
    {
      question: "What are the admission requirements for the Master's (MSc) programmes?",
      answer: "Candidates must possess a bachelor's degree (B.Eng., B.Tech., or B.Sc.) in an Engineering discipline or Pure and Applied science disciplines with a minimum of Second Class Lower division. Candidates with a PGD from METI or related disciplines with a minimum CGPA of 3.5 (on a 5.0 scale) are also eligible."
    },
    {
      question: "What are the requirements for the PhD programmes?",
      answer: "Candidates are required to possess a Master's degree (M.Eng., M.Tech., or MSc.) in an Engineering discipline or Pure and Applied science disciplines, or hold a degree from any METI programme with a minimum CGPA of 3.5 on a 5.0 scale."
    },
      {
      question: "What are the requirements for the PGD programmes?",
      answer: "  Candidates shall possess a Higher National Diploma (HND) or a Third-Class Bachelor’s Degree (B.Eng, B.Tech, or B.Sc.) in an Engineering discipline or the Pure and Applied science from a recognised university."
    },
    {
      question: "How long does it take to complete the programmes?",
      answer: "For PGD and Masters: Full-time runs for 12 months, while Part-time runs for 24 months. For PhD: Full-time runs for 36 months, while Part-time runs for 48 months."
    },
    {
      question: "What is the mode of programme delivery?",
      answer: "The delivery mode is hybrid, combining both virtual and in-person lecture attendance, examinations, workshops, lab sessions, and industrial visits."
    },
    {
      question: "What are the graduation requirements?",
      answer: "To graduate, a student must achieve a compulsory pass in all prescribed courses (minimum 50% / C-Grade) and successfully defend their dissertation/thesis in line with the School of Graduate Studies requirements."
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">General Regulations and Academic Policies from the METI Brochure.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl overflow-hidden transition-all duration-200 ${openIndex === idx ? 'border-uniport-blue shadow-md bg-white' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
            >
              <button 
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              >
                <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-uniport-blue shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
                
              </button>
              
              {openIndex === idx && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

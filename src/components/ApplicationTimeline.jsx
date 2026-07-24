const ApplicationTimeline = () => {
  const steps = [
    { step: "01", title: "Submit Application", desc: "Complete the online application form and upload required documents (Transcripts,Degree Certification, ETC)." },
    { step: "02", title: "Screening & Review", desc: "Our admission board will thoroughly review your academic and professional background." },
    { step: "03", title: "Interview (If applicable)", desc: "Shortlisted candidates for PhD and selected Masters programs will be invited for an interview." },
    { step: "04", title: "Admission Offer", desc: "Successful candidates will receive an official offer letter ." },
    { step: "05", title: "Registration & Orientation", desc: "Accept your offer, complete registration, and attend the orientation session." }
  ];

  return (
    <section className="py-20 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Application Timeline</h2>
          <p className="text-xl ">Follow these simple steps to join our prestigious programs.</p>
        </div>

        <div className="space-y-8">
          {steps.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 items-start p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-uniport-blue transition-colors">
              <div className="text-4xl font-black text-gray-200">{item.step}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplicationTimeline;

import StaffGrid from './StaffGrid';

const Staff = () => {
  return (
    <section className="py-20  ">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Staff of METI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn from a distinguished faculty of industry veterans and leading academic researchers at the University of Port Harcourt.
          </p>
        </div>

        {/* Dynamic Reusable Staff Grid */}
        <StaffGrid />
        
        {/* <div className="mt-16 text-center">
          <a href="/lecturers" className="text-uniport-blue font-semibold hover:underline">
            View All Facilitators &rarr;
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Staff;

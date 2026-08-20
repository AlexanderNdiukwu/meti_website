import StaffGrid from './StaffGrid';

const Staff = () => {
  return (
    <section className="  ">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Staff of METI</h2>
          <p className="text-xl max-w-2xl mx-auto">
          Our dedicated team—supporting the mission, powering the operations.The people behind the excellence, efficiency, and seamless operations of METI.
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

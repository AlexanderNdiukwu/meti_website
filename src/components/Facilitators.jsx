import FacilitatorsGrid from './FacilitatorsGrid';


const Facilitators = () => {
  return (
    <section className="py-20  border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Our Facilitators</h2>
          <p className="text-gray-900 text-lg max-w-2xl mx-auto">
           We use the Triple Helix Model of teaching—bringing together academia, industry, and government to transform knowledge into innovation and real-world impact.
          </p>
        </div>

        {/* Dynamic Reusable Staff Grid */}
        <FacilitatorsGrid/>
        
        {/* <div className="mt-16 text-center">
          <a href="/lecturers" className="text-uniport-blue font-semibold hover:underline">
            View All Facilitators &rarr;
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Facilitators;

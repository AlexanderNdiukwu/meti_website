import AboutSection from '../components/AboutSection';
import WhyChooseMeti from '../components/WhyChooseMeti';
import Testimonials from '../components/Testimonials';
import StaffGrid from '../components/StaffGrid';
import Facilitators from '../components/Facilitators';

const About = () => {
  return (
    <div className="lg:pt-24 pt-14 pb-12 min-h-screen bg-black/5">
      <AboutSection />
      <Testimonials />
      <StaffGrid/>
      <Facilitators/>
      <WhyChooseMeti />
    </div>
  );
};

export default About;

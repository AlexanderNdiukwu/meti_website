import AboutSection from '../components/AboutSection';
import WhyChooseMeti from '../components/WhyChooseMeti';
import Testimonials from '../components/Testimonials';

const About = () => {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-black/5">
      <AboutSection />
      <Testimonials />
      <WhyChooseMeti />
    </div>
  );
};

export default About;

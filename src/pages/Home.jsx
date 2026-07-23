import Hero from '../components/Hero';
import WhyChooseMeti from '../components/WhyChooseMeti';
import ProgramCategories from '../components/ProgramCategories';
import CareerOutcomes from '../components/CareerOutcomes';
import ApplicationTimeline from '../components/ApplicationTimeline';
import StudentDashboardPreview from '../components/StudentDashboardPreview';
import CourseRecommender from '../components/CourseRecommender';
import Testimonials from '../components/Testimonials';
import Staff from '../components/Staff';
import CallToAction from '../components/CallToAction';
import Facilitators from '../components/Facilitators';
import ScrollVelocity from '../components/ScrollVelocity';

const Home = () => {
  return (
    <div className="w-full bg-black">
      {/* 1. Cinematic Hero Section with normal text and fixed overlay opacity */}
      <Hero />

      
      
      {/* Container for all other sections to scroll cleanly over the Hero */}
      <div className="relative z-20 bg-gray-50 lg:bg-gray-50/90">
        {/* 2. Why Choose METI Uniport? */}

        



        <CallToAction />

        <WhyChooseMeti />
        
        {/* 3. Program Categories */}
        <ProgramCategories />
        
        {/* 4. Career Outcomes */}
        <CareerOutcomes />
        
        {/* 5. Application Timeline */}
        <ApplicationTimeline />
        
        {/* 6. Student Dashboard Preview */}
        {/* <StudentDashboardPreview /> */}
        
        {/* 7. Find the Best Program for You */}
        <CourseRecommender />
        
        {/* 8. What Our Students Say */}
        <Testimonials />
        
        {/* 9. STAFF OF METI */}
        <Staff />

        <Facilitators/>
        
        {/* 10. Start Your Journey Today */}
        {/* <CallToAction /> */}
      </div>
    </div>
  );
};

export default Home;

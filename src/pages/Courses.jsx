import ProgramCategories from '../components/ProgramCategories';
import CourseRecommender from '../components/CourseRecommender';

const Courses = () => {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-white">
      <ProgramCategories />
      <CourseRecommender />
    </div>
  );
};

export default Courses;

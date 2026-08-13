import {
  GraduationCap,
  Lightbulb,
  Globe2,
  Rocket,
} from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    title: "Top-Tier Lecturers",
    description:
      "Learn from experienced academic and industry professionals.",
  },
  {
    icon: Lightbulb,
    title: "Innovation-Focused",
    description:
      "Explore technology, engineering and management for a changing world.",
  },
  {
    icon: Globe2,
    title: "Industry-Relevant",
    description:
      "Develop knowledge aligned with real-world challenges.",
  },
  {
    icon: Rocket,
    title: "Career-Focused",
    description:
      "Build expertise for leadership, innovation and professional growth.",
  },
];

const HeroHighlights = () => {
  return (
    <div className="relative z-30 w-full px-4 md:px-8 lg:px-12">

      <div className="max-w-full mx-auto   rounded-2xl md:rounded-xl py-2  overflow-hidden">

        <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4">

          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`
                  flex items-start gap-4 p-5 md:p-6
                  ${
                    index !== highlights.length - 1
                      ? " "
                      : ""
                  }
                `}
              >

                <div className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-blue-50 text-uniport-blue lg:flex hidden items-center  justify-center">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="font-bold lg:text-blue-600 text-white text-sm md:text-base">
                    {item.title}
                  </h3>

                  <p className="mt-1 hidden lg:block text-xs md:text-base text-white leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default HeroHighlights;
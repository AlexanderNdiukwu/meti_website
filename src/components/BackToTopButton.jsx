import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // npm i lucide-react

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth animation
    });
  };

  return (
    <>
      {isVisible && (

        <div>
        <button
          onClick={scrollToTop}
          className="fixed lg:bottom-20 bottom-14 px-2 lg:hidden  left-7   z-50 flex items-center justify-center rounded-full bg-blue-900 text-white shadow-lg transition-all duration-300 hover:bg-gray-800 hover:scale-110 active:scale-95"
          aria-label="Go to top"
        >
            <span className="py-1 px-6">
            Back to top

            </span>
          <ArrowUp className="h-6 w-6 animate-bounce" />
        </button>

          <button
          onClick={scrollToTop}
          className="fixed bottom-20 px-2 right-6 hidden   z-50 lg:flex items-center justify-center rounded-full bg-blue-900 text-white shadow-lg transition-all duration-300 hover:bg-gray-800 hover:scale-110 active:scale-95"
          aria-label="Go to top"
        >
            <span className="py-2 px-4">
            Back to top 

            </span>
          <ArrowUp className="h-6 w-6 animate-bounce" />
        </button>



        </div>
      )}
    </>
  );
}
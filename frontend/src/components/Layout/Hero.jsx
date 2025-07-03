import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import your images (you can also fetch from API or props)
import img1 from '../../assets/rabbit-hero.webp';
import img2 from '../../assets/mens-collection.webp';
import img3 from '../../assets/womens-collection.webp';

// Image array with alt text
const slides = [
  { 
    image: img1, 
    alt: 'Online learning platform showcasing various courses',
    title: 'Discover Your Path',
    subtitle: 'Explore thousands of courses from top instructors'
  },
  { 
    image: img2, 
    alt: 'Professional development and skill building',
    title: 'Learn & Grow',
    subtitle: 'Master new skills with expert guidance'
  },
  { 
    image: img3, 
    alt: 'Educational content and learning resources',
    title: 'Compare & Choose',
    subtitle: 'Find the perfect course for your goals'
  }
];

const Hero = () => {
  const swiperRef = useRef(null);

  const handleFindNow = () => {
    // Dispatch event to open search bar
    window.dispatchEvent(new Event("activateSearch"));
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[750px] overflow-hidden">
      {/* Background Image Slider */}
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        loop={true}
        modules={[Autoplay, Navigation, Pagination]}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 text-white w-10 h-10 sm:w-12 sm:h-12 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/40 transition-all duration-200 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={handleNextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 text-white w-10 h-10 sm:w-12 sm:h-12 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/40 transition-all duration-200 flex items-center justify-center"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Custom Pagination */}
      <div className="swiper-pagination !bottom-6"></div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6">
            Course{' '}
            <span className="text-blue-400">Comparator</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-200 max-w-2xl mx-auto">
            Choose the best course for your career. Compare prices, reviews, and features to make informed decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleFindNow}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              aria-label="Search for courses"
            >
              Find Your Course
            </button>
            
            <Link
              to="/competitive_exams"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40"
            >
              Explore Categories
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">1000+</div>
              <div className="text-xs sm:text-sm text-gray-300">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">50+</div>
              <div className="text-xs sm:text-sm text-gray-300">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">10K+</div>
              <div className="text-xs sm:text-sm text-gray-300">Students</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

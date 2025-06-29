import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Import your images (you can also fetch from API or props)
import img1 from '../../assets/rabbit-hero.webp';
import img2 from '../../assets/mens-collection.webp';
import img3 from '../../assets/womens-collection.webp';

// Image array
const images = [img1, img2, img3];

const Hero = () => {
  return (
    <>
    <section className="relative w-full h-[400px] md:h-[600px] lg:h-[750px] overflow-hidden mb-6 ">
      {/* Background Image Slider */}
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Navigation]}
        className="w-full h-full"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Fixed Overlay Content */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-8xl font-bold tracking-tighter uppercase mb-4">
            Course <br /> Comparator
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Choose the best course for you
          </p>
          <Link
            to="#"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg font-medium"
          >
            Find Now
          </Link>
        </div>
      </div>
      
      

    </section>
    <hr className="border-t border-gray-300 my-8" />

    </>
  );
};

export default Hero;

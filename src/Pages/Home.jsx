import Banner1 from "../assets/banner1.avif";
import { GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { cardData } from "../data/data";
import { cardsData } from "../data/data";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Welcome to Chichi Enterprises
              <br className="lg:inline-block" /> Your Trusted Travel Partner!
            </h1>
            <p className="mb-8 leading-relaxed">
              At CHICHI ENTERPRISES, we turn your travel dreams into reality.
              Whether you&apos;re planning a relaxing vacation, an adventurous
              getaway, or a business trip, we provide seamless and hassle-free
              travel solutions tailored to your needs.
            </p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Button
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src={Banner1}
            />
          </div>
        </div>
      </section>

      {/* Umrah Packages Section */}
      <section className="text-gray-600">
        <div className="container px-5 py-20 mx-auto">
          {/* Heading Section with Flexbox */}
          <div className="flex justify-between items-center mb-10 flex-col md:flex-row">
            {/* Left Side: Title & Description */}
            <div className="text-left mb-5 md:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                Umrah Packages
              </h1>
              <p className="text-base leading-relaxed text-gray-500 max-w-lg">
                Choose from a variety of amazing travel packages customized for
                you.
              </p>
            </div>

            {/* Right Side: Link to Umrah Package Page */}
            <Link
              to="/umrahPackages"
              className="text-indigo-500 font-medium hover:underline"
            >
              More Packages →
            </Link>
          </div>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cardData.map((card) => (
              <div key={card.id} className="p-6 bg-white shadow-lg rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 inline-flex items-center justify-center rounded-full">
                    <img src={card.imgSrc} alt={card.title} />
                  </div>
                  <h2 className="text-gray-900 text-lg font-medium mb-3">
                    {card.title}
                  </h2>
                  <p className="leading-relaxed text-base">
                    {card.description}
                  </p>
                  <a className="mt-3 text-indigo-500 inline-flex items-center cursor-pointer">
                    Learn More <GoArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Hajj Packages Section */}
      <section className="text-gray-600">
        <div className="container px-5 py-20 mx-auto">
          {/* Heading Section with Flexbox */}
          <div className="flex justify-between items-center mb-10 flex-col md:flex-row">
            {/* Left Side: Title & Description */}
            <div className="text-left mb-5 md:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                Hajj Packages
              </h1>
              <p className="text-base leading-relaxed text-gray-500 max-w-lg">
                Choose from a variety of amazing travel packages customized for
                you.
              </p>
            </div>

            {/* Right Side: Link to Umrah Package Page */}
            <Link
              to="/hajjPackages"
              className="text-indigo-500 font-medium hover:underline"
            >
              More Packages →
            </Link>
          </div>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cardData.map((card) => (
              <div key={card.id} className="p-6 bg-white shadow-lg rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 inline-flex items-center justify-center rounded-full">
                    <img src={card.imgSrc} alt={card.title} />
                  </div>
                  <h2 className="text-gray-900 text-lg font-medium mb-3">
                    {card.title}
                  </h2>
                  <p className="leading-relaxed text-base">
                    {card.description}
                  </p>
                  <a className="mt-3 text-indigo-500 inline-flex items-center cursor-pointer">
                    Learn More <GoArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="text-gray-600 font-serif  p-10 mb-10">
        <div className="container">
          <div className="flex justify-between ">
            <div className="text-center">
              <h1 className="sm:text-3xl md:text-5xl font-medium text-gray-900">
                What Our Awesome Customer Say
              </h1>
            </div>
            <div className=" p-7 ">
              <p className="border-l border-blue-600 pl-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                odio sed officiis quaerat inventore necessitatibus corporis
                dolorem iste non laborum!
              </p>
            </div>
          </div>

        
          <div className="zoom-in">
            <Slider {...sliderSettings}>
              {cardsData.map((card) => (
                <div className="my-6">
                  <div
                    key={card.id}
                    className="flex flex-col gap-4 py-8 px-6 mx-4 rounded-xl   bg-gray-100 shadow-lg  relative"
                  >
                    <div className="h-20 w-20 left-0 rounded-full text-indigo-500">
                        <img src={card.imgSrc} alt={card.name} />
                      </div>
                    <div className="flex justify-between">
                      <div className="">
                        <div className="mb-3">
                          <div className="w-full flex  gap-1">
                            <FaStar className="text-yellow-500" />
                            <FaStar className="text-yellow-500" />
                            <FaStar className="text-yellow-500" />
                            <FaStar className="text-yellow-500" />
                            <FaStar className="text-yellow-500" />
                          </div>
                        <h2 className="text-gray-900 text-lg title-font font-medium ">
                          {card.name}
                        </h2>
                        <p>{card.job}</p>
                        </div>
                        <p className="leading-relaxed text-base">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section> */}

      <section className="text-gray-600 font-serif p-10 mb-10">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="md:text-left ">
              <h1 className="p-4 text-3xl md:text-5xl font-medium text-gray-900 md:ml-8">
                <b>
                  What Our Awesome <br /> Customers Say
                </b>
              </h1>
            </div>
            <div className="p-7 md:w-1/3">
              <p className="border-l-4 border-blue-600 pl-4 italic text-gray-600">
                A long established fact that a reader will be distracted by
                readable content when looking at its layout.
              </p>
            </div>
          </div>

          {/* 🔹 Carousel Container */}
          <div className="mt-10">
            <Slider {...sliderSettings}>
              {cardsData.map((card) => (
                <div key={card.id} className="p-6">
                  <div className="bg-gray-100 shadow-lg rounded-xl p-8 flex relative items-center">
                    {/* Left Overflowing Image */}
                    <div className="absolute -left-8 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={card.imgSrc}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Right Content */}
                    <div className="ml-16">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-500" />
                        ))}
                      </div>
                      <h2 className="text-gray-900 text-lg font-medium mt-2">
                        {card.name}
                      </h2>
                      <p className="text-gray-500">{card.job}</p>
                      <p className="mt-2 text-gray-700">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

import Banner1 from "../assets/banner1.avif";
import { GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { cardData } from "../data/data";
import Detail from "../Components/detail";

const Home = () => {
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
      <Detail />

      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam,
        repudiandae provident animi expedita magni enim perferendis in est
        nostrum soluta.
      </p>
    </>
  );
};

export default Home;

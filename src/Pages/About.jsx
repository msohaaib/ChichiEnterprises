import { teamMembers } from "../data/data";
import About_Home from "../assets/services/About_Home.jpg";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 space-y-16">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
        <img
          src={About_Home}
          alt="About Us Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            About Chichi Enterprises
          </h1>
        </div>
      </div>

      {/* About Text */}
      <div className=" mx-auto space-y-6 text-gray-700 text-lg leading-relaxed">
        <p>
          Founded in 2007, Chichi Enterprises is a leading recruitment agency
          specializing in providing top-tier manpower to the Kingdom of Saudi
          Arabia (KSA). With over a decade of experience in the industry, we
          have earned a reputation for delivering reliable, skilled, and
          hardworking professionals to meet the growing demands of diverse
          sectors.
        </p>
        <p>
          Our agency is licensed under the name of our Managing Director,
          Muhammad Farooq, ensuring that we operate with transparency,
          professionalism, and compliance. We pride ourselves on our commitment
          to both our clients and workers, building long-term partnerships based
          on trust and mutual respect.
        </p>
        <p>
          At the helm of our company is Muhammad Karim, our CEO, whose visionary
          leadership and deep understanding of the manpower industry have been
          pivotal to our success. Our dedicated team also includes experienced
          professionals across various fields:
        </p>
      </div>

      {/* Team Section */}
      <div className="text-center space-y-12">
        <h2 className="text-3xl font-semibold text-gray-800">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center space-y-4"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-gray-600 text-base">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;

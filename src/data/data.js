import logo from "../assets/Logo.png";
import skillLabour from "../assets/services/SkilledLabor.jpeg";
import talentAcquisition from "../assets/services/talentAcquisition.jpeg";
import consulting from "../assets/services/consulting.webp";
import VisaProcess from "../assets/services/visaProcess.webp";
import License from "../assets/services/Liscense.png";

export const teamMembers = [
  { name: "Muhammad Karim", role: "CEO", image: logo },
  { name: "Muhammad Farooq", role: "Managing Director", image: logo },
  { name: "Muhammad Fayyaz", role: "Managing Partner", image: logo },
  { name: "Muhammad Hanif", role: "Sales Specialist", image: logo },
  { name: "Salman Ghaffer", role: "Finance Specialist", image: logo },
  { name: "Muhammad Sohaib", role: "Chief Technology Officer", image: logo },
  { name: "Muhammad Junaid", role: "Marketing Specialist", image: logo },
];

export const services = [
  {
    id: 1,
    title: "Skilled Labor Recruitment",
    description:
      "We provide workers for industries such as construction, manufacturing, hospitality, healthcare, and more.",
    image: skillLabour,
    path: "/serviceDetails",
  },
  {
    id: 2,
    title: "Talent Acquisition",
    description:
      "Our expert team is dedicated to sourcing and identifying top talent to meet the specific requirements of our clients. We ensure that every candidate we recommend is thoroughly vetted and qualified.",
    image: talentAcquisition,
    path: "/serviceDetails",
  },
  {
    id: 3,
    title: "Consulting Services",
    description:
      "We provide professional consultation services to employers and job seekers, offering valuable insights and guidance to help them make informed decisions.",
    image: consulting,
    path: "/serviceDetails",
  },
  {
    id: 4,
    title: "Visa Processing & Documentation",
    description:
      "With our vast knowledge of KSA regulations, we ensure smooth processing of all necessary visa and work permits.",
    image: VisaProcess,
    path: "/serviceDetails",
  },
  {
    id: 5,
    title: "License Verificaion",
    description:
      "We proudly display our genuine license, issued in 2007, to assure our clients and candidates of our credibility and reliability.",
    image: License,
    path: "/serviceDetails",
  },
];

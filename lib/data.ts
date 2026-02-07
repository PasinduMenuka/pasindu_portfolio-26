import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import corpcommentImg from "@/public/corpcomment.png";
import aimGame from "@/public/projects/aimGame.png";
import citreas from "@/public/projects/citreas_thum.svg";
import lifeLine from "@/public/projects/lifeLine_thum.png";
import mediCem from "@/public/projects/mediCem_thum.svg";
import myStartUp from "@/public/projects/myStartup_thum.svg";
import rcb from "@/public/projects/rcb_thum.png";
import rmtdevImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";

export const links = [
  {
    name: "Home",
    hash: "/#home",
  },
  {
    name: "About",
    hash: "/#about",
  },
  {
    name: "Projects",
    hash: "/#projects",
  },
  {
    name: "Skills",
    hash: "/#skills",
  },
  {
    name: "Experience",
    hash: "/#experience",
  },
  {
    name: "Contact",
    hash: "/#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Senior UI/UX Engineer",
    location: "Save Energy System Inc",
    description:
      "Served as UI/UX Team Lead, guiding designers and engineers through strategy, execution, and best practices. Led the end-to-end redesign of a real-time HVAC IoT dashboard for web and mobile, enabling live monitoring and remote control across multiple locations. Designed real-time IoT data visualizations including temperature, humidity, energy, device status, alerts, and system health. Created workflows for remote control, scheduling, automation, and alerts to improve operational efficiency. Built high-fidelity designs and prototypes in Figma. Worked with Next.js, shadcn/ui, and atomic design systems for scalable UIs.",
    icon: React.createElement(CgWorkAlt),
    date: "Sep 2025 - Present",
  },
  {
    title: "Senior UI/UX Engineer",
    location: "Nvision (Pvt) Ltd",
    description:
      "Drove the design and development of user-centered interfaces to deliver high-quality results within tight timelines. Led the UI/UX design for the SaleMore POS system across Android, iOS, and web dashboards, ensuring a consistent cross-platform experience. Redesigned the POS admin dashboard, improving usability, navigation, and operational efficiency. Created user flows, wireframes, interactive prototypes, and high-fidelity designs using Figma. Implemented frontend UI components using PHP, React.js, CSS, and Tailwind CSS.",
    icon: React.createElement(CgWorkAlt),
    date: "Nov 2023 - Sep 2025",
  },
  {
    title: "Senior UX Engineer",
    location: "Tecxa (Pvt) Ltd",
    description:
      "Work together with managers, designers, and Developers to develop, design, and implement user-facing products (various websites and Apps). Produce experience concepts, wireframes, sketches, and design prototypes to showcase the user experience.",
    icon: React.createElement(CgWorkAlt),
    date: "Oct 2022 - Nov 2023",
  },
  {
    title: "UX Engineer",
    location: "Upentreprise (Pvt) Ltd",
    description:
      "Designed flow diagrams, site maps, UI/UX Revamp websites, and applications with Canadian and Sri Lanka teams. Created wireframes and prototypes, gathered and documented design requirements, and communicated with foreign clients.",
    icon: React.createElement(CgWorkAlt),
    date: "Apr 2021 - Oct 2022",
  },
  {
    title: "Associate UI/UX Designer",
    location: "9xcoders (Pvt) Ltd",
    description:
      "Designed UI/UX in collaboration with engineering & design teams and managed the implementation of features. Worked cross-functionally to design products & tools, incorporating research & coding fully functional prototypes for testing.",
    icon: React.createElement(CgWorkAlt),
    date: "Oct 2019 - Apr 2021",
  },
  {
    title: "Trainee Frontend developer (Internship)",
    location: "Ricco Hub Solutions (Pvt) Ltd",
    description:
      "Created interactive HTML & CSS for responsive mobile and desktop websites. Design in-app graphics and promotional brand assets and animations.",
    icon: React.createElement(LuGraduationCap),
    date: "Oct 2017 - Jul 2018",
  },
] as const;

export const projectsData = [
  {
    id:1,
    title: "Aim Game",
    description:
      "Welcome to AimGame, your ultimate solution for managing leads and optimizing sales funnels! Whether you're a solo entrepreneur, a business owner, or part of a larger sales team, AimGame is designed to streamline your lead management process and supercharge your sales conversions..",
    tags: ["Adobe Xd","Case Study", "Miro", "Branding", "Prototype", "Wireframe" , "User Research"],
    imageUrl: aimGame,
  },
  {
    id:4,
    title: "Life Line App",
    description:
      "Welcome to Life Line App, the transformative online platform that connects individuals seeking guidance and support with experienced mentors and a comprehensive array of supportive services. Whether you're navigating your career, pursuing personal development, or seeking specialized expertise, Life Line App is your gateway to meaningful connections and personal growth.",
    tags: ["Adobe XD", "Miro", "Branding", "Case Study"],
    imageUrl: lifeLine,
  }, {
    id:5,
    title: "MediQem App",
    description:
      "Welcome to MediQem, your trusted online platform for convenient and secure medical ordering. Whether you're in need of prescription medications, over-the-counter products, or health essentials, MediQem simplifies the process by bringing the pharmacy to your fingertips. Say goodbye to long queues and hello to hassle-free medical orders delivered directly to your doorstep.",
    tags: ["Figma", "Adobe xd","Miro", "Branding", "Case Study"],
    imageUrl: mediCem,
  },
  {
    id:6,
    title: "MyStartup Funder",
    description:
      "Welcome to MyStartup Funder, the dynamic platform that bridges the gap between startup companies and passionate backers, creating a powerful ecosystem of innovation, growth, and meaningful impact. Whether you're an entrepreneur seeking funding or an individual looking to support groundbreaking ideas, MyStartup Funder provides a seamless space to connect, collaborate, and make a difference.",
    tags: ["Adobe XD", "Miro", "Branding", "React JS", "Tailwind" ,"User Research"],
    imageUrl: myStartUp,
  },
  {
    id:7,
    title: "RCB International",
    description:
      "Welcome to RCB International, your all-in-one platform for creating and managing your online donation website with ease. Whether you're a nonprofit organization, a community group, or an individual looking to make a difference, RCB International provides you with the tools you need to build a compelling online presence and effectively manage your donors and fundraising campaigns.",
    tags: ["Adobe XD", "Miro", "Branding", "css", "PHP" ,"User Research"],
    imageUrl: rcb,
  },
] as const;

export const skillsData = [
  "User Research",
  "Information Architecture",
  "Prototyping and Design",
  "Usability Testing",
  "Interaction Design",
  "User-Centered Design",
  "Collaboration",
  "User-Centered Innovation",
  "User Flow",
  "Task Flow",
  "Flow Diagram",
  "Site Map",
  "HTML",
  "Css",
  "Next.JS",
  "React.JS",
] as const;

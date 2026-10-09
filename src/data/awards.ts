export interface AwardItem {
  id: string;
  year: string;
  title: string;
  presentedBy: string;
  image: string;
  imageAlt: string;
  w?: number;
  h?: number;
}

export const AWARDS: AwardItem[] = [
  {
    id: "award-1",
    year: "2021",
    title: "Security Leadership Summit Award",
    presentedBy: "CAPSI & APDI Security Leadership Summit",
    image: "/awards/SecurityLeadershipSummit-2021.jpeg",
    imageAlt: "Security Leadership Summit Award 2021",
  },
  {
    id: "award-2",
    year: "2019",
    title: "Best Security Skills & Training Center",
    presentedBy: "Central Association of Private Security Industry",
    image: "/awards/BestSecuritySkillsandTrainingCenterAwards.jpeg",
    imageAlt: "Best Security Skills and Training Center Award",
  },
  {
    id: "award-3",
    year: "2018",
    title: "Suraksha Sewa Puraskar",
    presentedBy: "State Security Council & Skill India",
    image: "/awards/SurakshaSewaPuraskar.jpeg",
    imageAlt: "Suraksha Sewa Puraskar Honour",
  },
  {
    id: "award-4",
    year: "2017",
    title: "Chapter President Award",
    presentedBy: "APDI & CAPSI National Board",
    image: "/awards/ChapterPresidentAward.jpeg",
    imageAlt: "Chapter President Recognition Award",
  },
  {
    id: "award-5",
    year: "2016",
    title: "Private Security Day Honour",
    presentedBy: "MEPSC & Security Sector Skill Development Council",
    image: "/awards/PrivateSecurityDayAward.jpeg",
    imageAlt: "Private Security Day Honour",
  },
  {
    id: "award-6",
    year: "2015",
    title: "Excellence in Training & Deployment",
    presentedBy: "Skill India & Ministry of Skill Development",
    image: "/awards/oct2.jpg",
    imageAlt: "Excellence in Training and Deployment Award",
  },
];

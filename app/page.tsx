"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Instagram,
  Description,
  Badge,
  Celebration,
  CardGiftcard,
  EmojiEmotions,
  LocalActivity,
  AutoAwesome
} from '@mui/icons-material';

const features = [
  {
    title: "Instagram Captions",
    path: "pages/instagramcaptions",
    icon: <Instagram />,
    description: "Generate engaging captions for your Instagram posts",
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Resume Generator",
    path: "pages/resume",
    icon: <Description />,
    description: "Create professional resumes instantly",
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Names Generator",
    path: "pages/namegenerator",
    icon: <Badge />,
    description: "Find the perfect name for any occasion",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Nickname Generator",
    path: "pages/nickname",
    icon: <EmojiEmotions />,
    description: "Create fun and unique nicknames",
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Birthday Wishes",
    path: "pages/birthday",
    icon: <Celebration />,
    description: "Generate heartfelt birthday messages",
    color: "from-yellow-500 to-orange-500"
  },
  {
    title: "Gift Messages",
    path: "pages/gift",
    icon: <CardGiftcard />,
    description: "Create perfect gift card messages",
    color: "from-red-500 to-pink-500"
  },
  {
    title: "Event Captions",
    path: "pages/events",
    icon: <LocalActivity />,
    description: "Generate captions for special events",
    color: "from-indigo-500 to-purple-500"
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FeatureCard = ({ feature, onClick }:any) => (
  <div
    onClick={onClick}
    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-75 group-hover:opacity-90 transition-opacity`} />
    <div className="relative p-6">
      <div className="text-white text-3xl mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-white opacity-90">
        {feature.description}
      </p>
      <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <AutoAwesome className="text-white" />
      </div>
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
            <main className="flex-grow bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Word Play
            </h1>
            <p className="text-xl text-gray-600">
              Your creative companion for generating perfect words for every occasion
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                onClick={() => router.push(feature.path)}
              />
            ))}
          </div>
        </div>
      </main>
  </div>
  );
}
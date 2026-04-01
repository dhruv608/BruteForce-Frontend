"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Github, Linkedin, Zap, Code, Target, TrendingUp, Award, Users, ArrowRight, Sparkles } from 'lucide-react';

const Origin = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const TimelineSection = ({ children, index, icon: Icon }: { children: React.ReactNode; index: number; icon: any }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        className="relative flex items-center mb-24"
      >
        {/* Timeline Node */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={isInView ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
            className="relative"
          >
            <div className="w-6 h-6 bg-[#ccff00] rounded-full shadow-lg shadow-[#ccff00]/50" />
            <motion.div
              animate={isInView ? { scale: [1, 2, 1], opacity: [1, 0, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              className="absolute inset-0 w-6 h-6 bg-[#ccff00] rounded-full"
            />
          </motion.div>
        </div>
        
        {/* Content */}
        <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'ml-auto pl-12'}`}>
          {children}
        </div>
      </motion.div>
    );
  };

  const StoryCard = ({ title, icon: Icon, story, highlight, index }: { 
    title: string; 
    icon: any; 
    story: string[]; 
    highlight?: string;
    index: number;
  }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ 
          y: -5, 
          boxShadow: '0 20px 40px rgba(204, 255, 0, 0.15)',
          borderColor: 'rgba(204, 255, 0, 0.3)'
        }}
        className="relative group"
      >
        {/* Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/10 via-transparent to-[#ccff00]/5 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
        
        {/* Glass Card */}
        <div className="relative bg-black/40 backdrop-blur-xl border border-[#ccff00]/20 rounded-2xl p-8 overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          {/* Icon */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={isInView ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              className="w-10 h-10 bg-[#ccff00]/10 rounded-lg flex items-center justify-center border border-[#ccff00]/30"
            >
              <Icon className="w-5 h-5 text-[#ccff00]" />
            </motion.div>
            <h3 className="text-2xl font-bold">
              <span className="text-white">Brute</span>
              <span className="text-[#ccff00]"> {title}</span>
            </h3>
          </div>

          {/* Story Lines */}
          <div className="space-y-2 mb-4">
            {story.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + i * 0.1 }}
                className="text-gray-300 text-sm leading-relaxed"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Highlight Line */}
          {highlight && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
              className="text-[#ccff00] font-semibold text-sm"
            >
              {highlight}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background with Particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#ccff00] rounded-full opacity-30"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        {/* Grid Background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(204, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(204, 255, 0, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
        />
      </div>

      <div ref={containerRef} className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="text-white">Brute</span>
            <span className="text-[#ccff00]"> Force</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Every coder starts somewhere. This is where we began.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="animate-bounce mt-20"
          >
            <div className="w-6 h-10 border-2 border-[#ccff00] rounded-full flex justify-center">
              <div className="w-1 h-3 bg-[#ccff00] rounded-full mt-2 animate-pulse" />
            </div>
          </motion.div>
        </motion.section>

        {/* Why "Brute Force" Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-center mb-12"
            >
              Why <span className="text-[#ccff00]">"Brute Force"</span>?
            </motion.h2>

            <div className="space-y-6 text-lg text-gray-300 text-center">
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl font-light"
              >
                Before we learn better, we try everything.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl font-light"
              >
                Before optimization, there is brute force.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-2xl font-semibold text-white"
              >
                And that's where every real journey begins.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-6 relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#ccff00] via-transparent to-[#ccff00]" />

          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-center mb-20"
            >
              The Journey
            </motion.h2>

            {/* Section 1: The Start */}
            <TimelineSection index={0} icon={Sparkles}>
              <StoryCard
                title="The Start"
                icon={Sparkles}
                story={[
                  "Two students navigating DSA",
                  "Getting stuck constantly",
                  "No clear path forward",
                  "Just trying to stay consistent"
                ]}
                highlight="The beginning of something real"
                index={0}
              />
            </TimelineSection>

            {/* Section 2: The Idea */}
            <TimelineSection index={1} icon={Zap}>
              <StoryCard
                title="The Idea"
                icon={Zap}
                story={[
                  "What if we could track progress?",
                  "Late-night discussions",
                  "The spark of building something",
                  "Turning frustration into purpose"
                ]}
                highlight="That moment when everything changed"
                index={1}
              />
            </TimelineSection>

            {/* Section 3: The Build */}
            <TimelineSection index={2} icon={Code}>
              <StoryCard
                title="The Build"
                icon={Code}
                story={[
                  "Turning ideas into reality",
                  "Countless iterations",
                  "Building the tracking system",
                  "Creating something meaningful"
                ]}
                highlight="One line of code at a time"
                index={2}
              />
            </TimelineSection>

            {/* Section 4: The Purpose */}
            <TimelineSection index={3} icon={Target}>
              <StoryCard
                title="The Purpose"
                icon={Target}
                story={[
                  "Built for students like us",
                  "To make consistency visible",
                  "To transform confusion into clarity",
                  "To show that progress is possible"
                ]}
                highlight="Student-first, always"
                index={3}
              />
            </TimelineSection>

            {/* Section 5: The USP */}
            <TimelineSection index={4} icon={Award}>
              <StoryCard
                title="What Makes Us Different"
                icon={Award}
                story={[
                  "Leaderboard that motivates",
                  "Progress tracking that works",
                  "Structure that reduces confusion",
                  "Community that keeps you going"
                ]}
                highlight="DSA is about showing up, again and again"
                index={4}
              />
            </TimelineSection>

            {/* Section 6: The Future */}
            <TimelineSection index={5} icon={TrendingUp}>
              <StoryCard
                title="The Future"
                icon={TrendingUp}
                story={[
                  "Smarter insights ahead",
                  "Better learning algorithms",
                  "Building the complete ecosystem",
                  "The journey continues..."
                ]}
                highlight="This is just the beginning"
                index={5}
              />
            </TimelineSection>
          </div>
        </section>

        {/* Force Section */}
        <section className="py-20 px-6 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#ccff00] rounded-full opacity-20"
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%' 
                }}
                animate={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ 
                  duration: 15 + Math.random() * 10, 
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm text-[#ccff00] font-medium mb-4 tracking-wider uppercase"
              >
                Every system has a force behind it.
              </motion.p>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold"
              >
                Force Behind <span className="text-[#ccff00]">Brute Force</span>
              </motion.h2>
            </motion.div>

            {/* Connection Lines */}
            <div className="relative mb-16">
              <svg className="w-full h-20" viewBox="0 0 800 80">
                <motion.path
                  d="M 200 40 Q 400 20 600 40"
                  stroke="rgba(204, 255, 0, 0.2)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
            </div>

            {/* Builders Grid */}
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              {/* Dhruv Narang */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ 
                  y: -10, 
                  rotate: 1,
                  boxShadow: '0 30px 60px rgba(204, 255, 0, 0.2)'
                }}
                className="relative group"
              >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/10 via-transparent to-[#ccff00]/5 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                {/* Glass Card */}
                <div className="relative bg-black/40 backdrop-blur-xl border border-[#ccff00]/20 rounded-3xl p-8 overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-5">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                      }}
                    />
                  </div>

                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto relative">
                      {/* Neon Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-[#ccff00]/30 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border border-[#ccff00]/50 rounded-full"
                      />
                      
                      {/* Avatar Placeholder */}
                      <div className="absolute inset-2 bg-gradient-to-br from-[#ccff00]/20 to-[#ccff00]/10 rounded-full flex items-center justify-center border border-[#ccff00]/30">
                        <span className="text-2xl font-bold text-[#ccff00]">DN</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-white">Dhruv Narang</h3>
                    <p className="text-[#ccff00] font-medium">System Architect</p>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="pt-4 border-t border-[#ccff00]/20"
                    >
                      <p className="text-gray-300 text-sm italic">
                        "Turning effort into systems"
                      </p>
                    </motion.div>

                    {/* LinkedIn */}
                    <div className="flex justify-center pt-4">
                      <motion.a
                        href="https://linkedin.com/in/dhruv-naran"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: '0 0 20px rgba(204, 255, 0, 0.5)'
                        }}
                        className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 transition-all"
                      >
                        <Linkedin className="w-6 h-6 text-[#ccff00]" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ayush Chaurasiya */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ 
                  y: -10, 
                  rotate: -1,
                  boxShadow: '0 30px 60px rgba(204, 255, 0, 0.2)'
                }}
                className="relative group"
              >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/10 via-transparent to-[#ccff00]/5 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                {/* Glass Card */}
                <div className="relative bg-black/40 backdrop-blur-xl border border-[#ccff00]/20 rounded-3xl p-8 overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-5">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                      }}
                    />
                  </div>

                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto relative">
                      {/* Neon Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-[#ccff00]/30 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="absolute inset-0 border border-[#ccff00]/50 rounded-full"
                      />
                      
                      {/* Avatar Placeholder */}
                      <div className="absolute inset-2 bg-gradient-to-br from-[#ccff00]/20 to-[#ccff00]/10 rounded-full flex items-center justify-center border border-[#ccff00]/30">
                        <span className="text-2xl font-bold text-[#ccff00]">AC</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-white">Ayush Chaurasiya</h3>
                    <p className="text-[#ccff00] font-medium">Experience Engineer</p>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="pt-4 border-t border-[#ccff00]/20"
                    >
                      <p className="text-gray-300 text-sm italic">
                        "Building consistency through code"
                      </p>
                    </motion.div>

                    {/* LinkedIn */}
                    <div className="flex justify-center pt-4">
                      <motion.a
                        href="https://linkedin.com/in/ayush-chaurasiya"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: '0 0 20px rgba(204, 255, 0, 0.5)'
                        }}
                        className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 transition-all"
                      >
                        <Linkedin className="w-6 h-6 text-[#ccff00]" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Guiding Force Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-center"
            >
              {/* Connection Line to Mentor */}
              <div className="relative mb-8">
                <svg className="w-full h-16" viewBox="0 0 800 60">
                  <motion.path
                    d="M 200 30 L 600 30"
                    stroke="rgba(204, 255, 0, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />
                </svg>
              </div>

              {/* Mentor Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(204, 255, 0, 0.15)'
                }}
                className="inline-block relative group max-w-md mx-auto"
              >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/15 via-transparent to-[#ccff00]/8 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative bg-black/30 backdrop-blur-xl border border-[#ccff00]/25 rounded-2xl p-6 overflow-hidden">
                  {/* Icon */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-12 h-12 mx-auto mb-4 bg-[#ccff00]/10 rounded-full flex items-center justify-center border border-[#ccff00]/30"
                  >
                    <Users className="w-6 h-6 text-[#ccff00]" />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#ccff00]">Guiding Force</h3>
                    <p className="text-white font-semibold">Satya Sai</p>
                    <p className="text-gray-300 text-sm">DSA Mentor</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-[#ccff00]/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 mb-4"
            >
              Every journey begins with a single step. Or in our case, a brute force solution.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center gap-6"
            >
              <Link href="/" className="text-[#ccff00] hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/origin" className="text-[#ccff00] hover:text-white transition-colors">
                Origin
              </Link>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Origin;

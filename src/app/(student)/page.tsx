"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { studentTopicService } from '@/services/student/topic.service';
import { studentAuthService } from '@/services/student/auth.service';
import { isStudentToken } from '@/lib/auth-utils';
import { TopicCard } from '@/components/student/topics/TopicCard';
import { Button } from '@/components/ui/button';
import { Target, Flame, Trophy } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { OnboardingStep1 } from '@/components/student/onboarding/components/OnboardingStep1';
import { OnboardingStep2 } from '@/components/student/onboarding/components/OnboardingStep2';
import { OnboardingStep3 } from '@/components/student/onboarding/components/OnboardingStep3';
import { ProgressBar } from '@/components/student/onboarding/components/ProgressBar';
import { useOnboardingModal } from '@/components/student/onboarding/hooks/useOnboardingModal';
import { HeroSection } from '@/components/student/home/HeroSection';
import { TopicsSection } from '@/components/student/home/TopicsSection';
import { TopicsSectionShimmer } from '@/components/student/home/TopicsSectionShimmer';
import { handleToastError } from "@/utils/toast-system";
      import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface User {
  username?: string;
  leetcode?: string;
  gfg?: string;
  // Add other user properties based on your API response
  codingStats?: {
    totalSolved?: number;
  };
  leaderboard?: {
    globalRank?: string;
  };
  // Add any other properties your user object has
}

interface StudentDataResponse {
  success: boolean;
  data: User;
}

export default function StudentHomePage() {
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [studentResponse, setStudentResponse] = useState<StudentDataResponse | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [stats, setStats] = useState({
    solved: 0,
    rank: '-',
    topicsActive: 0
  });
  const [loading, setLoading] = useState(true);

  // Onboarding hook
  const { step, setStep, data, setData, confirmChecked, setConfirmChecked, loading: onboardingLoading, submitOnboarding } = useOnboardingModal(() => setShowOnboarding(false));


  const refreshUserData = async () => {
    // Check if we have a student token before making API calls
    if (!isStudentToken()) {
      console.log("No student token found, skipping API calls");
      return;
    }

    try {
      // Use lightweight /me endpoint for basic student info
      console.log("Calling getCurrentStudent...");
      const studentData = await studentAuthService.getCurrentStudent().catch((e: any) => {
        console.error("Failed to fetch student data", e);
        console.error("Error details:", e.response?.data, e.response?.status);
        return null;
      });

      console.log("Student data from /me:", studentData);

      const topicsData = await studentTopicService.getTopics().catch((e: any) => {
        console.warn("Failed to fetch topics (potentially missing batch)", e);
        return [];
      });

      setStudentResponse(studentData);
      setUser(studentData?.data);
      setTopics(topicsData);

      // Initialize onboarding data with existing user info
      if (studentData?.data) {
        const username = studentData?.data?.username || '';
        const leetcode = studentData?.data?.leetcode || '';
        const gfg = studentData?.data?.gfg || '';
        const cityId = studentData?.data?.cityId || studentData?.data?.city_id || '';
        const batchId = studentData?.data?.batchId || studentData?.data?.batch_id || '';

        setData((prev: any) => ({
          ...prev,
          username: username || '',
          leetcode_id: leetcode || '',
          gfg_id: gfg || '',
          city_id: cityId || prev.city_id,
          batch_id: batchId || prev.batch_id
        }));
      }

      // Check onboarding requirements from clean /me data
      const username = studentData?.data?.username;
      const leetcode = studentData?.data?.leetcode;
      const gfg = studentData?.data?.gfg;

      console.log("Checking onboarding requirements:", {
        username,
        leetcode,
        gfg,
        studentData
      });

      if (studentData?.data && (!username || !leetcode || !gfg)) {
        console.log("Showing onboarding modal - missing required fields");
        setShowOnboarding(true);
      } else {
        console.log("Hiding onboarding modal - all required fields present");
        setShowOnboarding(false);
      }

      // For now, set basic stats - can be enhanced later if needed
      const activeTopics = topicsData.filter((t: any) => (t.batchSpecificData?.solvedQuestions || 0) > 0).length;

      setStats({
        solved: 0, // Will be updated if we add stats to /me endpoint
        rank: '-',
        topicsActive: activeTopics
      });
    } catch (e) {
      handleToastError(e);
      console.error("Error refreshing user data", e);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        await refreshUserData();
      } catch (e) {
        handleToastError(e);
        console.error("Dashboard data fetch error", e);
        // Handle auth error
        if ((e as any).response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Listen to profile updates (e.g., from onboarding) to refresh dashboard stats dynamically
    window.addEventListener('profileUpdated', refreshUserData);
    return () => window.removeEventListener('profileUpdated', refreshUserData);
  }, []);

  // Get top 4 topics for the showcase
  const displayTopics = topics.slice(0, 8);

  return (
    <>
      <div className="flex flex-col w-full pb-12">
        {/* HERO SECTION - Always render immediately */}
        <HeroSection />
        
        {/* TOPICS SECTION - Always render header, show shimmer only for topic cards */}
        <TopicsSection topics={topics} loading={loading} />
      </div>


{showOnboarding && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* 🔥 BACKDROP */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => {}} // prevent outside close
    />

    {/* 🔥 MODAL */}
    <div
      className="
        relative z-10
         max-w-[720px]

        rounded-2xl
        border border-border/40
        bg-background/95
        backdrop-blur-xl

        shadow-2xl
        overflow-hidden

        animate-in fade-in zoom-in-95
      "
    >

      {/* HEADER */}
      <div className="px-6 pt-6 pb-4 border-b border-border/30 relative">
        <h2 className="text-lg font-semibold">
          Complete Your Profile
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          Step {step} of 3 - Let's set up your BruteForce profile
        </p>

      </div>

      {/* STEPPER */}
      <div className="px-6 pt-4">
        <ProgressBar step={step} />
      </div>

      {/* BODY */}
      <div className="px-6 pb-6 pt-4 max-h-[75vh] overflow-y-auto">

        {step === 1 && (
          <OnboardingStep1
            data={data}
            setData={setData}
            setStep={setStep}
          />
        )}

        {step === 2 && (
          <OnboardingStep2
            data={data}
            setData={setData}
            setStep={setStep}
          />
        )}

        {step === 3 && (
          <OnboardingStep3
            data={data}
            setStep={setStep}
            confirmChecked={confirmChecked}
            setConfirmChecked={setConfirmChecked}
            submitOnboarding={submitOnboarding}
            loading={onboardingLoading}
          />
        )}

      </div>
    </div>
  </div>
)}
    </> 
  ); 
}

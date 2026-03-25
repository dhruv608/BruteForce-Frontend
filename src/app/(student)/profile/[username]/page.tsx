"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { studentProfileService } from '@/services/student/profile.service';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Flame, Trophy, CheckCircle2, Link as LinkIcon, Camera, Edit2, X, Calendar, Target, TrendingUp, Users, MapPin, GraduationCap, Code, Activity, Clock, Award, BarChart3 } from 'lucide-react';
import { TopicProgressModal } from '@/components/TopicProgressModal';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsernameEditModal, setShowUsernameEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    github: '',
    linkedin: '',
    leetcode: '',
    gfg: ''
  });
  const [usernameForm, setUsernameForm] = useState({
    username: ''
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showTopicProgressModal, setShowTopicProgressModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch current user first to establish auth state
    const initializeAuthAndProfile = async () => {
      await fetchCurrentUser();
      await fetchProfileByUsername();
    };
    
    initializeAuthAndProfile();
  }, [username]);

  const fetchCurrentUser = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth check timeout')), 5000);
      });
      
      const currentUserPromise = studentAuthService.getCurrentStudent();
      const user = await Promise.race([currentUserPromise, timeoutPromise]) as any;
      
      console.log("Current user fetched:", user);
      setCurrentUser(user);
      
      // Check if user has admin token trying to access student routes
      if (user?.error === "Access denied. Students only.") {
        console.log("Admin token detected, cannot access student routes");
        setCurrentUser(null);
        return;
      }
      
    } catch (error: any) {
      console.log("Auth check failed:", error?.response?.status || error.message);
      
      // Handle 403 errors (admin token trying to access student routes)
      if (error?.response?.status === 403) {
        console.log("403 error - likely admin token on student route");
        setCurrentUser(null);
        return;
      }
      
      // For other errors, we still want to set authChecked = true
      console.log("Authentication error, but proceeding...");
    } finally {
      setAuthChecked(true);
    }
  };

  // Authentication is now completely optional - only check when user tries to edit
  // This prevents all 403 errors on public profile views

  const fetchProfileByUsername = async () => {
    if (!username) {
      setProfileError('Username is required');
      setLoading(false);
      return;
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setProfileError('Request timed out. Please try again.');
      setLoading(false);
    }, 10000); // 10 second timeout

    try {
      const data = await studentProfileService.getProfileByUsername(username);
      clearTimeout(timeoutId);
      setProfileData(data);
      setProfileError(null);
      setEditForm({
        name: data?.student?.name || '',
        github: data?.student?.github || '',
        linkedin: data?.student?.linkedin || '',
        leetcode: data?.student?.leetcode || '',
        gfg: data?.student?.gfg || ''
      });
      setUsernameForm({
        username: data?.student?.username || ''
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Failed to fetch profile", err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load profile';
      if (err.response?.status === 404) {
        errorMessage = 'Profile not found';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setProfileError(errorMessage);
      setProfileData(null);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    try {
      await studentProfileService.updateProfileImage(file);
      
      // Add timeout for profile refresh to prevent hanging
      const refreshTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile refresh timeout')), 3000); // 3 second timeout
      });
      
      await Promise.race([fetchProfileByUsername(), refreshTimeout]);
      
      // Show success feedback
      console.log('Profile image updated successfully');
    } catch (err: any) {
      console.error("Image upload failed", err);
      
      // If refresh timed out, still show success for the upload
      if (err.message === 'Profile refresh timeout') {
        console.log('Image uploaded but profile refresh timed out - manual refresh may be needed');
        // Optionally show a user-friendly message
        alert('Profile image updated! Please refresh the page to see changes.');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Profile</h2>
          <p className="text-sm">Fetching profile data for @{username}...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Profile</h2>
          <p className="text-muted-foreground mb-6">{profileError}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData || !profileData.student) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <h2>Profile not found.</h2>
      </div>
    );
  }

  const { student, codingStats, streak, leaderboard, recentActivity, heatmap } = profileData;
  const initials = student.name
    ? student.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'ME';

  const canEdit = () => {
    // If auth check hasn't completed, don't show edit button yet
    if (!authChecked) {
      return false;
    }

    // If no current user, definitely can't edit
    if (!currentUser) {
      return false;
    }

    // If current user has admin token (403 error), can't edit student profile
    if (currentUser?.error === "Access denied. Students only.") {
      return false;
    }

    // Check if profile data exists and has student info
    if (!profileData?.student) {
      return false;
    }

    // Multiple ways to check if this is the owner's profile
    const isOwner1 = currentUser?.data?.id === profileData.student.id;
    const isOwner2 = currentUser?.data?.username === profileData.student.username;
    const isOwner3 = currentUser?.id === profileData.student.id;
    const isOwner4 = currentUser?.username === profileData.student.username;
    
    // Check token-based username match
    const token = localStorage.getItem('accessToken') || document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
    let tokenUsername = null;
    
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        tokenUsername = decoded.email?.split('@')[0]; // Extract username from email
      } catch (e) {
        console.log("Token parsing failed in canEdit");
      }
    }
    
    const isOwner5 = tokenUsername === profileData.student.username;
    
    // Log for debugging
    console.log("CanEdit check:", {
      currentUser: currentUser?.data,
      profileStudent: profileData.student,
      isOwner1, isOwner2, isOwner3, isOwner4, isOwner5,
      tokenUsername
    });
    
    return isOwner1 || isOwner2 || isOwner3 || isOwner4 || isOwner5;
  };

  // Add a manual refresh function for auth state
  const refreshAuthState = async () => {
    setAuthChecked(false);
    await fetchCurrentUser();
  };

  // Test function to debug authentication
  const testAuth = async () => {
    try {
      const localStorageToken = localStorage.getItem('accessToken');
      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const token = localStorageToken || cookieToken;

      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await fetch('/api/students/debug-auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Auth debug response:', data);
    } catch (error) {
      console.error('Auth debug error:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUploading(true);
      
      // Get token from multiple sources
      const localStorageToken = localStorage.getItem('accessToken');
      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const token = localStorageToken || cookieToken;

      // Call the backend API to update profile
      const response = await fetch('/api/students/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          github: editForm.github,
          linkedin: editForm.linkedin
        })
      });

      if (response.ok) {
        // Refresh profile data
        await fetchProfileByUsername();
        setShowEditModal(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  console.log('=== DEBUGGING API URL ===');
console.log('NEXT_PUBLIC_API_URL from process.env:', process.env.NEXT_PUBLIC_API_URL);
console.log('Current baseURL from axios instance:', (api as any).defaults.baseURL);

const handleSaveUsername = async () => {
    try {
      if (!usernameForm.username.trim()) {
        alert('Username cannot be empty');
        return;
      }

      // Get token from multiple sources
      const localStorageToken = localStorage.getItem('accessToken');
      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const token = localStorageToken || cookieToken;

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Using token for username update:', token.substring(0, 20) + '...');

      const response = await fetch('/api/students/username', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: usernameForm.username.trim()
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (response.ok) {
        // Refresh profile data and redirect to new URL
        await fetchProfileByUsername();
        setShowUsernameEditModal(false);
        
        // Redirect to new username URL
        const newUsername = usernameForm.username.trim();
        if (newUsername !== username) {
          window.location.href = `/profile/${newUsername}`;
        }
      } else {
        // Check if response is HTML (error page) instead of JSON
        const contentType = response.headers.get('content-type');
        console.log('Response content type:', contentType);
        
        if (contentType && contentType.includes('text/html')) {
          // Get the response text to see what HTML we're getting
          const htmlText = await response.text();
          console.log('HTML Response (first 200 chars):', htmlText.substring(0, 200));
          throw new Error('Authentication failed. Please log in again.');
        }
        
        const error = await response.json() as { error?: string };
        throw new Error(error.error || 'Failed to update username');
      }
    } catch (error: any) {
      console.error('Error updating username:', error);
      alert((error as Error).message || 'Failed to update username. Please try again.');
    }
  };

  const handleDeleteImage = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteImage = async () => {
    try {
      setUploading(true);
      
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

      const response = await fetch('/api/students/profile-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh profile data
        await fetchProfileByUsername();
        setShowDeleteConfirm(false);
        alert('Profile image removed successfully!');
      } else {
        throw new Error('Failed to remove profile image');
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('Failed to remove profile image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-16">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border rounded-3xl overflow-hidden shadow-sm mb-8 relative">
        <div className="h-40 bg-gradient-to-r from-primary/20 via-amber-600/20 to-emerald-600/20 w-full" />
        
        <div className="px-8 sm:px-12 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20 relative z-10">
          
          <div className="relative group">
            <div className="w-36 h-36 rounded-full border-4 border-card bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden shadow-xl">
              {student.profileImageUrl ? (
                <img src={student.profileImageUrl} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary via-amber-600 to-emerald-600 text-white flex items-center justify-center font-serif">
                  {initials}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 className="text-4xl font-black font-serif italic text-foreground tracking-tight">{student.name}</h1>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <p className="text-muted-foreground font-mono text-lg">@{student.username}</p>
              {canEdit() && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowUsernameEditModal(true)}
                  title="Edit username"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[14px] font-medium text-muted-foreground">
              {student.batch && (
                <span className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Batch: {student.batch} {student.year && `(${student.year})`}
                </span>
              )}
              {student.city && (
                <span className="bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {student.city}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex h-8 text-[12px]"
              onClick={() => setShowTopicProgressModal(true)}
            >
              <BarChart3 className="w-3 h-3 mr-2" />
              Topic Progress
            </Button>
            
            {/* Show loading state while checking auth */}
            {!authChecked ? (
              <div className="hidden sm:flex items-center gap-2 px-3 h-8 text-[12px] text-muted-foreground">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                Checking permissions...
              </div>
            ) : canEdit() ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex h-8 text-[12px]"
                onClick={() => setShowEditModal(true)}
              >
                <Edit2 className="w-3 h-3 mr-2" />
                Edit Profile
              </Button>
            ) : (
              /* Show refresh button if user thinks they should be able to edit */
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[12px] text-muted-foreground hover:text-foreground"
                  onClick={refreshAuthState}
                  title="Refresh authentication state"
                >
                  Refresh
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[12px] text-blue-600 hover:text-blue-700"
                  onClick={testAuth}
                  title="Test authentication (debug)"
                >
                  Test Auth
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: STATS & SOCIAL */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* OVERVIEW STATS */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-6 text-[16px] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                <span className="text-[14px] font-medium text-muted-foreground flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Global Rank
                </span>
                <span className="font-bold text-foreground font-mono text-xl">#{leaderboard?.globalRank || '-'}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <span className="text-[14px] font-medium text-primary flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  City Rank
                </span>
                <span className="font-bold text-primary font-mono text-xl">#{leaderboard?.cityRank || '-'}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <span className="text-[14px] font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Max Streak
                </span>
                <span className="font-bold text-orange-700 dark:text-orange-400 font-mono text-xl">{streak?.maxStreak || 0}</span>
              </div>
            </div>
          </div>

          {/* FIXED INFO */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-6 text-[16px] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Profile Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                <span className="text-[14px] font-medium text-muted-foreground">Name</span>
                <span className="font-bold text-foreground">{student.name || '-'}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                <span className="text-[14px] font-medium text-muted-foreground">Email</span>
                <span className="font-mono text-sm text-foreground truncate max-w-[150px]">{student.email || '-'}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                <span className="text-[14px] font-medium text-muted-foreground">Enrollment ID</span>
                <span className="font-mono text-sm text-foreground">{student.enrollmentId || '-'}</span>
              </div>

              <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${student.leetcode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-muted/30 border-dashed border-border opacity-60'}`}>
                <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  <Code className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold">LeetCode</div>
                  <div className="text-[12px] opacity-80 font-mono">{student.leetcode || 'Not linked'}</div>
                </div>
                {student.leetcode && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
              </div>

              <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${student.gfg ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-muted/30 border-dashed border-border opacity-60'}`}>
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  <Code className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold">GeeksforGeeks</div>
                  <div className="text-[12px] opacity-80 font-mono">{student.gfg || 'Not linked'}</div>
                </div>
                {student.gfg && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
            </div>
          </div>

          {/* EDITABLE SOCIAL LINKS */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-6 text-[16px] uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Social Links
            </h3>
            
            <div className="space-y-4">
              <a href={student.github ? `https://github.com/${student.github}` : '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${student.github ? 'bg-secondary/50 border-border hover:border-primary/50 hover:shadow-md' : 'bg-muted/30 border-dashed border-border opacity-60 pointer-events-none'}`}>
                <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center">
                  <Github className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-foreground">GitHub</div>
                  <div className="text-[12px] text-muted-foreground font-mono">{student.github || 'Not connected'}</div>
                </div>
                {student.github && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </a>
              
              <a href={student.linkedin || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${student.linkedin ? 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 hover:shadow-md text-blue-600 dark:text-blue-400' : 'bg-muted/30 border-dashed border-border opacity-60 pointer-events-none'}`}>
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold">LinkedIn</div>
                  <div className="text-[12px] opacity-80 font-mono truncate">{student.linkedin ? 'Connected' : 'Not linked'}</div>
                </div>
                {student.linkedin && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </a>
            </div>
            
            {canEdit() && (
              <Button variant="outline" className="w-full mt-6 text-[12px] py-2 h-8" onClick={() => setShowEditModal(true)}>
                Edit Social Links
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVITY & HEATMAP */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* SOLVING STATISTICS */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold font-serif italic text-foreground mb-2 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  Problem Solving Stats
                </h2>
                <p className="text-[14px] text-muted-foreground">Track your coding journey across all difficulty levels.</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black font-serif italic text-primary">{codingStats?.totalSolved || 0}</div>
                <div className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground mt-1">Total Solved</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">Easy</div>
                <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{codingStats?.easy?.solved || 0}</div>
                <div className="text-[11px] text-muted-foreground mt-2">/ {codingStats?.easy?.assigned || 0} assigned</div>
                <div className="w-full bg-emerald-500/20 rounded-full h-2 mt-3">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${codingStats?.easy?.assigned ? (codingStats.easy.solved / codingStats.easy.assigned) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-[12px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-3">Medium</div>
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{codingStats?.medium?.solved || 0}</div>
                <div className="text-[11px] text-muted-foreground mt-2">/ {codingStats?.medium?.assigned || 0} assigned</div>
                <div className="w-full bg-amber-500/20 rounded-full h-2 mt-3">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${codingStats?.medium?.assigned ? (codingStats.medium.solved / codingStats.medium.assigned) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-[12px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">Hard</div>
                <div className="text-3xl font-bold text-red-700 dark:text-red-400">{codingStats?.hard?.solved || 0}</div>
                <div className="text-[11px] text-muted-foreground mt-2">/ {codingStats?.hard?.assigned || 0} assigned</div>
                <div className="w-full bg-red-500/20 rounded-full h-2 mt-3">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${codingStats?.hard?.assigned ? (codingStats.hard.solved / codingStats.hard.assigned) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ACTIVITY HEATMAP */}
            <div>
              <h3 className="text-[16px] font-bold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activity Heatmap (Full Year)
              </h3>
              {heatmap && heatmap.length > 0 ? (
                <div className="bg-card border border-border rounded-2xl p-4">
                  {/* GitHub-style horizontal layout */}
                  <div className="flex flex-col gap-2">
                    {/* Month labels */}
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-3 flex items-center justify-end text-[10px] text-muted-foreground">
                        {/* Empty space for day labels */}
                      </div>
                      <div className="flex-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                      </div>
                    </div>
                    
                    {/* Heatmap grid */}
                    <div className="flex items-start gap-2">
                      {/* Day labels */}
                      <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground w-10">
                        <div className="h-3 flex items-center justify-end">Mon</div>
                        <div className="h-3"></div>
                        <div className="h-3"></div>
                        <div className="h-3 flex items-center justify-end">Wed</div>
                        <div className="h-3"></div>
                        <div className="h-3"></div>
                        <div className="h-3 flex items-center justify-end">Fri</div>
                        <div className="h-3"></div>
                      </div>
                      
                      {/* Heatmap cells - Horizontal layout */}
                      <div className="flex-1 flex gap-0.5">
                        {Array.from({ length: 53 }).map((_, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-0.5">
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              
                              // Calculate the date for this cell (full year = 364 days)
                              const dayOffset = (weekIndex * 7) + dayIndex;
                              const date = new Date(today);
                              date.setDate(date.getDate() - (364 - dayOffset));
                              
                              // Skip if date is in the future
                              if (date > today) {
                                return <div key={`${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                              }
                              
                              const dateStr = date.toISOString().split('T')[0];
                              const dayData = heatmap.find((h: any) => new Date(h.date).toISOString().split('T')[0] === dateStr);
                              
                              const count = dayData ? dayData.count : 0;
                              let bgClass = "bg-secondary/30 border border-border/50";
                              if (count === 0) bgClass = "bg-secondary/30 border border-border/50";
                              else if (count === 1) bgClass = "bg-primary/20 border border-primary/30";
                              else if (count === 2) bgClass = "bg-primary/40 border border-primary/50";
                              else if (count === 3) bgClass = "bg-primary/60 border border-primary/70";
                              else if (count >= 4) bgClass = "bg-primary border border-primary";
                              
                              return (
                                <div 
                                  key={`${weekIndex}-${dayIndex}`}
                                  className={`w-3 h-3 ${bgClass} transition-all hover:scale-110 hover:z-10 cursor-pointer`} 
                                  title={`${count} submissions on ${date.toLocaleDateString()}`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend and stats */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>Less</span>
                      <div className="flex gap-0.5">
                        <div className="w-3 h-3 bg-secondary/30 border border-border/50"></div>
                        <div className="w-3 h-3 bg-primary/20 border border-primary/30"></div>
                        <div className="w-3 h-3 bg-primary/40 border border-primary/50"></div>
                        <div className="w-3 h-3 bg-primary/60 border border-primary/70"></div>
                        <div className="w-3 h-3 bg-primary border border-primary"></div>
                      </div>
                      <span>More</span>
                    </div>
                    
                    {/* Stats summary */}
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary/20 border border-primary/30"></div>
                        {heatmap.reduce((sum: number, h: any) => sum + (h.count > 0 ? 1 : 0), 0)} active days
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {heatmap.reduce((sum: number, h: any) => sum + h.count, 0)} total submissions
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-24 border border-dashed border-border rounded-2xl flex items-center justify-center text-[13px] text-muted-foreground bg-card">
                  <div className="text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div>No activity data available yet. Start solving!</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-foreground mb-6 text-[16px] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity: any, idx: number) => {
                  let levelColor = "text-muted-foreground";
                  let levelBg = "bg-secondary/50";
                  if (activity.difficulty === 'EASY') {
                    levelColor = "text-emerald-600 dark:text-emerald-400";
                    levelBg = "bg-emerald-500/10 border-emerald-500/20";
                  }
                  if (activity.difficulty === 'MEDIUM') {
                    levelColor = "text-amber-600 dark:text-amber-500";
                    levelBg = "bg-amber-500/10 border-amber-500/20";
                  }
                  if (activity.difficulty === 'HARD') {
                    levelColor = "text-red-600 dark:text-red-400";
                    levelBg = "bg-red-500/10 border-red-500/20";
                  }

                  return (
                    <div key={idx} className="flex items-center justify-between p-5 rounded-xl border border-border/50 hover:bg-secondary/50 transition-all hover:shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${levelBg}`}>
                          <CheckCircle2 className={`w-5 h-5 ${levelColor}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-[15px] text-foreground">{activity.problemTitle}</div>
                          <div className="text-[12px] font-mono text-muted-foreground mt-1 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(activity.solvedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(activity.solvedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${levelBg} ${levelColor}`}>
                        {activity.difficulty}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <div className="text-[16px]">No recent submissions.</div>
                <div className="text-[14px] mt-2">Start solving problems to see your activity here!</div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl border border-border w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden">
                    {student.profileImageUrl ? (
                      <img src={student.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-amber-600 text-white flex items-center justify-center text-sm font-bold">
                        {student.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {uploading ? 'Uploading...' : (student.profileImageUrl ? 'Change Image' : 'Add Image')}
                    </Button>
                    {student.profileImageUrl && (
                      <Button
                        onClick={handleDeleteImage}
                        disabled={uploading}
                        variant="ghost"
                        size="sm"
                        className="w-full mt-1 text-destructive hover:text-destructive"
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Username</label>
                <input
                  type="text"
                  value={editForm.github}
                  onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                  placeholder="github-username"
                  className="w-full border border-border p-3 rounded-lg bg-background"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <input
                  type="url"
                  value={editForm.linkedin}
                  onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full border border-border p-3 rounded-lg bg-background"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSaveProfile} disabled={uploading} className="flex-1">
                  {uploading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={() => setShowEditModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERNAME EDIT MODAL */}
      {showUsernameEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl border border-border w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">Edit Username</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUsernameEditModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={usernameForm.username}
                  onChange={(e) => setUsernameForm({ ...usernameForm, username: e.target.value })}
                  placeholder="username"
                  className="w-full border border-border p-3 rounded-lg bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  This will be your unique identifier for profile URLs
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSaveUsername} className="flex-1">
                  Save Username
                </Button>
                <Button onClick={() => setShowUsernameEditModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC PROGRESS MODAL */}
      <TopicProgressModal 
        isOpen={showTopicProgressModal}
        onClose={() => setShowTopicProgressModal(false)}
        username={username}
      />

      {/* CUSTOM CONFIRM DIALOG */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Profile Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove your profile image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteImage}
              disabled={uploading}
            >
              {uploading ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
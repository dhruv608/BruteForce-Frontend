// src/components/student/profile/ProfileHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, BarChart3, GraduationCap, MapPin } from 'lucide-react';
import { StudentProfile } from '@/types/student';

interface ProfileHeaderProps {
  student: StudentProfile;
  canEdit: boolean;
  onEditProfile: () => void;
  onShowTopicProgress: () => void;
}

export function ProfileHeader({ student, canEdit, onEditProfile, onShowTopicProgress }: ProfileHeaderProps) {
  const initials = student.name
    ? student.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'ME';

  return (
    <div className="glass borderless p-8 mb-8" style={{borderRadius: 'var(--radius-xl)'}}>
      <div className="flex items-center justify-between">
        {/* LEFT: Profile Info */}
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full overflow-hidden border-2 glass hover-glow transition-all duration-200 hover:scale-105" 
              style={{borderColor: 'var(--border)'}}
            >
              {student.profileImageUrl ? (
                <img src={student.profileImageUrl} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center font-bold text-primary-foreground" 
                  style={{backgroundColor: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xl)'}}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Name and Metadata */}
          <div>
            <h1 
              className="font-bold mb-1" 
              style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
            >
              {student.name}
            </h1>
            <p 
              className="font-mono mb-3" 
              style={{fontSize: 'var(--text-base)', color: 'var(--text-secondary)'}}
            >
              @{student.username}
            </p>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-3" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
              {student.batch && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{backgroundColor: 'var(--accent-primary)', color: 'var(--primary-foreground)', borderRadius: 'var(--radius-full)'}}>
                  <GraduationCap className="w-4 h-4" />
                  Batch {student.batch} {student.year && `(${student.year})`}
                </span>
              )}
              {student.city && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{backgroundColor: 'var(--accent-secondary)', color: 'var(--secondary-foreground)', borderRadius: 'var(--radius-full)'}}>
                  <MapPin className="w-4 h-4" />
                  {student.city}
                </span>
              )}
              <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-full)'}}>
                ID: {student.enrollmentId}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditProfile}
            className="hover-glow"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onShowTopicProgress}
            className="hover-glow"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
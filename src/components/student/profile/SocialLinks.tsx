// src/components/student/profile/SocialLinks.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon, Github, Linkedin, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '@/types/student';

interface SocialLinksProps {
  student: StudentProfile;
  canEdit: boolean;
  onEditSocialLinks: () => void;
}

export function SocialLinks({ student, canEdit, onEditSocialLinks }: SocialLinksProps) {
  return (
    <div className="glass p-6" style={{borderRadius: 'var(--radius-lg)'}}>
      <h3 
        className="font-bold mb-6 flex items-center gap-2" 
        style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
      >
        <LinkIcon className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
        Social Links
      </h3>

      <div className="space-y-4">
        <a href={student.github || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 hover-glow transition-all duration-200 ${student.github ? '' : 'opacity-60 pointer-events-none'}`} style={{
          backgroundColor: student.github ? 'var(--accent-secondary)' : 'var(--muted)',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${student.github ? 'var(--border)' : 'var(--border)'}`
        }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
            backgroundColor: student.github ? 'var(--accent-primary)' : 'var(--muted)',
            color: student.github ? 'var(--primary-foreground)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Github className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>GitHub</div>
            <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.github ? 'Connected' : 'Not connected'}</div>
          </div>
          {student.github && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
        </a>

        <a href={student.linkedin || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 hover-glow transition-all duration-200 ${student.linkedin ? '' : 'opacity-60 pointer-events-none'}`} style={{
          backgroundColor: student.linkedin ? 'var(--accent-secondary)' : 'var(--muted)',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${student.linkedin ? 'var(--border)' : 'var(--border)'}`
        }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
            backgroundColor: student.linkedin ? 'var(--accent-primary)' : 'var(--muted)',
            color: student.linkedin ? 'var(--primary-foreground)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Linkedin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>LinkedIn</div>
            <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.linkedin ? 'Connected' : 'Not linked'}</div>
          </div>
          {student.linkedin && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
        </a>
      </div>

      {canEdit && (
        <Button 
          variant="outline" 
          className="w-full mt-6 hover-glow transition-all duration-200" 
          onClick={onEditSocialLinks}
          style={{borderRadius: 'var(--radius-lg)'}}
        >
          Edit Social Links
        </Button>
      )}
    </div>
  );
}
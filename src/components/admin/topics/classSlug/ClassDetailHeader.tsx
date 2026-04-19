"use client";

import { Plus, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HTMLRenderer } from '@/components/ui/HTMLRenderer';
import { ClassDetailHeaderProps } from '@/types/admin/classDetail.types';

export default function ClassDetailHeader({ selectedBatch, topicSlug, classSlug, classDetails, onAssignClick }: ClassDetailHeaderProps) {
   const formattedDate = classDetails?.class_date
      ? new Date(classDetails.class_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : null;
   return (
      <>
         {classDetails && (
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 glass backdrop-blur-3xl sm:p-6 shadow-sm">
               {/* TOP META ROW */}
               <div className="flex flex-wrap items-center justify-between gap-4 mb-6 py-2 px-1">
                  {/* LEFT META */}
                  <div className="flex flex-wrap items-center gap-3">
                     <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {classDetails.class_name}
                     </h2>

                     {formattedDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                           <Calendar className="w-4 h-4" />
                           {formattedDate}
                        </div>
                     )}

                     {classDetails.duration_minutes && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                           <Clock className="w-4 h-4" />
                           {classDetails.duration_minutes} min
                        </div>
                     )}
                  </div>

                  {/* RIGHT ACTION */}
                  <div className="flex items-center gap-3">
                     {classDetails.pdf_url ? (
                        <a
                           href={classDetails.pdf_url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
                        >
                           <FileText className="w-4 h-4" />
                           View PDF
                        </a>
                     ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-muted/50 text-muted-foreground cursor-not-allowed">
                           <FileText className="w-4 h-4" />
                           No PDF
                        </div>
                     )}
                     <Button
                        onClick={onAssignClick}
                        className="gap-2 h-10 px-4 rounded-xl shrink-0"
                     >
                        <Plus className="w-4 h-4" />
                        Assign Questions
                     </Button>
                  </div>
               </div>

               {/* DESCRIPTION */}
               {classDetails.description && (
                  <HTMLRenderer
                     html={classDetails.description}
                     className="text-muted-foreground text-sm max-w-3xl mb-6 leading-relaxed"
                  />
               )}
            </div>
         )}
      </>
   );
}

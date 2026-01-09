"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

interface Props {
  resourceTitle: string;
  subjectName: string;
}

export function ReportButton({ resourceTitle, subjectName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Reportar problema"
        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
      >
        <Flag className="w-4 h-4" />
      </button>

      <FeedbackModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        type="report"
        resourceTitle={resourceTitle}
        subjectName={subjectName}
      />
    </>
  );
}
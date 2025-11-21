import React from 'react';
import { AnalysisResult } from '../types';
import { Button } from './Button';

interface ResultModalProps {
  result: AnalysisResult | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  // Determine score color class
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-100 border-green-300";
    if (score >= 60) return "text-[#B9A121] bg-yellow-50 border-yellow-200";
    return "text-[#A22C29] bg-red-50 border-red-200";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
          <div>
            <h3 className="text-2xl font-bold text-[#3C3C3C] font-playfair mb-1">
              {result.candidateName}
            </h3>
            <p className="text-sm text-gray-500">{result.filename}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${getScoreColor(result.matchScore)} flex flex-col items-center min-w-[80px]`}>
            <span className="text-xs font-bold uppercase tracking-wider">Match</span>
            <span className="text-2xl font-bold">{result.matchScore}%</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Summary */}
          <section>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Summary</h4>
            <p className="text-gray-700 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
              {result.summary}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <section>
              <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="bg-green-100 p-1 rounded-full">✓</span> Matched Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills && result.matchedSkills.length > 0 ? (
                  result.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-100">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">No direct matches found</span>
                )}
              </div>
            </section>

            {/* Missing Skills */}
            <section>
              <h4 className="text-sm font-bold text-[#A22C29] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="bg-red-100 p-1 rounded-full">✕</span> Missing / Weak Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills && result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-50 text-[#A22C29] text-sm rounded-full border border-red-100">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">No significant skills missing</span>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
};
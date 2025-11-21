import React from 'react';
import { ResumeFile } from '../types';
import { Button } from './Button';

interface DashboardProps {
  files: ResumeFile[];
  onNavigateToMatcher: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ files, onNavigateToMatcher }) => {
  const processedFiles = files.filter(f => f.status === 'done' && f.result);
  
  // KPI Calculations
  const totalCandidates = processedFiles.length;
  const avgScore = totalCandidates > 0
    ? Math.round(processedFiles.reduce((acc, curr) => acc + (curr.result?.matchScore || 0), 0) / totalCandidates)
    : 0;
  
  const qualifiedCandidates = processedFiles.filter(f => (f.result?.matchScore || 0) >= 70).length;
  
  const topCandidate = processedFiles.length > 0 
    ? processedFiles.reduce((prev, current) => ((prev.result?.matchScore || 0) > (current.result?.matchScore || 0)) ? prev : current)
    : null;

  // Skill Frequency
  const skillMap: Record<string, number> = {};
  processedFiles.forEach(f => {
    f.result?.matchedSkills.forEach(skill => {
      skillMap[skill] = (skillMap[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (totalCandidates === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-[#3C3C3C] mb-2">No Data Available</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Upload and analyze resumes in the "Resume Matcher" section to see insights and analytics here.
        </p>
        <Button onClick={onNavigateToMatcher}>Go to Matcher</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-bold text-[#3C3C3C] font-playfair">Recruitment Overview</h2>
          <p className="text-gray-500">Key performance indicators for current job role.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Candidates" 
          value={totalCandidates.toString()} 
          icon="👥" 
          color="blue"
        />
        <KpiCard 
          title="Average Score" 
          value={`${avgScore}%`} 
          icon="📈" 
          color="purple"
        />
        <KpiCard 
          title="Qualified (>70%)" 
          value={qualifiedCandidates.toString()} 
          icon="🌟" 
          color="gold"
        />
        <KpiCard 
          title="Top Candidate" 
          value={topCandidate?.result?.matchScore + '%'} 
          subtext={topCandidate?.result?.candidateName.split(' ')[0]}
          icon="🏆" 
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Match Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-[#3C3C3C] mb-6">Score Distribution</h3>
          <div className="space-y-4">
            {processedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-600 truncate text-right">
                  {file.result?.candidateName}
                </div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      (file.result?.matchScore || 0) >= 80 ? 'bg-green-500' : 
                      (file.result?.matchScore || 0) >= 60 ? 'bg-[#B9A121]' : 'bg-[#A22C29]'
                    }`}
                    style={{ width: `${file.result?.matchScore}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-bold text-gray-700">
                  {file.result?.matchScore}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-[#3C3C3C] mb-6">Top Matched Skills</h3>
          <div className="space-y-4">
            {topSkills.map(([skill, count], idx) => (
              <div key={skill} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-xs font-bold text-gray-500 rounded-full">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 font-medium">{skill}</span>
                </div>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {count} matches
                </span>
              </div>
            ))}
            {topSkills.length === 0 && (
              <p className="text-gray-400 text-sm">No skills data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ title: string; value: string; icon: string; subtext?: string; color: string }> = ({ title, value, icon, subtext, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    gold: "bg-yellow-50 text-[#B9A121] border-yellow-100",
    green: "bg-green-50 text-green-600 border-green-100",
  }[color] || "bg-gray-50";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <span className={`p-2 rounded-lg text-xl ${colorClasses}`}>{icon}</span>
      </div>
      <h3 className="text-3xl font-bold text-[#3C3C3C]">{value}</h3>
      {subtext && <p className="text-sm text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
};
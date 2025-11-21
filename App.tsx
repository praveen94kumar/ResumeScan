import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { ResumeMatcher } from './components/ResumeMatcher';
import { ResultModal } from './components/ResultModal';
import { HistoryView, SettingsView, HelpView } from './components/PlaceholderViews';
import { ResumeFile, AnalysisResult } from './types';
import { analyzeResume } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('new-scan');
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<ResumeFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

  const handleUpload = (newFiles: File[]) => {
    const newResumeFiles: ResumeFile[] = newFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      status: 'idle'
    }));
    setFiles(prev => [...prev, ...newResumeFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const runAnalysis = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a Job Description first.");
      return;
    }
    if (files.length === 0) {
      alert("Please upload at least one resume.");
      return;
    }

    setIsAnalyzing(true);

    // Process files one by one to avoid rate limits and provide progress updates
    const filesToProcess = files.filter(f => f.status !== 'done');

    for (const fileWrapper of filesToProcess) {
      setFiles(prev => prev.map(f => 
        f.id === fileWrapper.id ? { ...f, status: 'analyzing' } : f
      ));

      const result = await analyzeResume(jobDescription, fileWrapper.file);

      setFiles(prev => prev.map(f => 
        f.id === fileWrapper.id ? { ...f, status: result.matchScore > 0 ? 'done' : 'error', result } : f
      ));
    }

    setIsAnalyzing(false);
  };

  const exportCSV = () => {
    const headers = ["Candidate Name", "Filename", "Match Score", "Matched Skills", "Missing Skills", "Summary"];
    const rows = files
      .filter(f => f.result)
      .map(f => {
        const r = f.result!;
        return [
          `"${r.candidateName}"`,
          `"${r.filename}"`,
          r.matchScore,
          `"${r.matchedSkills.join(', ')}"`,
          `"${r.missingSkills.join(', ')}"`,
          `"${r.summary.replace(/"/g, '""')}"`
        ].join(',');
      });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'resume_matches.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processedFiles = files.filter(f => f.status === 'done' && f.result);
  const completedCount = files.filter(f => f.status === 'done' || f.status === 'error').length;
  const totalCount = files.length;
  const progressPercentage = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onChange={setActiveTab} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="container mx-auto max-w-6xl">
            {activeTab === 'dashboard' && (
              <Dashboard 
                files={files} 
                onNavigateToMatcher={() => setActiveTab('new-scan')} 
              />
            )}
            
            {activeTab === 'chatbot' && (
              <ChatAssistant 
                jobDescription={jobDescription} 
                files={files} 
              />
            )}

            {activeTab === 'new-scan' && (
              <ResumeMatcher 
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                files={files}
                handleUpload={handleUpload}
                handleRemoveFile={handleRemoveFile}
                runAnalysis={runAnalysis}
                isAnalyzing={isAnalyzing}
                processedFiles={processedFiles}
                completedCount={completedCount}
                totalCount={totalCount}
                progressPercentage={progressPercentage}
                exportCSV={exportCSV}
                setSelectedResult={setSelectedResult}
              />
            )}

            {activeTab === 'history' && <HistoryView />}
            
            {activeTab === 'settings' && <SettingsView />}
            
            {activeTab === 'help' && <HelpView />}

          </div>
        </main>
      </div>

      <ResultModal 
        result={selectedResult} 
        onClose={() => setSelectedResult(null)} 
      />
    </div>
  );
};

export default App;
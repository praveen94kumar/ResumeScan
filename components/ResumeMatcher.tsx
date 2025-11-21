import React from 'react';
import { JobInput } from './JobInput';
import { FileUploader } from './FileUploader';
import { Button } from './Button';
import { ResumeFile, AnalysisResult } from '../types';

interface ResumeMatcherProps {
  jobDescription: string;
  setJobDescription: (val: string) => void;
  files: ResumeFile[];
  handleUpload: (files: File[]) => void;
  handleRemoveFile: (id: string) => void;
  runAnalysis: () => void;
  isAnalyzing: boolean;
  processedFiles: ResumeFile[];
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  exportCSV: () => void;
  setSelectedResult: (res: AnalysisResult | null) => void;
}

export const ResumeMatcher: React.FC<ResumeMatcherProps> = ({
  jobDescription,
  setJobDescription,
  files,
  handleUpload,
  handleRemoveFile,
  runAnalysis,
  isAnalyzing,
  processedFiles,
  completedCount,
  totalCount,
  progressPercentage,
  exportCSV,
  setSelectedResult
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#3C3C3C] font-playfair">Upload & Analyze</h2>
        <p className="text-gray-500">Paste job details and upload resumes to start matching.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 h-[500px]">
        <JobInput 
          value={jobDescription} 
          onChange={setJobDescription} 
          disabled={isAnalyzing}
        />
        <FileUploader 
          files={files} 
          onUpload={handleUpload} 
          onRemove={handleRemoveFile}
          disabled={isAnalyzing}
        />
      </div>

      {/* Action Area */}
      <div className="flex flex-col items-center justify-center mb-12 space-y-4">
        <Button 
          onClick={runAnalysis} 
          loading={isAnalyzing} 
          disabled={files.length === 0 || !jobDescription}
          className="text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {isAnalyzing ? 'Analyzing Candidates...' : 'Analyze Resumes'}
        </Button>

        {isAnalyzing && (
          <div className="w-full max-w-md animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between text-sm text-gray-600 mb-1 font-medium">
              <span>Processing batch...</span>
              <span>{completedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div 
                className="bg-[#B9A121] h-2.5 rounded-full transition-all duration-500 ease-out relative" 
                style={{ width: `${Math.max(5, progressPercentage)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-[pulse_1s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {processedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border-t-4 border-[#B9A121] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-[#3C3C3C]">Candidates Ranked</h2>
            <Button variant="outline" onClick={exportCSV} className="text-sm">
              Download CSV
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b">Candidate</th>
                  <th className="p-4 font-semibold border-b">Match Score</th>
                  <th className="p-4 font-semibold border-b hidden md:table-cell">Key Matches</th>
                  <th className="p-4 font-semibold border-b text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedFiles
                  .sort((a, b) => (b.result?.matchScore || 0) - (a.result?.matchScore || 0)) // Sort by high score
                  .map((file) => (
                  <tr key={file.id} className="hover:bg-yellow-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-[#3C3C3C]">{file.result?.candidateName}</div>
                      <div className="text-xs text-gray-400">{file.file.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 dark:bg-gray-200 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${
                              (file.result?.matchScore || 0) >= 80 ? 'bg-green-500' : 
                              (file.result?.matchScore || 0) >= 60 ? 'bg-[#B9A121]' : 'bg-[#A22C29]'
                            }`} 
                            style={{ width: `${file.result?.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-700">{file.result?.matchScore}%</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {file.result?.matchedSkills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                            {skill}
                          </span>
                        ))}
                        {(file.result?.matchedSkills.length || 0) > 3 && (
                          <span className="text-xs text-gray-400 px-2 py-1">+{(file.result?.matchedSkills.length || 0) - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="secondary" 
                        className="text-sm px-4 py-1"
                        onClick={() => setSelectedResult(file.result || null)}
                      >
                        View Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
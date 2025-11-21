export interface AnalysisResult {
  candidateName: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  filename: string;
}

export interface ResumeFile {
  id: string;
  file: File;
  status: 'idle' | 'analyzing' | 'done' | 'error';
  result?: AnalysisResult;
}

export enum AppColors {
  PrimaryGold = '#B9A121',
  SecondaryMaroon = '#A22C29',
  AccentMustard = '#C7AC2A',
  TextDark = '#3C3C3C',
  Background = '#FFFFFF'
}
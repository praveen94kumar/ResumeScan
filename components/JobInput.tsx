import React from 'react';

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const JobInput: React.FC<JobInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#B9A121] h-full flex flex-col">
      <h2 className="text-xl font-bold text-[#3C3C3C] mb-4 font-playfair">1. Job Description</h2>
      <p className="text-sm text-gray-600 mb-2">Paste the full job description here to set the context for analysis.</p>
      <textarea
        className="w-full flex-1 p-4 border border-gray-300 rounded focus:ring-2 focus:ring-[#B9A121] focus:border-transparent outline-none resize-none text-sm"
        placeholder="Paste Job Description (Requirements, Roles, Skills)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};
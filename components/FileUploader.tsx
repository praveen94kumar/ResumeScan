import React, { useRef } from 'react';
import { Button } from './Button';
import { ResumeFile } from '../types';

interface FileUploaderProps {
  files: ResumeFile[];
  onUpload: (files: File[]) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, onUpload, onRemove, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
    // Reset input so same files can be selected again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#A22C29] h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3C3C3C] font-playfair">2. Upload Resumes</h2>
        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">
          {files.length} Added
        </span>
      </div>
      
      <div className="mb-4">
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".pdf,.txt,.doc,.docx"
          disabled={disabled}
        />
        <div 
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer hover:border-[#B9A121]'
          }`}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <div className="text-[#B9A121] text-4xl mb-2">📄</div>
          <p className="text-gray-600 font-medium">Click to upload resumes</p>
          <p className="text-xs text-gray-400 mt-1">Supports PDF, TXT</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[150px] pr-2 space-y-2">
        {files.length === 0 && (
          <p className="text-center text-gray-400 text-sm italic mt-8">No files added yet.</p>
        )}
        {files.map((file) => (
          <div 
            key={file.id} 
            className={`flex items-center justify-between p-3 rounded border transition-all relative overflow-hidden ${
              file.status === 'analyzing' 
                ? 'bg-yellow-50 border-[#B9A121] shadow-sm' 
                : 'bg-gray-50 border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center overflow-hidden z-10 w-full">
              <div className="mr-3 w-5 flex justify-center">
                {file.status === 'idle' && <span className="text-gray-400">●</span>}
                {file.status === 'analyzing' && (
                  <svg className="animate-spin h-4 w-4 text-[#B9A121]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {file.status === 'done' && <span className="text-green-500 text-lg">✓</span>}
                {file.status === 'error' && <span className="text-[#A22C29] text-lg">✕</span>}
              </div>
              <div className="truncate flex-1">
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-medium truncate max-w-[180px] ${file.status === 'analyzing' ? 'text-[#B9A121]' : 'text-gray-700'}`}>
                    {file.file.name}
                  </p>
                  {file.status === 'analyzing' && (
                     <span className="text-[10px] uppercase tracking-wide text-[#B9A121] font-bold ml-2">Analyzing...</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {(file.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button 
              onClick={() => onRemove(file.id)}
              disabled={disabled || file.status === 'analyzing'}
              className={`ml-2 text-gray-400 hover:text-[#A22C29] transition-opacity p-1 z-10 ${
                disabled || file.status === 'analyzing' ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label="Remove file"
            >
              ✕
            </button>

            {/* Indeterminate Progress Bar for analyzing state */}
            {file.status === 'analyzing' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-200 overflow-hidden">
                 <div className="h-full bg-[#B9A121] animate-[loading_1.5s_ease-in-out_infinite] w-1/2 origin-left"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
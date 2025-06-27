'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  disabled: boolean;
}

export default function FileUpload({ onFileUpload, isProcessing, disabled }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !disabled && !isProcessing) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, disabled, isProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.webm', '.mkv']
    },
    maxFiles: 1,
    disabled: disabled || isProcessing
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed border-gray-700 p-12 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-gray-500 bg-gray-900/50' : 'hover:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed border-gray-800' : ''}
          ${isProcessing ? 'border-gray-600' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="space-y-4">
            <div className="w-8 h-8 mx-auto border border-gray-600 rounded-full animate-spin border-t-white"></div>
            <div>
              <p className="text-sm font-medium tracking-wide">Processing</p>
              <p className="text-xs text-gray-500 mt-1">AI Agent analyzing file</p>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded">
              <div className="bg-white h-1 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ) : disabled ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Connect Wallet</p>
            <p className="text-xs text-gray-600">Wallet connection required</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl text-gray-600">⊕</div>
            <div>
              <p className="text-sm font-medium tracking-wide">
                {isDragActive ? 'Drop file here' : 'Drop file or click to upload'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Images, Videos • Max 50MB
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-600 space-y-1">
        <p>• Files processed via NEAR Shade Agents</p>
        <p>• Results stored on blockchain for verification</p>
      </div>
    </div>
  );
} 
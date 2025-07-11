import { useCallback } from 'react';

export default function FileUpload({ onFileUpload, isProcessing, disabled, selectedFile, onRemoveFile }) {
  const handleFileSelect = useCallback((file) => {
    if (!disabled && !isProcessing) {
      onFileUpload(file);
    }
  }, [onFileUpload, disabled, isProcessing]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    if (!disabled && !isProcessing) {
      document.getElementById('fileInput').click();
    }
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className={`
          border-2 border-dashed border-gray-700 p-12 text-center cursor-pointer transition-all
          hover:border-gray-600
          ${disabled ? 'opacity-50 cursor-not-allowed border-gray-800' : ''}
          ${isProcessing ? 'border-gray-600' : ''}
          ${selectedFile ? 'border-blue-500 bg-blue-900/10' : ''}
        `}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        
        {isProcessing ? (
          <div className="space-y-4">
            <div className="w-8 h-8 mx-auto border border-gray-600 rounded-full animate-spin border-t-white"></div>
            <div>
              <p className="text-sm font-medium tracking-wide">Processing in TEE</p>
              <p className="text-xs text-gray-500 mt-1">Shade Agent analyzing file</p>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded">
              <div className="bg-white h-1 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ) : disabled ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Worker Account Required</p>
            <p className="text-xs text-gray-600">TEE connection needed</p>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="text-4xl text-blue-500">
              {selectedFile.type.startsWith('image/') ? '🖼️' : '🎥'}
            </div>
            <div>
              <p className="text-sm font-medium tracking-wide text-white">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {onRemoveFile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove file
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl text-gray-600">⊕</div>
            <div>
              <p className="text-sm font-medium tracking-wide">
                Drop file or click to upload
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
        <p>• TEE-verified privacy protection</p>
        <p>• Results stored on blockchain</p>
      </div>
    </div>
  );
} 
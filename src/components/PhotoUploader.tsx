import React, { useRef } from 'react';

interface PhotoUploaderProps {
  label: string;
  sublabel?: string;
  photoUrl?: string;
  onPhotoChange: (url: string | undefined) => void;
  className?: string;
  aspectRatio?: string; // e.g., 'aspect-[3/4]' or custom styles
  maxDim?: number; // max width/height for compression
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  label,
  sublabel,
  photoUrl,
  onPhotoChange,
  className = '',
  aspectRatio = 'aspect-[3/4]',
  maxDim = 800,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress and normalize canvas size for optimal PDF & storage performance
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onPhotoChange(compressedDataUrl);
        } else {
          onPhotoChange(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative group cursor-pointer border-2 border-dashed border-[#1a2744]/30 hover:border-[#9d7f46] rounded-md bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all overflow-hidden flex flex-col items-center justify-center text-center ${aspectRatio} ${className}`}
      title={`Click or drag to upload ${label}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
      />

      {photoUrl ? (
        <div className="relative w-full h-full group">
          <img
            src={photoUrl}
            alt={label}
            className="w-full h-full object-cover rounded-sm"
          />
          {/* Overlay on hover for web view */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-white no-print">
            <span className="text-xs font-bold uppercase tracking-wider">📷 Change</span>
            <button
              onClick={handleRemove}
              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-[10px] font-bold text-white rounded shadow"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 flex flex-col items-center justify-center gap-1 text-[#1a2744]">
          <span className="text-lg leading-none no-print">📷</span>
          <div className="text-[9px] font-bold uppercase tracking-wider text-[#1a2744] leading-tight">
            {label}
          </div>
          {sublabel && (
            <div className="text-[7.5px] text-[#6b6b6b] leading-tight whitespace-pre-line">
              {sublabel}
            </div>
          )}
          <span className="text-[7px] text-[#9d7f46] font-semibold mt-0.5 no-print">
            Click to Upload
          </span>
        </div>
      )}
    </div>
  );
};

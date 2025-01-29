'use client';

export default function UploadingIndicator() {
  return (
    <div className="fixed bottom-8 right-[120px] z-50">
      <div className="bg-black/90 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          {/* Loading spinner */}
          <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
          <span className="text-white text-sm font-medium">Uploading</span>
        </div>
      </div>
    </div>
  );
} 
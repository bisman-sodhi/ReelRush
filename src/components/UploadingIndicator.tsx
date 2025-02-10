'use client';

export default function UploadingIndicator() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <p className="text-black">Uploading video...</p>
      </div>
    </div>
  );
} 
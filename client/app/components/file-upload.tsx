'use client';

import { Upload } from 'lucide-react';
import * as React from 'react';

const FileUploadComponent: React.FC = () => {
  const handleFileUploadButtonClick = async () => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');

    el.addEventListener('change', async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);

          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await fetch(`${apiUrl}/upload/pdf`, {
            method: 'POST',
            body: formData,
});


            if (response.ok) {
              console.log('File uploaded successfully');
            } else {
              console.error('File upload failed');
            }
          } catch (error) {
            console.error('Upload error:', error);
          }
        }
      }
    });

    el.click();
  };

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2">
      <button
        type="button"
        onClick={handleFileUploadButtonClick}
        className="flex justify-center items-center flex-col bg-transparent border-none cursor-pointer focus:outline-none"
      >
        <h3>Upload PDF File</h3>
        <Upload />
      </button>
    </div>
  );
};

export default FileUploadComponent;

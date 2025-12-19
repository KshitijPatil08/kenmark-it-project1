'use client';

import React, { useState } from 'react';

interface FileUploadProps {
    onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage({ text: 'Please select a file first', type: 'error' });
            return;
        }

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: 'File uploaded and processed successfully!', type: 'success' });
                setFile(null);
                // Clear input
                const input = document.getElementById('excel-upload') as HTMLInputElement;
                if (input) input.value = '';
                onUploadSuccess();
            } else {
                setMessage({ text: data.message || 'Failed to upload file', type: 'error' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ text: 'An unexpected error occurred during upload', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Upload Attendance Sheet</h2>

            <div className="flex flex-col gap-4">
                <label
                    htmlFor="excel-upload"
                    className="relative block w-full border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer group"
                >
                    <div className="flex flex-col items-center">
                        <svg
                            className="w-12 h-12 text-slate-400 group-hover:text-blue-500 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm font-medium text-slate-600">
                            {file ? file.name : "Click to select or drag and drop .xlsx file"}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">Accepts .xlsx files only</span>
                    </div>
                    <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 transition-all flex justify-center items-center gap-2"
                >
                    {uploading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : 'Upload and Analyze'}
                </button>

                {message && (
                    <div className={`mt-2 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;

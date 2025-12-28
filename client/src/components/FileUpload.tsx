import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setStatus('idle');
        setFileName(file.name);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:3001/api/ingest', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setStatus('success');
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.response?.data?.error || error.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>Knowledge Base</h3>

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    backgroundColor: isDragging ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                    position: 'relative'
                }}
            >
                <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                    accept=".pdf,.txt,.md"
                />

                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'var(--background)',
                        padding: '1rem',
                        borderRadius: '50%',
                        color: 'var(--primary)'
                    }}>
                        <Upload size={24} />
                    </div>
                    <div>
                        <p style={{ fontWeight: 500, color: 'var(--text-main)' }}>Click to upload or drag & drop</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>PDF, TXT, MD</p>
                    </div>
                </label>
            </div>

            <AnimatePresence>
                {status !== 'idle' || isUploading ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.875rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: status === 'error' ? '#fef2f2' : 'var(--background)',
                            border: status === 'error' ? '1px solid #fee2e2' : 'none'
                        }}
                    >
                        {isUploading ? (
                            <Loader2 className="animate-spin" size={18} color="var(--primary)" />
                        ) : status === 'success' ? (
                            <CheckCircle size={18} color="#10b981" />
                        ) : (
                            <AlertCircle size={18} color="#ef4444" />
                        )}

                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: status === 'error' ? '#ef4444' : 'inherit' }}>
                                {status === 'error' && errorMessage ? errorMessage : fileName}
                            </p>
                            <p style={{ color: status === 'error' ? '#ef4444' : 'var(--text-secondary)' }}>
                                {isUploading ? 'Uploading & Processing...' : status === 'success' ? 'Added to knowledge base' : 'Upload failed'}
                            </p>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};

export default FileUpload;

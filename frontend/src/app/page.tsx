"use client";
import React, { useState } from 'react';

export default function Home() {
  const [emailContent, setEmailContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailContent(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    let content = emailContent;
    if (file) {
      try {
        const text = await file.text();
        content = text;
      } catch (err) {
        setError('Failed to read file.');
        setLoading(false);
        return;
      }
    }
    if (!content.trim()) {
      setError('Please paste email content or upload a file.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/email/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailContent: content }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to process email.');
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Smart Order Intake</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white rounded shadow p-6 flex flex-col gap-4">
        <label className="font-semibold">Paste Email Content</label>
        <textarea
          className="border rounded p-2 min-h-[120px]"
          value={emailContent}
          onChange={handleTextChange}
          placeholder="Paste raw email content here..."
        />
        <div className="flex items-center gap-2">
          <span className="font-semibold">or Upload .txt File</span>
          <input type="file" accept=".txt" onChange={handleFileChange} />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
      </form>
      {result && (
        <div className="w-full max-w-2xl mt-8 bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-2">Parsed & Validated Order</h2>
          <pre className="bg-gray-100 rounded p-2 overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
          {result.issues && result.issues.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-red-600">Issues:</h3>
              <ul className="list-disc ml-6">
                {result.issues.map((issue: any, idx: number) => (
                  <li key={idx}>{issue.message}</li>
                ))}
              </ul>
            </div>
          )}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-blue-600">Suggestions:</h3>
              <ul className="list-disc ml-6">
                {result.suggestions.map((s: any, idx: number) => (
                  <li key={idx}>{s.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

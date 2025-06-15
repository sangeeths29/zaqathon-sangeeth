"use client";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Home() {
  const [emailContent, setEmailContent] = useState("");
  const [parsedOrder, setParsedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setParsedOrder(null);
    try {
      const response = await fetch("/api/email/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to parse email");
      setParsedOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmailContent("");
    setParsedOrder(null);
    setError("");
  };

  const handleDownloadJSON = () => {
    if (!parsedOrder) return;
    const blob = new Blob([JSON.stringify(parsedOrder, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parsed-order.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      setEmailContent(typeof event.target?.result === "string" ? event.target.result : "");
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">Smart Order Intake</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-6">
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 text-base min-h-[120px] resize-vertical"
            placeholder="Paste the email content here..."
            required
          />
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
            <label className="flex items-center cursor-pointer text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Upload Email File
              <input
                type="file"
                accept=".txt,.eml"
                onChange={handleFileUpload}
                className="block ml-2"
              />
            </label>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          >
            {loading ? (
              <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : null}
            Parse Email
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{String(error)}</p>}
        {typeof parsedOrder === "object" && parsedOrder !== null && (
          <div className="w-full mt-10 flex flex-col items-center">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 w-full">
              <h2 className="text-2xl font-bold text-gray-800">Parsed Order</h2>
              <button
                onClick={handleDownloadJSON}
                className="flex items-center px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-200 text-sm"
              >
                Download JSON
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto w-full">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap break-all">{JSON.stringify(parsedOrder, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
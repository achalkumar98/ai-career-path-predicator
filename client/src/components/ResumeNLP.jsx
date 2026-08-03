import { useState } from "react";
import axios from "axios";

export default function ResumeNLP() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume PDF first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 rounded-2xl shadow-xl p-8 w-full max-w-3xl mt-10">
      <h2 className="text-2xl font-bold text-white mb-4">📄 Resume Analyzer</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            console.log("Selected file:", e.target.files[0]);
            setFile(e.target.files[0]);
          }}
          className="block w-full text-sm bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white rounded-lg p-2"
        />

        {file && (
          <p className="text-sm text-gray-500">Selected: {file.name}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:cursor-pointer transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4 bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500">
          <div>
            <h3 className="font-semibold">🔍 Extracted Skills:</h3>
            <p>{result.extractedSkills?.join(", ") || "None found."}</p>
          </div>

          <div>
            <h3 className="font-semibold">📆 Experience (Years found):</h3>
            <p>{result.experienceYears?.join(", ") || "None found."}</p>
          </div>

          <div>
            <h3 className="font-semibold">📜 Resume Snippet:</h3>
            <pre className=" p-3 rounded max-h-64 overflow-y-auto text-sm whitespace-pre-wrap">
              {result.rawText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

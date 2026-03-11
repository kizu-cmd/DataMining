import { useState } from "react";
import { Upload, Play, FileSpreadsheet, CheckCircle } from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";

export const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const { isAnalyzing, runAnalysis, totalTransactions } = useAnalysis();
  const hasResults = totalTransactions > 0;

  const handleRun = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) runAnalysis(text);
    };
    reader.readAsText(file);
  };

  return (
    <section className="mb-10">
      <div className="kiosk-section-title">
        <div className="bg-primary/10 p-2 rounded-xl">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <h2>📤 Upload Transaction Data</h2>
      </div>
      <div className="kiosk-card p-6 bg-gradient-to-br from-card to-accent/5">
        <div className="flex items-start gap-4 mb-5">
          <div className="bg-accent/20 rounded-xl p-3 shrink-0">
            <FileSpreadsheet className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold">Import Transaction CSV</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload your restaurant transaction data to run Market Basket Analysis and refresh all dashboard insights automatically.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="cursor-pointer kiosk-card px-5 py-3 text-sm font-bold hover:bg-muted transition-colors flex items-center gap-2.5">
            <Upload className="w-4 h-4 text-primary" />
            {file ? file.name : "Choose CSV File"}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <button
            onClick={handleRun}
            disabled={!file || isAnalyzing}
            className="bg-primary text-primary-foreground font-extrabold text-sm py-3 px-8 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 hover:shadow-lg"
          >
            <Play className="w-4 h-4" />
            {isAnalyzing ? "Running Analysis…" : "Run Analysis"}
          </button>
        </div>
        {isAnalyzing && (
          <div className="mt-4 flex items-center gap-2 text-sm text-primary font-bold animate-pulse">
            <span className="text-xl">⏳</span>
            Processing transactions and discovering patterns…
          </div>
        )}
        {hasResults && !isAnalyzing && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-bold">
            <CheckCircle className="w-4 h-4" />
            Analysis complete! Dashboard updated with {totalTransactions} transactions.
          </div>
        )}
      </div>
    </section>
  );
};

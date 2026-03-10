import { useState } from "react";
import { Upload, Play } from "lucide-react";

export const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    if (!file) return;
    setRunning(true);
    setTimeout(() => setRunning(false), 2000);
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Upload Transaction Data</h2>
      </div>
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <p className="text-sm text-muted-foreground mb-4">
          Upload a CSV file containing transaction data to re-run the Market Basket Analysis and refresh dashboard insights.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="cursor-pointer bg-background border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
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
            disabled={!file || running}
            className="bg-primary text-primary-foreground font-bold text-sm py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {running ? "Running Analysis…" : "Run Analysis"}
          </button>
        </div>
        {running && (
          <p className="mt-3 text-sm text-primary font-medium animate-pulse">
            ⏳ Processing transactions and discovering patterns…
          </p>
        )}
      </div>
    </section>
  );
};

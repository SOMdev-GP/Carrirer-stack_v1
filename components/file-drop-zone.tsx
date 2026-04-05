"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

export function FileDropZone({ onFileSelect, file, onClear }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile &&
        (droppedFile.type === "application/pdf" ||
          droppedFile.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  if (file) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10 p-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{file.name}</p>
                <CheckCircle className="h-4 w-4 text-primary animate-in zoom-in duration-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB - Ready to analyze
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="rounded-lg p-2 text-muted-foreground transition-all duration-300 hover:bg-destructive/20 hover:text-destructive hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-chart-5 to-accent" />
      </div>
    );
  }

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-12 transition-all duration-500",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-secondary/30"
      )}
    >
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileInput}
        className="sr-only"
      />
      
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Upload icon with animation */}
      <div className={cn(
        "relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 transition-all duration-500",
        isDragging ? "scale-110 rotate-3" : "group-hover:scale-105"
      )}>
        <Upload className={cn(
          "h-10 w-10 text-primary transition-all duration-500",
          isDragging ? "animate-bounce" : "group-hover:animate-[bounce-subtle_2s_ease-in-out_infinite]"
        )} />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
      </div>
      
      <p className="relative mt-5 text-lg font-semibold text-foreground">
        {isDragging ? (
          <span className="gradient-text">Drop it here!</span>
        ) : (
          "Drop your resume here"
        )}
      </p>
      <p className="relative mt-2 text-sm text-muted-foreground">
        or <span className="text-primary font-medium">click to browse</span> (PDF, DOCX)
      </p>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </label>
  );
}

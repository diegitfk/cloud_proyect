"use client";

import { useEffect, useState } from "react";
import { FileTable } from "@/components/custom/FileTable";
import { useToast } from "@/hooks/use-toast";

interface FileData {
  name: string;
  type: string;
  size: number;
  created_at: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/transfers');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch files. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const response = await fetch(`/api/download_resource?namefile=${encodeURIComponent(fileName)}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File download started successfully",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file. Please try again later.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">File Explorer</h1>
      <FileTable 
        files={files}
        loading={loading}
        onDownload={handleDownload}
      />
    </div>
  );
}
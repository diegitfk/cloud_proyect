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
      console.error('Fallo al obtener los recursos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Fallo al obtener los recursos. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const response = await fetch(`/api/download_resource?namefile=${encodeURIComponent(fileName)}`);
      
      if (!response.ok) {
        throw new Error('Fallo al descargar el archivo');
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
        description: "El archivo se ha descargado correctamente.",
      });
    } catch (error) {
      console.error('Descarga fallida:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Fallo al descargar el archivo. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Compartido Conmigo</h1>
      <FileTable 
        files={files}
        loading={loading}
        onDownload={handleDownload}
      />
    </div>
  );
}
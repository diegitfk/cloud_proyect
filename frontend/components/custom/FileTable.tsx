"use client";

import { FileIcon, FileArchiveIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface FileData {
  name: string;
  type: string;
  size: number;
  created_at: string;
}

interface FileTableProps {
  files: FileData[];
  loading: boolean;
  onDownload: (fileName: string) => void;
}

export function FileTable({ files, loading, onDownload }: FileTableProps) {
  const formatSize = (size: number) => {
    if (size < 1) {
      return `${(size * 1024).toFixed(2)} KB`;
    }
    return `${size.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPp');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                Loading files...
              </TableCell>
            </TableRow>
          ) : files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10">
                No files found
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <TableRow key={file.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {file.name.endsWith('.zip') ? (
                      <FileArchiveIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileIcon className="h-5 w-5 text-gray-500" />
                    )}
                    {file.name}
                  </div>
                </TableCell>
                <TableCell>{formatSize(file.size)}</TableCell>
                <TableCell>{formatDate(file.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => onDownload(file.name)}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
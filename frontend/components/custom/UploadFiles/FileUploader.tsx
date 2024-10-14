'use client';
import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { FilePondFile } from 'filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Registra el plugin
registerPlugin(FilePondPluginImagePreview);

interface FileUploadProps {
  allowMultiple?: boolean;
  maxFiles?: number;
  server?: string;
}


const FileUpload: React.FC<FileUploadProps> = ({ allowMultiple = true, maxFiles = 3, server = '/api/upload' }) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full rounded-lg border-2 border-dashed">
      <style>
        {`
      .filepond--file-action-button {
        cursor: pointer;
      }
      .filepond--root {
        border-radius: 0.5rem;
        margin: 0;
      }
      .filepond--drop-label {
        color: #9ca3af;
      }
      .filepond--panel-root {
        background-color: #18181B;
        width: 100%;
      }
      .filepond--item-panel {
        background-color: #555;
      }
      .filepond--label-action {
        text-decoration-color: #16a34a;
        color: #16a34a;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .filepond--wrapper {
        width: 100%;
        height: auto;
      }
      .container-svg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    `}
      </style>
      <FilePond
        files={files}
        onupdatefiles={(fileItems: FilePondFile[]) => {
          setFiles(fileItems.map(fileItem => fileItem.file as File));
        }}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        server={server}
        className="filepond-input"
        labelIdle={`
          <div class='container-svg'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-upload">
              <path d="M0 0h24v24H0z" stroke="none"/>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5m-5-5v12"/>
            </svg>
          </div>
          Arrastra tus archivos o haz click para 
          <span class="filepond--label-action">
            Cargar tus archivos 
          </span>
        `}
        credits={false}
      />
    </div>
  );
};

export default FileUpload;

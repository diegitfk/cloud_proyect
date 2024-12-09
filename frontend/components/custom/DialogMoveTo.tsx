// src/components/MoveDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DriveItem } from "@/components/custom/CardsDrive"
import { DialogTitle } from '@radix-ui/react-dialog';

// Definir las props del componente
type MoveDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onMove: (newPath: string) => void;
  directories: string[];
  item: DriveItem | null;
};

const MoveDialog: React.FC<MoveDialogProps> = ({ isOpen, onClose, onMove, directories, item }) => {
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null);

  useEffect(() => {
    // Resetear el directorio seleccionado cuando se cierre el dialog
    if (!isOpen) {
      setSelectedDirectory(null);
    }
  }, [isOpen]);

  const handleMove = () => {
    if (selectedDirectory !== null && item) {
      // Si la ruta seleccionada es '/' (que corresponde a la cadena vacía en la API), enviar '' al backend
      const pathToSend = selectedDirectory === '/' ? '' : selectedDirectory;
      onMove(pathToSend); // Llamar a la función onMove pasando la nueva ruta
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mover {item?.name}</DialogTitle>
        </DialogHeader>
        {directories.length === 0 ? (
          <p>No hay directorios disponibles</p>
        ) : (
          directories.map((dir, index) => (
            <Button
              key={index}
              onClick={() => setSelectedDirectory(dir === '' ? '/' : dir)} // Mostrar '/' en lugar de ''
              className={`w-full text-left ${selectedDirectory === (dir === '' ? '/' : dir) ? 'bg-blue-100' : ''}`}
            >
              {dir === '' ? '/' : dir} {/* Mostrar '/' para el directorio vacío */}
            </Button>
          ))
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleMove} disabled={!selectedDirectory}>
            Mover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDialog;


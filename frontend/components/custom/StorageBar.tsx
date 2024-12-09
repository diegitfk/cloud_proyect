"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

export function Storage_bar() {
  const [progress, setProgress] = React.useState(0);
  const [sizeUsed, setSizeUsed] = React.useState<number | null>(null);
  const [limitStr, setLimitStr] = React.useState<number | null>(null);

  // Evitar el null
  const limit = limitStr ?? 2.0;

  React.useEffect(() => {
    // FUNCION PARA OBTENER EL TAMAÑO DEL DIRECTORIO
    async function getSize() {
      try {
        const response = await fetch("/api/size_dir");
        const data = await response.json();

        if (data?.newDir !== undefined) {
          const usedSize = parseFloat(data.newDir);
          setSizeUsed(usedSize);
        } else if (response.status === 401) {
          console.log("Expire Credentials");
        } else if (response.status === 403) {
          console.log("Access Denied");
        }
      } catch (error) {
        console.error("Error al obtener el tamaño del directorio:", error);
      }
    }

    // FUNCION PARA OBTENER LA MEMORIA LIMITE DEL PLAN
    async function getPlanMemory() {
      try {
        const response = await fetch("/api/plan_memory");
        const data = await response.json();

        if (data?.newDir !== undefined) {
          const planSize = parseFloat(data.newDir); 
          setLimitStr(planSize); 
        } else if (response.status === 401) {
          console.log("Expire Credentials");
        } else if (response.status === 403) {
          console.log("Access Denied");
        }
      } catch (error) {
        console.error("Error al obtener el tamaño del plan:", error);
      }
    }

    getPlanMemory();
    getSize();
  }, []);

  React.useEffect(() => {
    if (sizeUsed !== null && limitStr !== null) {
      setProgress((sizeUsed / limitStr) * 100);
    }
  }, [sizeUsed, limitStr]);

  const progressFillColor = progress >= 80 ? "bg-red-500" : "bg-white";

  return (
    <div className="ps-3 pt-10">
      <div className="relative w-[90%] h-2 rounded-full bg-gray-500">
        <div
          className={`h-full ${progressFillColor} rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center pe-5 pt-2">
        {sizeUsed} GB de {limitStr} GB utilizados
      </p>
    </div>
  );
}
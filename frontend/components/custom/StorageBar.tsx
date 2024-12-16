"use client";

import * as React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Storage_bar() {
  // Fetch estático para plan_memory (no necesita revalidarse)
  const { data: planData, error: planError } = useSWR("/api/plan_memory", fetcher, { revalidateOnFocus: false , refreshInterval : 3000 });

  // Fetch dinámico para size_dir (revalidación automática)
  const { data: sizeData, error: sizeError } = useSWR("/api/size_dir", fetcher);

  // Estado local para controlar el progreso con animación
  const [progress, setProgress] = React.useState(0);

  // Parsear los datos
  const sizeUsed = sizeData?.newDir ? parseFloat(sizeData.newDir) : null;
  const limitStr = planData?.newDir ? parseFloat(planData.newDir) : 2.0;

  // Actualización gradual del progreso
  React.useEffect(() => {
    if (sizeUsed !== null && limitStr !== null) {
      const newProgress = (sizeUsed / limitStr) * 100;
      setProgress(newProgress);
    }
  }, [sizeUsed, limitStr]);

  const progressFillColor = progress >= 80 ? "bg-red-500" : "bg-white";

  // Manejo de errores
  if (sizeError || planError) {
    console.error("Error fetching data:", sizeError || planError);
    return <div>Error al cargar los datos</div>;
  }

  // Estado de carga
  if (!sizeData || !planData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="ps-3 pt-10">
      <div className="relative w-[90%] h-2 rounded-full bg-gray-500 overflow-hidden">
        <div
          className={`h-full ${progressFillColor} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center pe-5 pt-2">
        {sizeUsed} GB de {limitStr} GB utilizados
      </p>
    </div>
  );
}

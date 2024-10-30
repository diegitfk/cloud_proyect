"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"

export function Storage_bar() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="ps-3 pt-10">
        <Progress value={progress} className="w-[90%]" />
        <p className="text-center pe-5 pt-2">76GB de 100 utilizados</p>
    </div>
    )
}

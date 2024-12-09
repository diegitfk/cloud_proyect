'use client'
import { IconCloud } from "@/components/ui/icon-cloud";

const slugs = [
  "typescript",
  "react",
  "html5",
  "css3",
  "nodedotjs",
  "nextdotjs",
  "nginx",
  "vercel",
  "docker",
  "git",
  "github",
  "visualstudiocode",
  "fastapi",
  "Beanie",
];

export function IconCloudTech() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8 ">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}

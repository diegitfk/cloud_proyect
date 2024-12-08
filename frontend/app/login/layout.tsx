import Meteors from "@/components/ui/mateors"
import { Toaster } from "@/components/ui/toaster"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-w-screen overflow-hidden items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <Meteors number={40} />
      </div>
      {children}
      <Toaster />
    </div>
  )
}
'use client'
import { Button } from "@/components/ui/button"
import { CircleCheckBig } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PlanPricing {
  id: number,
  name: string;
  price: string;
  description: string;
  features: string[];
  image: string;
  button: string;
  style: string;
}

const PlanPricing = () => {
  const plans: PlanPricing[] = [
    {
      id: 1,
      name: "Starter",
      price: "$9",
      description: 'Comienza con nuestro plan básico',
      features: ["5 GB Almacenamiento", "Banda ancha ilimitada", "1 usuario"],
      image: '/images/basic.webp',
      button: 'Suscríbete a Basic',
      style: 'bg-card rounded-lg overflow-hidden shadow-lg max-w-[400px] md:w-full mx-auto'
    },
    {
      id: 2,
      name: "Medium",
      price: "$19",
      description: 'Nuestro plan más popular',
      features: ["20 GB Almacenamiento", "Banda ancha ilimitada", "5 usuarios"],
      image: '/images/medium.webp',
      button: 'Suscríbete a Medium',
      style: 'bg-card rounded-lg overflow-hidden shadow-lg max-w-[400px] md:w-full mx-auto border-2 border-purple-500'
    },
    {
      id: 3,
      name: "Pro",
      price: "$49",
      description: 'Para grandes equipos y empresas',
      features: ["50 GB Almacenamiento", "Banda ancha ilimitada", "10 usuarios"],
      image: '/images/enterprise.webp',
      button: 'Suscríbete a Pro',
      style: 'bg-card rounded-lg overflow-hidden shadow-lg max-w-[400px] md:w-full mx-auto'
    },
  ]
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {plans.map((plan, index) => (
        <div key={index} className={plan.style}>
          <div className="relative overflow-hidden h-[200px] md:h-[300px] group">
            <Image
              src={plan.image}
              alt={`${plan.name} Plan Image`}
              width={660}
              height={495}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
              style={{ aspectRatio: "660/495", objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-sm">{plan.description}</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/Mensual</span>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <CircleCheckBig className="mr-2 inline-block h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              className="w-full hover:bg-green-600 hover:text-white"
              asChild>
              <Link href="/login/register">{plan.button}</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlanPricing;

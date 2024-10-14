// components/AboutUs.tsx
import { Button } from "@/components/ui/button"; // Asumiendo que el componente de botón viene de ShadCN

const AboutUs = () => {
  return (
    <section id="about-us" className="py-16 min-h-screen">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Acerca de Nosotros
          </h2>
          <p className="text-lg ">
            En <span className="font-semibold">Nuestra Empresa</span>, nos
            dedicamos a ofrecer soluciones innovadoras para el crecimiento de
            su negocio. Con años de experiencia en el mercado, nuestro enfoque
            es brindarle las herramientas tecnológicas que necesita para
            prosperar en el mundo digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-3">
              Nuestra Misión
            </h3>
            <p className=" leading-relaxed">
              Nuestra misión es empoderar a las empresas con soluciones
              tecnológicas avanzadas y servicios personalizados. Nos
              esforzamos por ofrecer productos de alta calidad que maximicen el
              valor para nuestros clientes.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold  mb-3">
              Nuestros Valores
            </h3>
            <ul className="list-disc list-inside  leading-relaxed">
              <li>Innovación continua</li>
              <li>Compromiso con la calidad</li>
              <li>Atención personalizada</li>
              <li>Trabajo en equipo</li>
              <li>Responsabilidad social</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="default" className="px-6 py-3">
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
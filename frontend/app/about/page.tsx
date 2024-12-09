'use client'
import React from 'react'
import NavBarLayout from '@/components/custom/NavBarLayout'
import Link from 'next/link';

const AboutUs: React.FC = () => {
  return (
    <>
      <NavBarLayout />
      <main
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/background_contact.svg)',
        }}
      >
        <div className="container mx-auto h-full px-4 py-10">
          <div className="text-center mx-auto mb-10 animate-fade-down animate-once animate-duration-200 animate-delay-200">
            <h2 className="font-semibold text-3xl">Acerca de Nosotros</h2>
            <h1 className="font-bold text-5xl py-2 tracking-widest">Conoce CloudingDrive</h1>
            <p className="text-lg font-normal max-w-3xl mx-auto">
              En CloudingDrive, trabajamos apasionadamente para ofrecerte un servicio de almacenamiento seguro y confiable en la nube.
              Creemos en la importancia de proteger tus datos y facilitar tu vida digital.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 mx-auto content-center">
            <div className="max-w-lg mx-auto p-6 bg-secondary rounded-lg shadow-lg text-left">
              <h3 className="text-2xl font-semibold mb-4">Nuestra Misión</h3>
              <p className="text-base font-normal">
                Brindar soluciones de almacenamiento digital accesibles y seguras para todos, promoviendo la colaboración y el
                acceso inmediato a tus archivos desde cualquier lugar y en cualquier momento.
              </p>
            </div>
            <div className="max-w-lg mx-auto p-6 bg-secondary rounded-lg shadow-lg text-left">
              <h3 className="text-2xl font-semibold mb-4">Nuestros Valores</h3>
              <p className="text-base font-normal">
                En CloudingDrive, nos enfocamos en la seguridad, la privacidad y la innovación constante. Nos comprometemos a mejorar
                cada día para brindarte la mejor experiencia posible.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 mx-auto mt-8 content-center">
            <div className="max-w-lg mx-auto p-6 bg-secondary rounded-lg shadow-lg text-left">
              <h3 className="text-2xl font-semibold mb-4">Nuestro Equipo</h3>
              <p className="text-base font-normal">
                Somos un grupo diverso de profesionales apasionados por la tecnología y dedicados a hacer de CloudingDrive la
                plataforma de almacenamiento en la nube que necesitas.
              </p>
            </div>
            <div className="max-w-lg mx-auto p-6 bg-secondary rounded-lg shadow-lg text-left">
              <h3 className="text-2xl font-semibold mb-4">Contáctanos</h3>
              <p className="text-base font-normal">
                ¿Tienes preguntas? No dudes en ponerte en contacto con nosotros a través de nuestro
                <Link href="/contact">
                  <span className="font-bold text-blue-500 hover:underline"> formulario de contacto</span>
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AboutUs;

'use client'
import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import NavBarLayout from '@/components/custom/NavBarLayout'
import SendIcon from '@/public/icons/sendicon.svg'

interface ContactFormProps {
  onSubmit: (name: string, email: string, message: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(name, email, message);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <NavBarLayout />
      <main className='h-full' style={{
        backgroundImage: 'url(/images/background_contact.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container px-4 mx-auto h-full">
          <div className='container text-center mx-auto py-10 text-whit animate-fade-down animate-once animate-duration-200 animate-delay-200 animate-ease-out animate-alternate animate-fill-backwards'>
            <h2 className='font-semibold text-3xl'>Atención al cliente</h2>
            <h1 className='font-bold tracking-widest text-5xl py-2'>¿Necesitas ayuda?</h1>
            <p className='text-lg font-normal max-w-3xl mx-auto'>En CloudingDrive estamos para escuchar tus sugerencias, reclamos y contribuciones con la finalidad de mejorar nuestros servicios.</p>
          </div>
          <div className=" mx-auto p-3 content-center">
            <div className=" max-w-md mx-auto p-8 bg-secondary rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4 animate-fade-left animate-once animate-duration-200 animate-delay-250 animate-ease-out animate-normal animate-fill-backwards">Contacte con nosotros</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4 animate-fade-left animate-once animate-duration-[80ms] animate-delay-200 animate-ease-out animate-normal animate-fill-backwards">
                  <Label className="block mb-2" htmlFor="name">
                    Ingrese su nombre
                  </Label>
                  <Input
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300"
                    placeholder="John Doe"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4 animate-fade-left animate-once animate-duration-[80ms] animate-delay-[400ms] animate-ease-out animate-normal animate-fill-backwards">
                  <Label className="block mb-2" htmlFor="email">
                    Ingrese su email
                  </Label>
                  <Input
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300"
                    placeholder="Ejemplo: correo@gmail.com"
                    name="email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4 animate-fade-left animate-once animate-duration-[80ms] animate-delay-[600ms] animate-ease-out animate-normal animate-fill-backwards">
                  <Label className="block mb-2" htmlFor="message">
                    Escriba su mensaje
                  </Label>
                  <Textarea
                    className="w-full px-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300"
                    rows={4}
                    placeholder="Me gustaría conocer más acerca de los servicios que presta CloudingDrive"
                    name="message"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></Textarea>
                </div>
                <div className='flex content-center animate-fade-up animate-once animate-duration-100 animate-delay-[800ms] animate-ease-out animate-alternate animate-fill-backwards'>
                  <Button type='submit' className="mx-auto group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-950 font-medium text-neutral-200 transition-all duration-300 hover:w-32 hover:bg-blue-600">
                    <div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100">
                      Enviar
                    </div>
                    <div className="absolute right-3.5">
                      <SendIcon className="w-6 h-6 text-white" />
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactForm;
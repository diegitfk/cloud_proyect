import { z } from "zod";

export const formSchema = z.object({
  username: z.string()
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres.",
    })
    .max(20, {
      message: "El nombre de usuario no puede tener más de 20 caracteres.",
    }),
  nombre: z.string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(20, {
      message: "El nombre no puede tener más de 20 caracteres.",
    }),
  apellido: z.string()
    .min(2, {
      message: "El apellido debe tener al menos 2 caracteres.",
    })
    .max(20, {
      message: "El apellido no puede tener más de 20 caracteres.",
    }),
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string()
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
  plan: z.string()
    .optional()
    .or(z.literal('')),
});
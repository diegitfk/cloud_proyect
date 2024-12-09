import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps {
  isLoading: boolean;
  isRedirecting?: boolean; // Prop opcional
  disabled?: boolean; // Prop opcional
  children?: React.ReactNode; // Para permitir texto personalizado
  className?: string; // Para permitir estilos personalizados
}

const LoadingButton: React.FC<LoadingButtonProps> = React.memo(
  ({ isLoading, isRedirecting, disabled, children, className }) => {
    return (
      <Button
        className={`w-full hover:bg-green-600 hover:text-white ${className}`}
        type="submit"
        disabled={disabled}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <Loader2 className="h-4 w-4" />
            </motion.div>
            {isRedirecting ? "Redirigiendo..." : "Verificando credenciales..."}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

export default LoadingButton;

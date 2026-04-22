import { LoginCard } from "@/components/login-card";
import Image from "next/image"; // 1. Importa el componente
import logoCbta from "@/public/sources/cbta.png"; // Importación directa

export default function Login() {
  return (
    <div className='flex flex-col items-center justify-center'>
      {/* 2. La ruta empieza desde / porque lo que está en public es la raíz */}
      <Image 
        src={logoCbta} 
        alt="Logo CBTa"
        width={250}
        height={250}
        priority
        className="h-auto w-auto" // Mantiene la proporción
      />
      <LoginCard/>
    </div>
  );
}

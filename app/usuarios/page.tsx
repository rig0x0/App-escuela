import { UsersForm } from "@/components/dialog-create";

export default function UsuariosPage() {
  return (
    <div>
        <div className="m-5 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">Usuarios</h1>
                <p className="text-gray-600 dark:text-gray-400">Gestiona los usuarios del sistema.</p>
            </div>
            <UsersForm/>
        </div>
    </div>
  )
}


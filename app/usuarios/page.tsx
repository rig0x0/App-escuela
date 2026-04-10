import { UsersForm } from "@/components/dialog-create";
import { LimitSelector } from "@/components/limit-selector";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUsuarios } from "../actions/usuarios-actions";
import { PaginationControls } from "@/components/pagination";
import { RoleFilter } from "@/components/role-filter";
import { SearchInput } from "@/components/search-input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ButtonActions from "@/components/button-actions";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string; limit?: string }>;
}) {
  // 2. ¡ESTO ES LO VITAL! Resolvemos la promesa primero
  const params = await searchParams;

  // 3. Ahora usamos 'params' en lugar de 'searchParams'
  const query = params.q || '';
  const role = params.role || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;

  // En page.tsx, puedes dejarlo así de limpio:
  const { usuarios, totalPages, error } = await getUsuarios({ query, role, page, limit });

  // Solo añade una validación por si quieres mostrar el mensaje de error
  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <div className="m-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">Usuarios</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los usuarios del sistema.</p>
        </div>
        <UsersForm />
      </div>
      <Card className="mx-5">


        <CardHeader>
          <div className="flex justify-between">
            {/* BUSCADOR */}
            <div className="w-100 space-y-2">
              <Label>Buscar</Label>
              <SearchInput defaultValue={query} />
            </div>

            {/* FILTRO DE ROLES */}
            <div className="flex">
              <div className="w-48 space-y-2">
                <Label>Rol</Label>
                <RoleFilter defaultValue={role} />
              </div>

              {/* SELECT DE CANTIDAD POR PÁGINA */}
              <div className="w-32 space-y-2">
                <Label>Por página</Label>
                <LimitSelector defaultValue={limit.toString()} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                {/*<TableHead>Telefono</TableHead>*/}
                <TableHead>Rol</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios?.map((u, index) => (
                <TableRow key={u.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  {/*<TableCell>{u.telefono}</TableCell>*/}
                  <TableCell>{u.tipo}</TableCell>
                  <TableCell className="text-center">
                    {/* Le pasamos el ID y el nombre de cada usuario */}
                    <ButtonActions userId={u.id} userName={u.nombre} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* COMPONENTE DE PAGINACIÓN */}
          <PaginationControls totalPages={totalPages} currentPage={page} />
        </CardContent>

      </Card>
    </div>
  )
}


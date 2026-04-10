-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Alumno" (
    "usuarioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matricula" TEXT NOT NULL,
    "grado" TEXT NOT NULL,
    CONSTRAINT "Alumno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Docente" (
    "usuarioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "departamento" TEXT,
    CONSTRAINT "Docente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Administrativo" (
    "usuarioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "puesto" TEXT NOT NULL,
    CONSTRAINT "Administrativo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Semestre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT
);

-- CreateTable
CREATE TABLE "AsignacionDocente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docenteId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "semestreId" INTEGER NOT NULL,
    CONSTRAINT "AsignacionDocente_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente" ("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AsignacionDocente_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AsignacionDocente_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "semestreId" INTEGER NOT NULL,
    CONSTRAINT "Grupo_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alumnoId" INTEGER NOT NULL,
    "grupoId" INTEGER NOT NULL,
    CONSTRAINT "Inscripcion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno" ("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inscripcion_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alumnoId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "grupoId" INTEGER NOT NULL,
    "semestreId" INTEGER NOT NULL,
    "calificacion" REAL NOT NULL,
    "tipoEval" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Calificacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno" ("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Calificacion_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Calificacion_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Calificacion_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semestre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diaSemana" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "aula" TEXT NOT NULL,
    "asignacionId" INTEGER NOT NULL,
    CONSTRAINT "Horario_asignacionId_fkey" FOREIGN KEY ("asignacionId") REFERENCES "AsignacionDocente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_matricula_key" ON "Alumno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Semestre_nombre_key" ON "Semestre"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionDocente_docenteId_materiaId_semestreId_key" ON "AsignacionDocente"("docenteId", "materiaId", "semestreId");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_alumnoId_grupoId_key" ON "Inscripcion"("alumnoId", "grupoId");

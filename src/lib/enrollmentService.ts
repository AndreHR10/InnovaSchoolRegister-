import { supabase } from "./supabase";
import type { DocumentData, EnrollmentForm } from "../types/enrollment";
import { SEDES } from "../data/sedes";

type DocumentKey = Exclude<keyof DocumentData, "uploadedFiles">;

const DOCUMENT_LABELS: Record<DocumentKey, string> = {
  birthCertificate: "Partida de Nacimiento",
  dniCopy: "DNI Estudiante",
  photos: "Fotografías recientes",
  reportCard: "Libreta de Notas / Certificado de Estudios",
  medicalCert: "Certificado Médico",
  vaccinationCard: "Tarjeta de Vacunación",
};

// 🌟 Diccionarios de mapeo para convertir strings del frontend a los IDs de Supabase
const mapeoSedes: Record<string, number> = {
  "los-olivos": 1,
  "los_olivos": 1,
  "los olivos": 1,
  "san-miguel": 2,
  "san_miguel": 2,
  "san miguel": 2,
  "surco": 3,
  "ate": 4,
  "san-juan-de-lurigancho": 5,
  "san_juan_de_lurigancho": 5,
  "s.j.l.": 5,
  "callao": 6,
  "comas": 7,
  "villa-el-salvador": 8,
  "villa_el_salvador": 8,
  "v.e.s.": 8,
  "chorrillos": 9,
  "brena": 10,
  "breña": 10
};

const mapeoTurnos: Record<string, number> = {
  "manana": 1,
  "mañana": 1,
  "turno-manana": 1,
  "turno_manana": 1,
  "tarde": 2,
  "turno-tarde": 2,
  "turno_tarde": 2
};

const generateMatriculaCode = () =>
  `INN-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 10000)}`;

const normalizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

export async function submitEnrollment(form: EnrollmentForm) {
  const codigo_matricula = generateMatriculaCode();
  const parentPayload = {
    dni_apoderado: form.parent.dni,
    vinculo: form.parent.relationship,
    nombres: form.parent.firstName,
    apellidos: form.parent.lastName,
    ocupacion: form.parent.occupation,
    correo_electronico: form.parent.email,
    telefono_celular: form.parent.phone,
    contacto_emergencia: form.parent.emergencyContact,
    telefono_emergencia: form.parent.emergencyPhone,
    direccion_completa: form.parent.address,
    distrito: form.parent.district,
  };

  const { error: apoderadoError } = await supabase.from("apoderados").insert(parentPayload);
  if (apoderadoError) {
    return { success: false, error: `Error registrando apoderado: ${apoderadoError.message}` };
  }

  const studentPayload = {
    dni_estudiante: form.student.dni,
    nombres: form.student.firstName,
    apellidos: form.student.lastName,
    fecha_nacimiento: form.student.birthDate,
    genero: form.student.gender,
    necesidades_especiales: form.student.specialNeeds || null,
    nivel_academico: form.student.level,
    grado_postula: form.student.grade,
    colegio_procedencia: form.student.previousSchool || null,
    dni_apoderado: form.parent.dni,
  };

  const { error: estudianteError } = await supabase.from("estudiantes").insert(studentPayload);
  if (estudianteError) {
    return { success: false, error: `Error registrando estudiante: ${estudianteError.message}` };
  }

  const selectedSede = SEDES.find((sede) => sede.id === form.sede.sede);
  const montoPagado = selectedSede?.matrícula ?? 0;

  // 🌟 Normalización de los valores a minúsculas para buscar su ID correspondiente
  const sedeKey = String(form.sede.sede).toLowerCase().trim();
  const turnoKey = String(form.sede.turn).toLowerCase().trim();

  // 🌟 Mapeo seguro con un "fallback" por si el valor no coincide (asigna ID 1 por defecto)
  const idSedeNumerico = mapeoSedes[sedeKey] || 1;
  const idTurnoNumerico = mapeoTurnos[turnoKey] || 1;

  const matriculaPayload = {
    codigo_matricula,
    dni_estudiante: form.student.dni,
    id_sede: idSedeNumerico,   // ✅ Ahora envía un Integer correcto
    id_turno: idTurnoNumerico, // ✅ Ahora envía un Integer correcto
    estado_matricula: "Pendiente de Validación",
  };

  const { error: matriculaError } = await supabase.from("matriculas").insert(matriculaPayload);
  if (matriculaError) {
    return { success: false, error: `Error registrando matrícula: ${matriculaError.message}` };
  }

  const paymentPayload = {
    codigo_matricula,
    monto_pagado: montoPagado,
    metodo_pago: form.payment.method || "no especificado",
    url_comprobante: null,
    estado_pago: "Pendiente de Validación",
    acepto_terminos: form.payment.acceptTerms,
    acepto_privacidad: form.payment.acceptPrivacy,
  };

  const uploadTasks = [] as Array<Promise<{ success: boolean; error?: string }>>;

  const uploadedFiles = form.documents.uploadedFiles ?? {};
  for (const [key, file] of Object.entries(uploadedFiles)) {
    const documentKey = key as DocumentKey;
    const extension = file.name.split(".").pop() || "bin";
    const filename = normalizeFileName(`${documentKey}-${Date.now()}.${extension}`);
    const path = `${form.student.dni}/${filename}`;
    const bucket = "documentos-matricula";

    uploadTasks.push(
      (async () => {
        const { error: storageError } = await supabase.storage.from(bucket).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (storageError) {
          return { success: false, error: `Error subiendo archivo ${file.name}: ${storageError.message}` };
        }

        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
        const url_archivo = publicData?.publicUrl || path;
        const documentoPayload = {
          codigo_matricula,
          tipo_documento: DOCUMENT_LABELS[documentKey] ?? documentKey,
          url_archivo,
          estado_verificacion: "Pendiente",
        };

        const { error: documentoError } = await supabase.from("documentos_estudiante").insert(documentoPayload);
        if (documentoError) {
          return { success: false, error: `Error insertando documento ${file.name}: ${documentoError.message}` };
        }

        return { success: true };
      })()
    );
  }

  uploadTasks.push(
    (async () => {
      const { error: pagoError } = await supabase.from("pagos_matricula").insert(paymentPayload);
      if (pagoError) {
        return { success: false, error: `Error registrando pago: ${pagoError.message}` };
      }
      return { success: true };
    })()
  );

  const results = await Promise.all(uploadTasks);
  const failed = results.find((result) => !result.success);
  if (failed) {
    return { success: false, error: failed.error ?? "Error en la creación de documentos o pago." };
  }

  return { success: true, codigo_matricula };
}
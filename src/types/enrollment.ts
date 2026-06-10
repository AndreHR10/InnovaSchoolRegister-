export type Step = 1 | 2 | 3 | 4 | 5;

export interface StudentData {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  specialNeeds: string;
  level: string;
  grade: string;
  previousSchool: string;
  showLevels?: boolean;
}

export interface ParentData {
  relationship: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  occupation: string;
  address: string;
  district: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface SedeData {
  sede: string;
  turn: string;
  schedule: string;
}

export interface DocumentData {
  birthCertificate: boolean;
  dniCopy: boolean;
  photos: boolean;
  reportCard: boolean;
  medicalCert: boolean;
  vaccinationCard: boolean;
  uploadedFiles?: Record<string, File>;
}

export interface PaymentData {
  method: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface EnrollmentForm {
  student: StudentData;
  parent: ParentData;
  sede: SedeData;
  documents: DocumentData;
  payment: PaymentData;
}

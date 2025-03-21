import mongoose from 'mongoose';

import { PatientType } from '@/typesBE';

type PatientDoc = mongoose.Document & PatientType;

const Schema = mongoose.Schema;

const patientSchema = new Schema<PatientType>({
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required'],
    unique: false,
    trim: true,
  },
  amka: {
    type: String,
    required: [true, 'AMKA is required'],
    unique: false,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    unique: false,
    lowercase: false,
    trim: false,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    unique: false,
    lowercase: false,
    trim: false,
  },
  dob: {
    type: String,
    required: false,
    unique: false,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    unique: false,
    lowercase: true,
  },
  email: {
    type: String,
    unique: false,
    lowercase: true,
  },
  address: {
    type: String,
    unique: false,
    lowercase: false,
  },
  city: {
    type: String,
    unique: false,
    lowercase: false,
  },
  extraDetails: {
    type: String,
    required: false,
    unique: false,
    lowercase: false,
  },
  history: [
    {
      appointmentDate: {
        type: String,
        required: [true, 'Appointment Date is required'],
      },
      fullMouthTasks: {
        type: [String],
        required: false,
      },
      teethTasks: {
        type: [Object],
        required: false,
        toothId: {
          type: String,
          required: [true, 'Tooth Id is required'],
        },
        tasks: {
          type: [String],
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
      },
      files: {
        type: [Object],
        required: false,
        uniqueId: {
          type: String,
          required: [true, 'Unique Id is required'],
        },
        name: {
          type: String,
          required: [true, 'File name is required'],
        },
        uploadFileType: {
          type: String,
          required: [true, 'File type is required'],
        },
        size: {
          type: Number,
          required: [true, 'File size is required'],
        },
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

patientSchema.index({ doctorId: 1, amka: 1 }, { unique: true });

const model =
  mongoose.models.Patient ||
  mongoose.model<PatientDoc>('Patient', patientSchema);

export default model;

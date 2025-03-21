import mongoose from 'mongoose';

import { CalendarEventType } from '@/typesBE';

type CalendarEventDoc = mongoose.Document & CalendarEventType;

const Schema = mongoose.Schema;

const calendarEventSchema = new Schema<CalendarEventType>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: false,
    lowercase: true,
    trim: false,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    unique: false,
  },
  startingTime: {
    type: String,
    required: [true, 'Starting time is required'],
    unique: false,
    lowercase: true,
    trim: false,
  },
  endingTime: {
    type: String,
    required: [true, 'Ending time is required'],
    unique: false,
    lowercase: true,
    trim: false,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    unique: false,
    lowercase: false,
    trim: false,
  },
  description: {
    type: String,
    required: false,
    unique: false,
    lowercase: false,
    trim: false,
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    unique: false,
    lowercase: false,
    trim: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const model =
  mongoose.models.CalendarEvent ||
  mongoose.model<CalendarEventDoc>('CalendarEvent', calendarEventSchema);

export default model;

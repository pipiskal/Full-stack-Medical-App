import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { SPECIALTIES } from '@/modules/constants';
import { UserBEType } from '@/typesBE';

type UserDoc = mongoose.Document & UserBEType;

const Schema = mongoose.Schema;

const userSchema = new Schema<UserBEType>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    // minlength: [8, 'Password must be at least 8 characters'],
    select: false,
    trim: true,
  },
  passwordConfirm: {
    type: String,
    required: false,
    validate: {
      // this only works on CREATE and SAVE!!!
      validator: function (el: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return el === (this as any).password;
      },
      message: 'Passwords are not the same!',
    },
    select: false,
    trim: true,
    passwordChangedAt: Date,
  },
  firstName: {
    type: String,
    required: [true, 'Email is required'],
    unique: false,
    lowercase: false,
    trim: false,
  },
  lastName: {
    type: String,
    required: [true, 'Email is required'],
    unique: false,
    lowercase: false,
    trim: false,
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    enum: {
      values: SPECIALTIES,
      message: 'Specialty is either: dentist or physician',
    },
  },
  subscriptionPlan: {
    type: String,
    required: [true, 'Subscription plan is required'],
    enum: {
      values: ['trial', 'monthly', 'yearly'],
      message: 'Subscription plan is either: trial, monthly or yearly',
    },
  },
  isSubscriptionActive: {
    type: Boolean,
    required: [true, 'Subscription status is required'],
    default: false,
  },
  isSubscriptionSuspended: {
    type: Boolean,
    required: [true, 'Subscription status is required'],
    default: false,
  },
  isSubscriptionCanceled: {
    type: Boolean,
    required: [true, 'Subscription status is required'],
    default: false,
  },
  preferableLanguage: {
    type: String,
    enum: {
      values: ['el', 'en'],
      message: 'Preferable language is either: en or el',
    },
  },
  createdAt: {
    type: Date,
    required: [true, 'Created at is required'],
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: [true, 'Updated at is required'],
    default: Date.now(),
  },
});

// userSchema.pre('save', function (next) {
//   // only run following code if password was actually modified
//   if (this.isModified('password')) {
//     // hash the password with cost of 12
//     this.password = bcrypt.hashSync(this.password, 12);

//     // delete passwordConfirm field
//     this.passwordConfirm = undefined;
//   }
//   next();
// });

// Instance method to check if password is correct
userSchema.methods.comparePasswords = async (
  candidatePassword: string,
  userPassword: string
) => await bcrypt.compare(candidatePassword, userPassword);

const model =
  mongoose.models.User || mongoose.model<UserDoc>('User', userSchema);

export default model;

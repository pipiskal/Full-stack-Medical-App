import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import UserModel from '@/models/UserModel';
import {
  generateCatchErrorResponse,
  generateResponse,
} from '@/modules/helpersBE';
import { HTTPMethods, UserDoc } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST];

const registerNewUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      specialty,
      preferableLanguage,
    } = JSON.parse(req.body);
    // TODO Validate the body values

    const areAllFieldsProvided =
      firstName && lastName && email && password && specialty;

    if (areAllFieldsProvided) {
      await connectDB();
      const existedUser = await UserModel.findOne({ email });

      if (existedUser && existedUser.email === email) {
        return generateResponse(res, false, 'User already exists', 409);
      } else {
        const encryptedPassword = bcrypt.hashSync(password, 12);

        const user: UserDoc = await UserModel.create({
          email,
          password: encryptedPassword,
          firstName,
          lastName,
          specialty,
          subscriptionPlan: 'trial',
          isSubscriptionActive: true,
          isSubscriptionSuspended: false,
          isSubscriptionCanceled: false,
          preferableLanguage: preferableLanguage || 'el',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return generateResponse(res, true, 'User created', 201, user);
      }
    } else {
      return generateResponse(res, false, 'All fields are required', 400);
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  POST: registerNewUser,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if (req.method === 'POST' && isRequestAllowed) {
      return await handleHttpMethods[req.method](req, res);
    } else {
      return res.status(400).json({
        success: false,
        message: `${req.method} is not allowed for this route`,
      });
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

export default handler;

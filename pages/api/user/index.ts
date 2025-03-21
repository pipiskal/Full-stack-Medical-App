import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import protectedRoute from '@/middleware/protectedRoute';
import UserModel from '@/models/UserModel';
import {
  generateCatchErrorResponse,
  generateResponse,
  getJwtTokenValues,
} from '@/modules/helpersBE';
import { HTTPMethods, UserBEType } from '@/typesBE';

// To be able to provide and update a user we get that user
// from the provided http only cookies that contains our access token

const allowedMethods: HTTPMethods[] = [HTTPMethods.GET, HTTPMethods.PATCH];

const updateUserInMongo = async (
  res: NextApiResponse,
  userDetails: Pick<UserBEType, '_id' | 'firstName' | 'lastName' | 'password'>
) => {
  const { _id: userId, firstName, lastName, password } = userDetails;

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        ...(password && { password: password }),
      },
    },
    { returnOriginal: false }
  ).select('firstName lastName');

  if (updatedUser) {
    return generateResponse(
      res,
      true,
      'User updated successfully',
      200,
      updatedUser
    );
  } else {
    return generateResponse(res, false, 'Unable to update user', 400);
  }
};

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    if (userId) {
      const user = await UserModel.findOne({ _id: userId });

      if (user._id) {
        return generateResponse(res, true, 'User found', 200, user);
      } else {
        return generateResponse(res, false, 'User not found', 404);
      }
    } else {
      return generateResponse(
        res,
        false,
        'Unable to find User from provided Tokens',
        404
      );
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { jwtAccessToken } = req.cookies;

    const { userId } = getJwtTokenValues(jwtAccessToken || '');
    await connectDB();

    if (userId) {
      const {
        firstName,
        lastName,
        currentPassword,
        newPassword,
      }: {
        firstName: string;
        lastName: string;
        currentPassword: string;
        newPassword: string;
      } = JSON.parse(req.body);

      const isCurrentPasswordProvided = Boolean(currentPassword);
      const isNewPasswordProvided = Boolean(newPassword);
      const arePasswordsProvided =
        isCurrentPasswordProvided && isNewPasswordProvided;
      const areNewValuesToUpdate = Boolean(firstName || lastName);

      if (!arePasswordsProvided) {
        if (
          areNewValuesToUpdate &&
          !isCurrentPasswordProvided &&
          !newPassword
        ) {
          return await updateUserInMongo(res, {
            _id: userId,
            firstName,
            lastName,
            password: '',
          });
        } else {
          return generateResponse(
            res,
            false,
            'Bad request,Please provide current and new password',
            400
          );
        }
      }

      // If the user wants to update his password
      // We need to check if the current password is correct
      if (arePasswordsProvided) {
        const user = await UserModel.findOne({ _id: userId }).select(
          '+password'
        );

        const isProvidedPasswordCorrect = await user.comparePasswords(
          currentPassword,
          user.password
        );

        // If the provided password is not correct we return early
        if (!isProvidedPasswordCorrect) {
          return generateResponse(
            res,
            false,
            'Bad request,Current password is invalid',
            400
          );
        }

        // We encrypt the new provided password
        const encryptedPassword = bcrypt.hashSync(newPassword, 12);

        return await updateUserInMongo(res, {
          _id: userId,
          firstName,
          lastName,
          password: encryptedPassword,
        });
      }
    } else {
      return generateResponse(
        res,
        false,
        'Unable to find User from provided Tokens',
        404
      );
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  GET: getUser,
  PATCH: updateUser,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if ((req.method === 'GET' || req.method === 'PATCH') && isRequestAllowed) {
      await protectedRoute(req, res, handleHttpMethods[req.method]);
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

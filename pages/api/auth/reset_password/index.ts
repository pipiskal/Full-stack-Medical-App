import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import jwt_decode from 'jwt-decode';
import { NextApiRequest, NextApiResponse } from 'next';

import UserModel from '@/models/UserModel';
import {
  generateCatchErrorResponse,
  generateResponse,
} from '@/modules/helpersBE';
import { HTTPMethods } from '@/typesBE';

// What to do after password reset:

// TODO : Invalidate the reset_key to be used only once
// TODO : remove the access and refresh token from the browser

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST];

const resetUserPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  const resetKeySecret = process.env.RESET_PASSWORD_JWT_SECRET || '';
  try {
    const { resetKey, password } = JSON.parse(req.body);

    if (resetKey && password) {
      const decodedToken: { email: string } = jwt_decode(resetKey);

      try {
        const isResetKeyValid = await jwtVerify(
          resetKey,
          new TextEncoder().encode(resetKeySecret)
        );

        const { email } = decodedToken;
        const encryptedPassword = bcrypt.hashSync(password, 12);

        if (isResetKeyValid && encryptedPassword && email) {
          const user = await UserModel.findOneAndUpdate(
            { email: email },
            { $set: { password: encryptedPassword }, new: true }
          );

          return generateResponse(
            res,
            true,
            'successful password reset',
            200,
            user
          );
        }
      } catch (error) {
        return generateResponse(
          res,
          false,
          `Authentication token is invalid or expired`,
          401
        );
      }
    } else {
      return generateResponse(res, false, 'Bad request', 400);
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  POST: resetUserPassword,
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

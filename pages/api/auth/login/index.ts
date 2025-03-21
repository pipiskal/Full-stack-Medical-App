import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import UserModel from '@/models/UserModel';
import {
  generateCatchErrorResponse,
  generateSerializedTokens,
} from '@/modules/helpersBE';
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST];

const invalidLoginResponse = (res: NextApiResponse) => {
  return res.status(401).json({
    success: false,
    message: 'Email or password are not correct',
    statusCode: 401,
  });
};

const invalidBodyResponse = (res: NextApiResponse) => {
  return res.status(404).json({
    success: false,
    message: 'Email or password were not provided',
    statusCode: 404,
  });
};

const validLoginResponse = (res: NextApiResponse, tokens: string[]) => {
  res.setHeader('Set-Cookie', tokens);
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    statusCode: 200,
  });
};

// This is the main function that is called when the user tries to login
const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password, rememberMe } = JSON.parse(req.body);
    //TODO validate email and password

    if (email && password) {
      // if everything is ok from the client then we open a connection to the database
      await connectDB();
      const user = await UserModel.findOne({ email }).select('+password');

      if (user) {
        const isProvidedPasswordCorrect = await user.comparePasswords(
          password,
          user.password
        );

        if (isProvidedPasswordCorrect) {
          const tokens = await generateSerializedTokens(
            { userId: user._id, rememberMe: rememberMe },
            rememberMe ? 'persist' : 'session'
          );
          return validLoginResponse(res, tokens);
        } else {
          return invalidLoginResponse(res);
        }
      } else {
        return invalidLoginResponse(res);
      }
    }

    return invalidBodyResponse(res);
  } catch (error: unknown) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  POST: loginUser,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isRequestAllowed =
      req.method != undefined &&
      allowedMethods.includes(req.method as HTTPMethods);

    if (req.method === 'POST' && isRequestAllowed) {
      return await handleHttpMethods[req.method](req, res);
    } else {
      return res.status(400).json({
        message: `${req.method} is not allowed for this route`,
        success: false,
      });
    }
  } catch (error: unknown) {
    return generateCatchErrorResponse(res, error);
  }
};

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

import {
  generateCatchErrorResponse,
  generateNoSerializedToken,
  generateResponse,
} from '@/modules/helpersBE';
import { generateForgotPasswordEmail } from '@/Templates/ForgotPasswordEmail/ForgotPassword';
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST];

const resetPasswordSecret = process.env.RESET_PASSWORD_JWT_SECRET || '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'enospacemedical@gmail.com',
    pass: 'gbccwukcqazsqmfq',
  },
});

const forgotPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email } = JSON.parse(req.body);

    //TODO : validate email

    if (email) {
      const resetKey: string = await generateNoSerializedToken(
        {
          email: email,
        },
        '5min',
        resetPasswordSecret
      );

      const emailHtml = generateForgotPasswordEmail(resetKey, 'el');

      try {
        await transporter.sendMail({
          from: 'enospacemedical@gmail.com', // sender address
          to: email, // list of receivers
          subject: 'Password reset procedure.', // Subject line
          text: 'The link will be active for the next 5 minutes', // plain text body
          html: emailHtml,
        });
        return generateResponse(res, true, 'Email sent', 200);
      } catch (error) {
        return generateCatchErrorResponse(res, error);
      }
    }
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  POST: forgotPassword,
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

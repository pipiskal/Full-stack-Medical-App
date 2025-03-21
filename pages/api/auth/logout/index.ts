import { NextApiRequest, NextApiResponse } from 'next';

import {
  generateCatchErrorResponse,
  generateSerializedTokens,
} from '@/modules/helpersBE';
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST];

const logoutUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const tokens = await generateSerializedTokens({}, 'logout');

  // We make sure that the token is set to expire immediately before we send it to the client
  const accessToken = tokens.find((token) => token.includes('jwtAccessToken'));
  const refreshToken = tokens.find((token) =>
    token.includes('jwtRefreshToken')
  );
  const accessTokenMaxAge = accessToken?.split(';')[1].split('=')[1];
  const refreshTokenMaxAge = refreshToken?.split(';')[1].split('=')[1];
  const areTokensSetToExpireImmediately =
    accessTokenMaxAge === '-1' && refreshTokenMaxAge === '-1';

  if (areTokensSetToExpireImmediately) {
    res.setHeader('Set-Cookie', tokens);
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
      statusCode: 200,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something Went Wrong, Unable to Logout',
    statusCode: 500,
  });
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  POST: logoutUser,
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
    generateCatchErrorResponse(res, error);
  }
};

export default handler;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';

import { StatusCodeType } from '@/typesBE';

type successResponseType = {
  success: boolean;
  message: string;
  statusCode: StatusCodeType;
  data: any;
};

type unsuccessResponseType = {
  success: boolean;
  message: string;
  statusCode: StatusCodeType;
  data: null;
};

type RequestResponseType = successResponseType | unsuccessResponseType;

const public_app_url = process.env.NEXT_PUBLIC_APP_URL;

const generateSuccessFullResponse = (
  message: string,
  statusCode: StatusCodeType,
  data: any
): successResponseType => {
  return {
    success: true,
    message: message,
    statusCode: statusCode,
    data: data,
  };
};

const generateUnsuccessfulResponse = (
  message: string,
  statusCode: StatusCodeType
): successResponseType => {
  return {
    success: false,
    message: message,
    statusCode: statusCode,
    data: null,
  };
};

export const requestClient = async (
  path: string,
  params: object | boolean = false,
  methodType: 'POST' | 'GET' | 'PATCH' | 'DELETE' = 'GET'
): Promise<RequestResponseType> => {
  try {
    const response = await fetch(`/api/${path}`, {
      credentials: 'same-origin',
      method: methodType,
      mode: 'cors',
      ...(params && { body: JSON.stringify(params) }),
    });

    const { success, message, statusCode, data } = await response.json();

    if (success) {
      return generateSuccessFullResponse(message, statusCode, data);
    }

    if (!success && statusCode === 401) {
      Router.push('/auth/login');
      return generateUnsuccessfulResponse(message, statusCode);
    }

    return generateUnsuccessfulResponse(message, statusCode);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong';
    return generateUnsuccessfulResponse(errorMessage, 500);
  }
};

/**
 *requestServer is function that is used to only get data from APIs from the server side of the client.
 *There is not need to pass an absolute path just the endpoint of the API.
 *The Domain is added automatically.
 * @param {GetServerSidePropsContext} context The context object from getServerSideProps.
 * @param {string} path is the API Endpoint of the BE Server.
 */

export const requestServer = async (
  context: GetServerSidePropsContext,
  path: string
  // TODO : instead of unknown we can use all the type from the typedApiResponses.ts when ready
): Promise<RequestResponseType> => {
  const redirectToLoginAndUpdateClientCookiesFromServerResponse = () => {
    if (updatedCookiesFromServer !== null) {
      const arrayOfUpdateCookies = updatedCookiesFromServer?.split(',');
      context.res.setHeader('Set-Cookie', arrayOfUpdateCookies);
    }

    context.res.writeHead(302, { Location: '/auth/login' });
    context.res.end();
    return generateUnsuccessfulResponse('Unauthorized', 401);
  };

  /*
   To be able to make a valid request to the server Api
   We need to pass the authentication cookies to the headers of the request
  */

  // Get the cookies from the request headers
  const cookies: string = context.req.headers.cookie || '';

  // make a request to the API to get the user data and add the cookies to the request headers
  const res = await fetch(`${public_app_url}/api/${path}`, {
    headers: {
      cookie: cookies,
    },
    cache: 'force-cache',
  });

  /*
    From the above call to the API if the request was valid and authenticated,
    We will get data back as it was a client request. {success : false, data : ... etc}
  */

  /*
    If the accessToken was expired when we made the request but the refreshToken was valid
    The server will send back the response data and new accessToken and refreshToken in the response headers
    So we need to update the cookies in the client side with the new tokens from our sever side
  */

  // The server will always sent back updated cookies in the response headers
  // Either only isUserLoggedIn with the correct value or all the cookies with new generated tokens

  // The first thing we need to do is to get all the new cookies from the response headers
  const updatedCookiesFromServer = res.headers.get('set-cookie');

  /*
    We check if the user is authenticated. Remember that the server will always
    check and validate if the user should be authenticated or not. Meaning isUserLoggedIn will be true or false
  */

  // FOR THE USER TO BE AUTHENTICATED THE SERVER MUST SENT BACK THE isUserLoggedIn COOKIE AND IT MUST BE TRUE
  const isUserLoggedIn = updatedCookiesFromServer?.includes(
    'isUserLoggedIn=true'
  );

  // We check if the server sent back new authorization tokens
  const jwtAccessToken = updatedCookiesFromServer?.includes('jwtAccessToken');
  const jwtRefreshToken = updatedCookiesFromServer?.includes('jwtRefreshToken');

  // It means that accessToken was expired and refreshToken was valid
  const isUserAuthenticatedWithNewTokens =
    updatedCookiesFromServer !== null &&
    isUserLoggedIn &&
    jwtAccessToken &&
    jwtRefreshToken;

  // It means that accessToken was valid
  const isUserAuthenticatedWithoutNewTokens =
    updatedCookiesFromServer !== null &&
    isUserLoggedIn &&
    !jwtAccessToken &&
    !jwtRefreshToken;

  /*
    If the user is NOT AUTHENTICATED we redirect him to the login page directly.
    And we update the cookies in the client side with the new cookies from the server
    Because the BE (The server said that it was a potential harmful request from an unauthorized user)
    There is no need to await the response from the server to get the data and lose time
  */
  if (!isUserLoggedIn) {
    redirectToLoginAndUpdateClientCookiesFromServerResponse();
  }

  // Now we can get the data from the response because we know that the user is AUTHENTICATED
  const response = await res.json();
  const { success, message, statusCode, data } = response;

  if (!success && response.statusCode === 401) {
    redirectToLoginAndUpdateClientCookiesFromServerResponse();
  }

  /*
    If the user is AUTHENTICATED  and we have new tokens
    We need to update the cookies in the client side with all the new cookies from the server
  */
  if (isUserAuthenticatedWithNewTokens) {
    const arrayOfUpdateCookies = updatedCookiesFromServer?.split(',');
    context.res.setHeader('Set-Cookie', arrayOfUpdateCookies);
  }

  /*
   If the user is AUTHENTICATED  but WITHOUT new tokens
    We need just ned to update the isUserLoggedIn cookie in the client side not all the cookies
  */
  if (isUserAuthenticatedWithoutNewTokens) {
    // const arrayOfUpdateCookies = updatedCookiesFromServer?.split(',');
    const updatedIsUserLoggedInCookie = updatedCookiesFromServer?.split(',')[0];
    context.res.setHeader('Set-Cookie', updatedIsUserLoggedInCookie);
  }

  if (success) {
    return generateSuccessFullResponse(message, statusCode, data);
  } else {
    return generateUnsuccessfulResponse(message, statusCode);
  }
};

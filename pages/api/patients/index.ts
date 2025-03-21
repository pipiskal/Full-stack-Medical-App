import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import protectedRoute from '@/middleware/protectedRoute';
import PatientModel from '@/models/PatientModel';
import {
  generateCatchErrorResponse,
  generateResponse,
  getJwtTokenValues,
} from '@/modules/helpersBE';
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [HTTPMethods.POST, HTTPMethods.GET];

// All the functions below implemented CRUD operations for a specific "User - Doctor"
// We get that user from the provided http only cookies that contains our access token

const createPatient = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    if (userId) {
      const {
        amka,
        firstName,
        lastName,
        dob,
        phoneNumber,
        email,
        address,
        city,
        extraDetails,
      } = JSON.parse(req.body);

      const areMandatoryFieldsProvided = amka && firstName && lastName;

      //TODO - add validation on the body check that matches the schema that needs to match

      if (areMandatoryFieldsProvided) {
        await connectDB();

        const patient = await PatientModel.create({
          doctorId: userId,
          amka,
          firstName,
          lastName,
          dob,
          phoneNumber,
          email,
          address,
          city,
          extraDetails,
        });

        if (patient) {
          return generateResponse(res, true, 'Patient created', 201, patient);
        } else {
          return generateResponse(res, false, 'Patient not created', 400);
        }
      } else {
        return generateResponse(
          res,
          false,
          'Not all mandatory fields where provided',
          400
        );
      }
    } else {
      return generateResponse(
        res,
        false,
        'Unable to find User from provided Tokens',
        404
      );
    }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error?.code === 11000
    ) {
      return generateResponse(
        res,
        false,
        'Patient with this AMKA already exists',
        409
      );
    }

    return generateCatchErrorResponse(res, error);
  }
};

const getAllPatients = async (req: NextApiRequest, res: NextApiResponse) => {
  const { jwtAccessToken } = req.cookies;
  const { userId } = getJwtTokenValues(jwtAccessToken || '');

  if (userId) {
    await connectDB();
    const patientsArray = await PatientModel.find({ doctorId: userId }).select(
      '-history -createdAt -updatedAt'
    );

    if (patientsArray) {
      return generateResponse(res, true, 'Patients found', 200, patientsArray);
    } else {
      return generateResponse(res, false, 'Unable to find any patients', 404);
    }
  } else {
    return generateResponse(
      res,
      false,
      'Unable to find User from provided Tokens',
      404
    );
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  POST: createPatient,
  GET: getAllPatients,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if ((req.method === 'POST' || req.method === 'GET') && isRequestAllowed) {
      return await protectedRoute(req, res, handleHttpMethods[req.method]);
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

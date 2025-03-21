import { NextApiRequest, NextApiResponse } from 'next';

import connectDB from '@/middleware/connectDB';
import protectedRoute from '@/middleware/protectedRoute';
import PatientModel from '@/models/PatientModel';
import {
  generateCatchErrorResponse,
  generateResponse,
  getJwtTokenValues,
  isIdValid,
} from '@/modules/helpersBE';
import { HTTPMethods } from '@/typesBE';

const allowedMethods: HTTPMethods[] = [
  HTTPMethods.GET,
  HTTPMethods.PATCH,
  HTTPMethods.DELETE,
];

const getPatient = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    if (userId) {
      const { id: patientId, history } = req.query;

      const returnedValues =
        history === 'true'
          ? '-createdAt -updatedAt'
          : '-history -createdAt -updatedAt';

      if (patientId && isIdValid(patientId)) {
        await connectDB();

        const patient = await PatientModel.findById({
          _id: patientId,
          doctorId: userId,
        }).select(returnedValues);

        if (patient) {
          return generateResponse(
            res,
            true,
            'found patient successfully',
            200,
            patient
          );
        } else {
          return generateResponse(
            res,
            false,
            'Unable to find patient you requested',
            404
          );
        }
      } else {
        return generateResponse(
          res,
          false,
          'The patient id you provided is not valid',
          400
        );
      }
    }

    return generateResponse(
      res,
      false,
      'Unable to find User from provided Tokens',
      404
    );
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const updatePatient = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');
    const { id: patientId } = req.query;

    if (userId) {
      if (patientId && isIdValid(patientId)) {
        const {
          amka,
          firstName,
          lastName,
          dob,
          phoneNumber,
          email,
          address,
          city,
          history,
          extraDetails,
        } = JSON.parse(req.body);

        // TODO Validate Body;

        await connectDB();

        const updatedPatient = await PatientModel.findByIdAndUpdate(
          patientId,
          {
            ...(amka && { amka }),
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            dob: dob ? dob : '',
            ...(phoneNumber && { phoneNumber }),
            ...(email && { email }),
            ...(address && { address }),
            ...(city && { city }),
            ...(history && { history }),
            ...(extraDetails && { extraDetails }),
          },
          { new: true }
        ).select('-history -createdAt -updatedAt');

        if (updatedPatient) {
          return generateResponse(
            res,
            true,
            'patient updated successfully',
            200,
            updatedPatient
          );
        } else {
          return generateResponse(
            res,
            false,
            'The patient id you provided is not valid',
            400
          );
        }
      } else {
        return generateResponse(
          res,
          false,
          'The patient id you provided is not valid',
          400
        );
      }
    }

    return generateResponse(
      res,
      false,
      'Unable to find User from provided Tokens',
      404
    );
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const deletePatient = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { jwtAccessToken } = req.cookies;
    const { userId } = getJwtTokenValues(jwtAccessToken || '');

    if (userId) {
      const { id: patientId } = req.query;

      if (patientId && isIdValid(patientId)) {
        await connectDB();

        const deletedPatient = await PatientModel.findOneAndDelete(
          {
            _id: patientId,
            doctorId: userId,
          },
          {
            returnOriginal: true,
          }
        ).select('-history');

        if (deletedPatient) {
          return generateResponse(
            res,
            true,
            'successful patient deletion',
            200,
            deletedPatient
          );
        } else {
          return generateResponse(
            res,
            false,
            'Unable to find patient you requested for deletion',
            404
          );
        }
      } else {
        return generateResponse(
          res,
          false,
          'The patient id you provided is not valid',
          400
        );
      }
    }

    return generateResponse(
      res,
      false,
      'Unable to find User from provided Tokens',
      404
    );
  } catch (error) {
    return generateCatchErrorResponse(res, error);
  }
};

const handleHttpMethods: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  GET: getPatient,
  PATCH: updatePatient,
  DELETE: deletePatient,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed =
    req.method != undefined &&
    allowedMethods.includes(req.method as HTTPMethods);

  try {
    if (isRequestAllowed) {
      await protectedRoute(req, res, handleHttpMethods[req.method || 'GET']);
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

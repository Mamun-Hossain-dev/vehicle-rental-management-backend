import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api.js';
import { sendResponse } from '../../utils/send-response.js';
import { RentalService } from './rental.service.js';
import type {
  Rental,
  RentalFilters,
  RentalInput,
  RentalUpdate,
} from './rental.types.js';

export class RentalController {
  constructor(private readonly service = new RentalService()) {}

  list = async (
    req: Request<object, object, object, RentalFilters>,
    res: Response<ApiResponse<Rental[]>>,
  ): Promise<void> => {
    sendResponse(res, {
      data: await this.service.list(req.validatedQuery as RentalFilters),
    });
  };
  get = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Rental>>,
  ): Promise<void> => {
    sendResponse(res, {
      data: await this.service.get(Number(req.params.id)),
    });
  };
  create = async (
    req: Request<object, object, RentalInput>,
    res: Response<ApiResponse<Rental>>,
  ): Promise<void> => {
    sendResponse(res, {
      status: 201,
      message: 'Rental created successfully',
      data: await this.service.create(req.body),
    });
  };
  update = async (
    req: Request<{ id: string }, object, RentalUpdate>,
    res: Response<ApiResponse<Rental>>,
  ): Promise<void> => {
    sendResponse(res, {
      message: 'Rental updated successfully',
      data: await this.service.update(Number(req.params.id), req.body),
    });
  };
  delete = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Rental>>,
  ): Promise<void> => {
    sendResponse(res, {
      message: 'Rental cancelled successfully',
      data: await this.service.cancel(Number(req.params.id)),
    });
  };
}

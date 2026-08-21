import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api.js';
import { sendResponse } from '../../utils/send-response.js';
import { VehicleService } from './vehicle.service.js';
import type {
  Vehicle,
  VehicleFilters,
  VehicleInput,
  VehicleUpdate,
} from './vehicle.types.js';

export class VehicleController {
  constructor(private readonly service = new VehicleService()) {}

  list = async (
    req: Request,
    res: Response<ApiResponse<Vehicle[]>>,
  ): Promise<void> => {
    const result = await this.service.list(
      req.validatedQuery as VehicleFilters,
    );
    sendResponse(res, { data: result.data, meta: result.meta });
  };

  get = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Vehicle>>,
  ): Promise<void> => {
    sendResponse(res, {
      data: await this.service.get(Number(req.params.id)),
    });
  };

  create = async (
    req: Request<object, object, VehicleInput>,
    res: Response<ApiResponse<Vehicle>>,
  ): Promise<void> => {
    sendResponse(res, {
      status: 201,
      message: 'Vehicle created successfully',
      data: await this.service.create(req.body, req.file),
    });
  };

  update = async (
    req: Request<{ id: string }, object, VehicleUpdate>,
    res: Response<ApiResponse<Vehicle>>,
  ): Promise<void> => {
    sendResponse(res, {
      message: 'Vehicle updated successfully',
      data: await this.service.update(
        Number(req.params.id),
        req.body,
        req.file,
      ),
    });
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse>,
  ): Promise<void> => {
    await this.service.delete(Number(req.params.id));
    sendResponse(res, { message: 'Vehicle deleted successfully' });
  };
}

import type { Request, Response } from 'express';
import { VehicleService } from './vehicle.service.js';
import type {
  VehicleFilters,
  VehicleInput,
  VehicleUpdate,
} from './vehicle.types.js';

export class VehicleController {
  constructor(private readonly service = new VehicleService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.list(
      req.query as unknown as VehicleFilters,
    );
    res.json({ success: true, data: result.data, meta: result.meta });
  };
  get = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    res.json({
      success: true,
      data: await this.service.get(Number(req.params.id)),
    });
  };
  create = async (
    req: Request<object, object, VehicleInput>,
    res: Response,
  ): Promise<void> => {
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: await this.service.create(req.body, req.file),
    });
  };
  update = async (
    req: Request<{ id: string }, object, VehicleUpdate>,
    res: Response,
  ): Promise<void> => {
    res.json({
      success: true,
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
    res: Response,
  ): Promise<void> => {
    await this.service.delete(Number(req.params.id));
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  };
}

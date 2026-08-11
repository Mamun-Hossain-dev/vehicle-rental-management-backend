import type { Request, Response } from 'express';
import { RentalService } from './rental.service.js';
import type {
  RentalFilters,
  RentalInput,
  RentalUpdate,
} from './rental.types.js';

export class RentalController {
  constructor(private readonly service = new RentalService()) {}

  list = async (
    req: Request<object, object, object, RentalFilters>,
    res: Response,
  ): Promise<void> => {
    res.json({
      success: true,
      data: await this.service.list(req.validatedQuery as RentalFilters),
    });
  };
  get = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    res.json({
      success: true,
      data: await this.service.get(Number(req.params.id)),
    });
  };
  create = async (
    req: Request<object, object, RentalInput>,
    res: Response,
  ): Promise<void> => {
    res.status(201).json({
      success: true,
      message: 'Rental created successfully',
      data: await this.service.create(req.body),
    });
  };
  update = async (
    req: Request<{ id: string }, object, RentalUpdate>,
    res: Response,
  ): Promise<void> => {
    res.json({
      success: true,
      message: 'Rental updated successfully',
      data: await this.service.update(Number(req.params.id), req.body),
    });
  };
  delete = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    res.json({
      success: true,
      message: 'Rental cancelled successfully',
      data: await this.service.cancel(Number(req.params.id)),
    });
  };
}

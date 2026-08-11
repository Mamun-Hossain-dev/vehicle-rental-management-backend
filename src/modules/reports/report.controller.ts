import type { Request, Response } from 'express';
import { ReportService } from './report.service.js';
import type { ReportQuery } from './report.types.js';

export class ReportController {
  constructor(private readonly service = new ReportService()) {}

  monthly = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      data: await this.service.monthly(req.validatedQuery as ReportQuery),
    });
  };
}

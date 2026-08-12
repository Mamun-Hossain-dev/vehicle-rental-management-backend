import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api.js';
import { sendResponse } from '../../utils/send-response.js';
import { ReportService } from './report.service.js';
import type { ReportQuery, VehicleReport } from './report.types.js';

interface MonthlyReport {
  vehicles: VehicleReport[];
  highest_revenue_vehicle: VehicleReport | null;
}

export class ReportController {
  constructor(private readonly service = new ReportService()) {}

  monthly = async (
    req: Request,
    res: Response<ApiResponse<MonthlyReport>>,
  ): Promise<void> => {
    sendResponse(res, {
      data: await this.service.monthly(req.validatedQuery as ReportQuery),
    });
  };
}

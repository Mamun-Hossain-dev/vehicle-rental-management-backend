export interface VehicleReport {
  id: number;
  name: string;
  total_bookings: number;
  days_rented: number;
  revenue: string;
}

export interface ReportQuery {
  month: string;
  vehicle_id?: number;
}

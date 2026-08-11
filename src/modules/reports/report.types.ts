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

export interface ReportRow {
  id: number;
  name: string;
  daily_rate: string;
  rental_id: number | null;
  start_date: string | null;
  end_date: string | null;
}

export type RentalStatus = 'booked' | 'ongoing' | 'completed' | 'cancelled';

export interface Rental {
  id: number;
  vehicle_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_amount: string;
  status: RentalStatus;
  created_at: Date;
  updated_at: Date;
}

export interface RentalInput {
  vehicle_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  status?: RentalStatus;
}

export type RentalUpdate = Partial<RentalInput>;
export interface RentalFilters {
  vehicle_id?: number;
  status?: RentalStatus;
  start_date?: string;
  end_date?: string;
}

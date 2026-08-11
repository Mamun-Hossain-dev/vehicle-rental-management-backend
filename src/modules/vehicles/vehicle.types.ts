export interface Vehicle {
  id: number;
  name: string;
  plate_number: string;
  category: string;
  daily_rate: string;
  photo_path: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleInput {
  name: string;
  plate_number: string;
  category: string;
  daily_rate: string;
}

export interface VehicleUpdate extends Partial<VehicleInput> {
  photo_path?: string | null;
}

export interface VehicleFilters {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}

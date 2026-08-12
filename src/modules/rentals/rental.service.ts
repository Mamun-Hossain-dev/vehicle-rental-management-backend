import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import { ApiError } from '../../utils/api-error.js';
import { inclusiveDays } from '../../utils/date.js';
import { multiplyMoney } from '../../utils/money.js';
import { VehicleRepository } from '../vehicles/vehicle.repository.js';
import type { Vehicle } from '../vehicles/vehicle.types.js';
import { RentalRepository } from './rental.repository.js';
import type {
  Rental,
  RentalFilters,
  RentalInput,
  RentalUpdate,
} from './rental.types.js';

export class RentalService {
  constructor(
    private readonly repository = new RentalRepository(),
    private readonly vehicles = new VehicleRepository(),
    private readonly database: Knex = db,
  ) {}

  list(filters: RentalFilters): Promise<Rental[]> {
    return this.repository.findAll(filters);
  }

  async get(id: number): Promise<Rental> {
    const rental = await this.repository.findById(id);
    if (!rental) throw new ApiError(404, 'Rental not found');
    return rental;
  }

  create(input: RentalInput): Promise<Rental> {
    return this.database.transaction(async (trx) => {
      const vehicle = await this.vehicles.findByIdForUpdate(
        input.vehicle_id,
        trx,
      );
      if (!vehicle) throw new ApiError(404, 'Vehicle not found');
      await this.ensureAvailable(
        trx,
        input.vehicle_id,
        input.start_date,
        input.end_date,
      );
      return this.repository.create(trx, {
        ...input,
        status: 'booked',
        total_amount: multiplyMoney(
          vehicle.daily_rate,
          inclusiveDays(input.start_date, input.end_date),
        ),
      });
    });
  }

  update(id: number, input: RentalUpdate): Promise<Rental> {
    return this.database.transaction(async (trx) => {
      const current = await this.repository.findById(id, trx);
      if (!current) throw new ApiError(404, 'Rental not found');
      const vehicleId = input.vehicle_id ?? current.vehicle_id;
      const lockIds = [...new Set([current.vehicle_id, vehicleId])].sort(
        (a, b) => a - b,
      );
      let vehicle: Vehicle | undefined;
      for (const lockId of lockIds) {
        const locked = await this.vehicles.findByIdForUpdate(lockId, trx);
        if (lockId === vehicleId) vehicle = locked;
      }
      if (!vehicle) throw new ApiError(404, 'Vehicle not found');
      const start = input.start_date ?? current.start_date;
      const end = input.end_date ?? current.end_date;
      if (start > end)
        throw new ApiError(400, 'start_date must not be after end_date');
      const status = input.status ?? current.status;
      if (status !== 'cancelled')
        await this.ensureAvailable(trx, vehicleId, start, end, id);
      const pricingChanged =
        input.vehicle_id !== undefined ||
        input.start_date !== undefined ||
        input.end_date !== undefined;
      return this.repository.update(trx, id, {
        ...input,
        vehicle_id: vehicleId,
        start_date: start,
        end_date: end,
        total_amount: pricingChanged
          ? multiplyMoney(vehicle.daily_rate, inclusiveDays(start, end))
          : current.total_amount,
      });
    });
  }

  async cancel(id: number): Promise<Rental> {
    const rental = await this.repository.cancel(id);
    if (!rental) throw new ApiError(404, 'Rental not found');
    return rental;
  }

  private async ensureAvailable(
    trx: Knex.Transaction,
    vehicleId: number,
    start: string,
    end: string,
    excludeId?: number,
  ): Promise<void> {
    if (
      await this.repository.hasOverlap(trx, vehicleId, start, end, excludeId)
    ) {
      throw new ApiError(
        409,
        'Vehicle is already booked for the selected dates',
      );
    }
  }
}

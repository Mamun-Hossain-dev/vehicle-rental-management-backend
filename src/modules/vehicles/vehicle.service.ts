import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/api-error.js';
import { VehicleRepository } from './vehicle.repository.js';
import type {
  Vehicle,
  VehicleFilters,
  VehicleInput,
  VehicleUpdate,
} from './vehicle.types.js';

export class VehicleService {
  constructor(private readonly repository = new VehicleRepository()) {}

  async list(filters: VehicleFilters) {
    const { rows, total } = await this.repository.findAll(filters);
    const { category, search, ...metaFilters } = filters;
    console.log('category&search', category, search);
    return {
      data: rows,
      meta: {
        ...metaFilters,
        total,
        totalPages: Math.ceil(total / (filters.limit || 1)),
      },
    };
  }

  async get(id: number): Promise<Vehicle> {
    const vehicle = await this.repository.findById(id);
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');
    return vehicle;
  }

  create(input: VehicleInput, file?: Express.Multer.File): Promise<Vehicle> {
    return this.repository.create({
      ...input,
      photo_path: file ? file.filename : null,
    });
  }

  async update(
    id: number,
    input: VehicleUpdate,
    file?: Express.Multer.File,
  ): Promise<Vehicle> {
    const current = await this.get(id);
    // if (file && current.photo_path === file.filename)
    //   throw new ApiError(
    //     400,
    //     'New photo must be different from the current one',
    //   );
    try {
      const vehicle = await this.repository.update(id, {
        ...input,
        ...(file && { photo_path: file.filename }),
      });
      if (!vehicle) throw new ApiError(404, 'Vehicle not found');
      if (file && current.photo_path)
        await this.removePhoto(current.photo_path);
      return vehicle;
    } catch (error) {
      if (file) await this.removePhoto(file.filename);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    if (!(await this.repository.softDelete(id)))
      throw new ApiError(404, 'Vehicle not found');
  }

  private async removePhoto(filename: string): Promise<void> {
    await unlink(
      path.join(path.resolve(env.UPLOAD_PATH), path.basename(filename)),
    ).catch(() => undefined);
  }
}

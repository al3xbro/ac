import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcStatus } from './ac-status.entity.js';
import { CreateAcStatusDto } from './dto/create-ac-status.dto.js';

@Injectable()
export class AcStatusService {
  constructor(
    @InjectRepository(AcStatus)
    private readonly acStatusRepository: Repository<AcStatus>,
  ) {}

  async getLatest(): Promise<AcStatus | null> {
    return this.acStatusRepository.findOne({
      where: {},
      order: { timestamp: 'DESC' },
    });
  }

  async create(dto: CreateAcStatusDto): Promise<AcStatus> {
    const acStatus = this.acStatusRepository.create(dto);
    return this.acStatusRepository.save(acStatus);
  }
}

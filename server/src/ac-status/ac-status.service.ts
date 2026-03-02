import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcStatus } from './ac-status.entity.js';
import { CreateAcStatusDto } from './dto/create-ac-status.dto.js';
import { NotificationService } from '../push-subscription/notification.service.js';

@Injectable()
export class AcStatusService {
  constructor(
    @InjectRepository(AcStatus)
    private readonly acStatusRepository: Repository<AcStatus>,
    private readonly notificationService: NotificationService,
  ) {}

  async getLatest(): Promise<AcStatus | null> {
    return this.acStatusRepository.findOne({
      where: {},
      order: { timestamp: 'DESC' },
    });
  }

  async create(dto: CreateAcStatusDto): Promise<AcStatus> {
    const acStatus = this.acStatusRepository.create(dto);
    const saved = await this.acStatusRepository.save(acStatus);

    this.notificationService.notifyAll({
      title: 'AC Status Changed',
      body: `AC mode set to ${saved.mode.toUpperCase()}`,
    }).catch(() => {});

    return saved;
  }
}

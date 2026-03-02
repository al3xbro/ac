import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcStatus } from './ac-status.entity.js';
import { CreateAcStatusDto } from './dto/create-ac-status.dto.js';
import { NotificationService } from '../push-subscription/notification.service.js';

@Injectable()
export class AcStatusService {
  private notifyTimeout: ReturnType<typeof setTimeout> | null = null;

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

    if (this.notifyTimeout) clearTimeout(this.notifyTimeout);
    this.notifyTimeout = setTimeout(() => {
      this.notificationService.notifyAll({
        title: 'AC Status Changed',
        body: `AC mode set to ${saved.mode.toUpperCase()}`,
      }).catch(() => {});
    }, 5000);

    return saved;
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { AcStatusService } from './ac-status.service.js';
import { CreateAcStatusDto } from './dto/create-ac-status.dto.js';
import { AcStatus } from './ac-status.entity.js';

@Controller('ac-status')
export class AcStatusController {
  constructor(private readonly acStatusService: AcStatusService) {}

  @Get()
  async getLatest(): Promise<AcStatus | null> {
    return await this.acStatusService.getLatest();
  }

  @Post()
  async create(@Body() dto: CreateAcStatusDto): Promise<AcStatus> {
    return await this.acStatusService.create(dto);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from '../../entities';
import { CreateAuditLogPayload } from '../../models';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogsRepository: Repository<AuditLogEntity>,
  ) {}

  async create(payload: CreateAuditLogPayload): Promise<AuditLogEntity> {
    const auditLog = this.auditLogsRepository.create({
      action: payload.action,
      entity: payload.entity,
      entityId: payload.entityId,
      userId: payload.userId ?? null,
      oldValue: payload.oldValue ?? null,
      newValue: payload.newValue ?? null,
    });

    return this.auditLogsRepository.save(auditLog);
  }
}

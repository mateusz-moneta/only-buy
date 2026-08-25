import { AuditAction, AuditEntity } from '../enums';

export interface CreateAuditLogPayload {
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  userId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}

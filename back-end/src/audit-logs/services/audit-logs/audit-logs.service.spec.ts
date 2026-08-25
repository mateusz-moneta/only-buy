import { Repository } from 'typeorm';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogEntity } from '../../entities';
import { CreateAuditLogPayload } from '../../models';
import { AuditAction, AuditEntity } from '../../enums';

describe(AuditLogsService.name, () => {
  let service: AuditLogsService;

  const auditLogsRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new AuditLogsService(
      auditLogsRepository as unknown as Repository<AuditLogEntity>,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save audit log', async () => {
      const payload: CreateAuditLogPayload = {
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: 'admin-id',
        oldValue: {
          active: true,
        },
        newValue: {
          active: false,
        },
      };

      const auditLog: Partial<AuditLogEntity> = {
        id: 'audit-log-id',
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: 'admin-id',
        oldValue: {
          active: true,
        },
        newValue: {
          active: false,
        },
      };

      auditLogsRepository.create.mockReturnValue(auditLog);
      auditLogsRepository.save.mockResolvedValue(auditLog);

      const result = await service.create(payload);

      expect(auditLogsRepository.create).toHaveBeenCalledTimes(1);

      expect(auditLogsRepository.create).toHaveBeenCalledWith({
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: 'admin-id',
        oldValue: {
          active: true,
        },
        newValue: {
          active: false,
        },
      });

      expect(auditLogsRepository.save).toHaveBeenCalledTimes(1);
      expect(auditLogsRepository.save).toHaveBeenCalledWith(auditLog);

      expect(result).toBe(auditLog);
    });

    it('should set optional fields to null when they are not provided', async () => {
      const payload: CreateAuditLogPayload = {
        action: AuditAction.DELETE,
        entity: AuditEntity.PRODUCT,
        entityId: 'product-id',
      };

      const auditLog = {
        id: 'audit-log-id',
        action: AuditAction.DELETE,
        entity: AuditEntity.PRODUCT,
        entityId: 'product-id',
        userId: null,
        oldValue: null,
        newValue: null,
      } as AuditLogEntity;

      auditLogsRepository.create.mockReturnValue(auditLog);
      auditLogsRepository.save.mockResolvedValue(auditLog);

      const result = await service.create(payload);

      expect(auditLogsRepository.create).toHaveBeenCalledWith({
        action: AuditAction.DELETE,
        entity: AuditEntity.PRODUCT,
        entityId: 'product-id',
        userId: null,
        oldValue: null,
        newValue: null,
      });

      expect(auditLogsRepository.save).toHaveBeenCalledWith(auditLog);

      expect(result).toBe(auditLog);
    });

    it('should allow audit log without userId', async () => {
      const payload: CreateAuditLogPayload = {
        action: AuditAction.CREATE,
        entity: AuditEntity.PRODUCT,
        entityId: 'product-id',
        oldValue: undefined,
        newValue: {
          name: 'New product',
        },
      };

      const auditLog: Partial<AuditLogEntity> = {
        id: 'audit-log-id',
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: 'admin-id',
        oldValue: {
          active: true,
        },
        newValue: {
          active: false,
        },
      };

      auditLogsRepository.create.mockReturnValue(auditLog);
      auditLogsRepository.save.mockResolvedValue(auditLog);

      await service.create(payload);

      expect(auditLogsRepository.create).toHaveBeenCalledWith({
        action: AuditAction.CREATE,
        entity: AuditEntity.PRODUCT,
        entityId: 'product-id',
        userId: null,
        oldValue: null,
        newValue: {
          name: 'New product',
        },
      });
    });

    it('should return saved audit log', async () => {
      const payload: CreateAuditLogPayload = {
        action: AuditAction.UPDATE,
        entity: AuditEntity.PRODUCT,
        entityId: 'product-id',
        userId: 'admin-id',
        oldValue: {
          isActive: true,
        },
        newValue: {
          isActive: false,
        },
      };

      const createdAuditLog = {
        action: AuditAction.UPDATE,
        entity: AuditEntity.PRODUCT,
        entityId: 'product-id',
      } as AuditLogEntity;

      const savedAuditLog = {
        ...createdAuditLog,
        id: 'audit-log-id',
      } as AuditLogEntity;

      auditLogsRepository.create.mockReturnValue(createdAuditLog);

      auditLogsRepository.save.mockResolvedValue(savedAuditLog);

      const result = await service.create(payload);

      expect(result).toBe(savedAuditLog);
    });

    it('should propagate repository error', async () => {
      const payload: CreateAuditLogPayload = {
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: 'admin-id',
        oldValue: {
          active: true,
        },
        newValue: {
          active: false,
        },
      };

      const auditLog = {
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
      } as AuditLogEntity;

      const error = new Error('Database error');

      auditLogsRepository.create.mockReturnValue(auditLog);
      auditLogsRepository.save.mockRejectedValue(error);

      await expect(service.create(payload)).rejects.toThrow('Database error');

      expect(auditLogsRepository.create).toHaveBeenCalledTimes(1);
      expect(auditLogsRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});

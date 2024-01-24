import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleEntity } from './entities';
import { RolesService } from './services';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  @ApiOperation({ summary: 'List of roles' })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    type: RoleEntity,
    isArray: true,
  })
  findAll(): Promise<RoleEntity[]> {
    return this.rolesService.findAll();
  }
}

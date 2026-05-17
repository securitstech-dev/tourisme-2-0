import { Controller, Get, Patch, Param, UseGuards, Body, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentStatus, UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('operators/pending')
  getPendingOperators() {
    return this.adminService.getPendingOperators();
  }

  @Get('operators')
  getAllOperators() {
    return this.adminService.getAllOperators();
  }

  @Patch('operators/:id/validate')
  validateOperator(@Param('id') id: string) {
    return this.adminService.validateOperatorAfterPayment(id);
  }

  @Patch('operators/:id/reject')
  rejectOperator(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.adminService.rejectOperator(id, body.reason);
  }

  @Patch('documents/:docId/status')
  updateDocumentStatus(
    @Param('docId') docId: string,
    @Body() body: { status: DocumentStatus; reason?: string }
  ) {
    return this.adminService.updateDocumentStatus(docId, body.status, body.reason);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getGlobalStats();
  }
  @Get('finance/summary')
  getFinancialSummary() {
    return this.adminService.getFinancialSummary();
  }

  @Patch('operators/manual')
  createManualRegistration(@Body() body: any) {
    return this.adminService.createManualRegistration(body);
  }

  @Delete('operators/:id')
  deleteOperator(@Param('id') id: string) {
    return this.adminService.deleteOperator(id);
  }
}

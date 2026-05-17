import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { BusinessType, SubscriptionPlan } from '@prisma/client';

/** Donnees autorisees pour la mise a jour du dossier operateur. */
export class UpdateOperatorProfileDto {
  @IsString()
  @MinLength(3)
  businessName: string;

  @IsEnum(BusinessType)
  businessType: BusinessType;

  @IsString()
  @MinLength(30)
  description: string;

  @IsOptional()
  @IsString()
  rccmNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsString()
  @MinLength(10)
  address: string;

  @IsOptional()
  @IsString()
  legalAddress?: string;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsString()
  @MinLength(9)
  phone: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsString()
  @MinLength(2)
  region: string;

  @IsEnum(SubscriptionPlan)
  subscriptionPlan: SubscriptionPlan;
}

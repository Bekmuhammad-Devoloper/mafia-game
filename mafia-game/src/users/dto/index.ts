import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VoiceType } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Telegram user ID' })
  @IsString()
  telegramId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserSettingsDto {
  @ApiPropertyOptional({ enum: VoiceType })
  @IsOptional()
  @IsEnum(VoiceType)
  voiceType?: VoiceType;

  @ApiPropertyOptional({ minimum: 0.5, maximum: 2.0 })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(2.0)
  voiceSpeed?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  volume?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  subtitlesEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoPlayEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  atmosphereEnabled?: boolean;
}

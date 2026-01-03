import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoryVariant } from '@prisma/client';

export class CreateRoomDto {
  @ApiProperty({ description: 'Xona nomi' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Xona egasi ID' })
  @IsString()
  hostId: string;

  @ApiPropertyOptional({ minimum: 4, maximum: 6 })
  @IsOptional()
  @IsNumber()
  @Min(4)
  @Max(6)
  minPlayers?: number;

  @ApiPropertyOptional({ minimum: 8, maximum: 16 })
  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(16)
  maxPlayers?: number;

  @ApiPropertyOptional({ description: 'Muhokama vaqti (sekundlarda)', minimum: 60, maximum: 300 })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(300)
  discussionTime?: number;

  @ApiPropertyOptional({ description: 'Ovoz berish vaqti (sekundlarda)', minimum: 30, maximum: 120 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(120)
  votingTime?: number;

  @ApiPropertyOptional({ description: 'Tun vaqti (sekundlarda)', minimum: 15, maximum: 60 })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(60)
  nightTime?: number;

  @ApiPropertyOptional({ enum: StoryVariant })
  @IsOptional()
  @IsEnum(StoryVariant)
  storyVariant?: StoryVariant;
}

export class JoinRoomDto {
  @ApiProperty({ description: 'Xona kodi (6 ta belgi)' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Foydalanuvchi ID' })
  @IsString()
  userId: string;
}

export class UpdateRoomDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(4)
  @Max(6)
  minPlayers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(16)
  maxPlayers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(300)
  discussionTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(120)
  votingTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(60)
  nightTime?: number;

  @ApiPropertyOptional({ enum: StoryVariant })
  @IsOptional()
  @IsEnum(StoryVariant)
  storyVariant?: StoryVariant;
}

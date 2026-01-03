import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartGameDto {
  @ApiProperty({ description: 'Xona ID' })
  @IsString()
  roomId: string;
}

export class NightActionDto {
  @ApiProperty({ description: 'O\'yin ID' })
  @IsString()
  gameId: string;

  @ApiProperty({ description: 'Harakat qiluvchi o\'yinchi ID' })
  @IsString()
  playerId: string;

  @ApiProperty({ description: 'Nishon o\'yinchi ID' })
  @IsString()
  targetId: string;
}

export class VoteDto {
  @ApiProperty({ description: 'O\'yin ID' })
  @IsString()
  gameId: string;

  @ApiProperty({ description: 'Ovoz beruvchi o\'yinchi ID' })
  @IsString()
  fromPlayerId: string;

  @ApiProperty({ description: 'Ovoz berilgan o\'yinchi ID' })
  @IsString()
  toPlayerId: string;
}

export class GameStateDto {
  @ApiProperty()
  gameId: string;

  @ApiProperty()
  phase: string;

  @ApiProperty()
  dayNumber: number;

  @ApiProperty()
  players: any[];

  @ApiPropertyOptional()
  currentAudio?: string;

  @ApiPropertyOptional()
  timer?: number;
}

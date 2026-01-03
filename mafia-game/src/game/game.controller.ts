import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { StartGameDto, NightActionDto, VoteDto } from './dto';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  @ApiOperation({ summary: 'O\'yinni boshlash' })
  @ApiResponse({ status: 201, description: 'O\'yin boshlandi' })
  async startGame(@Body() startGameDto: StartGameDto) {
    return this.gameService.startGame(startGameDto.roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'O\'yin holati' })
  async getGameState(@Param('id') id: string) {
    return this.gameService.getGameState(id);
  }

  @Get(':id/role/:userId')
  @ApiOperation({ summary: 'O\'yinchi rolini olish' })
  async getPlayerRole(
    @Param('id') gameId: string,
    @Param('userId') userId: string,
  ) {
    return this.gameService.getPlayerRole(gameId, userId);
  }

  @Get(':id/mafia/:userId')
  @ApiOperation({ summary: 'Mafia a\'zolari (faqat mafia uchun)' })
  async getMafiaMembers(
    @Param('id') gameId: string,
    @Param('userId') userId: string,
  ) {
    return this.gameService.getMafiaMembers(gameId, userId);
  }

  @Post(':id/night/start')
  @ApiOperation({ summary: 'Tunni boshlash' })
  async startNight(@Param('id') gameId: string) {
    return this.gameService.startNight(gameId);
  }

  @Post(':id/action/mafia')
  @ApiOperation({ summary: 'Mafia harakati' })
  async mafiaAction(@Body() dto: NightActionDto) {
    return this.gameService.mafiaAction(dto.gameId, dto.playerId, dto.targetId);
  }

  @Post(':id/action/sheriff')
  @ApiOperation({ summary: 'Sheriff tekshiruvi' })
  async sheriffAction(@Body() dto: NightActionDto) {
    return this.gameService.sheriffAction(dto.gameId, dto.playerId, dto.targetId);
  }

  @Post(':id/action/doctor')
  @ApiOperation({ summary: 'Doktor davolashi' })
  async doctorAction(@Body() dto: NightActionDto) {
    return this.gameService.doctorAction(dto.gameId, dto.playerId, dto.targetId);
  }

  @Post(':id/action/don')
  @ApiOperation({ summary: 'Don tekshiruvi' })
  async donAction(@Body() dto: NightActionDto) {
    return this.gameService.donAction(dto.gameId, dto.playerId, dto.targetId);
  }

  @Post(':id/night/resolve')
  @ApiOperation({ summary: 'Tun natijalarini hisoblash' })
  async resolveNight(@Param('id') gameId: string) {
    return this.gameService.resolveNight(gameId);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Ovoz berish' })
  async vote(@Body() dto: VoteDto) {
    return this.gameService.vote(dto.gameId, dto.fromPlayerId, dto.toPlayerId);
  }

  @Post(':id/voting/resolve')
  @ApiOperation({ summary: 'Ovoz berish natijalarini hisoblash' })
  async resolveVoting(@Param('id') gameId: string) {
    return this.gameService.resolveVoting(gameId);
  }

  @Post(':id/phase/:phase')
  @ApiOperation({ summary: 'Faza yangilash' })
  async updatePhase(
    @Param('id') gameId: string,
    @Param('phase') phase: string,
  ) {
    return this.gameService.updatePhase(gameId, phase as any);
  }
}

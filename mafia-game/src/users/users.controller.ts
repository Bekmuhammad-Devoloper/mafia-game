import { Controller, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserSettingsDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('leaderboard')
  @ApiOperation({ summary: 'Liderlar jadvali' })
  @ApiResponse({ status: 200, description: 'Liderlar ro\'yxati' })
  async getLeaderboard(
    @Query('limit') limit?: number,
    @Query('period') period?: string,
  ) {
    return this.usersService.getLeaderboard(limit || 20, period || 'all');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Foydalanuvchi ma\'lumotlari' })
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return this.usersService.toJSON(user);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Foydalanuvchi statistikasi' })
  async getUserStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }

  @Put(':id/settings')
  @ApiOperation({ summary: 'Foydalanuvchi sozlamalarini yangilash' })
  async updateSettings(
    @Param('id') id: string,
    @Body() settings: UpdateUserSettingsDto,
  ) {
    const user = await this.usersService.updateSettings(id, settings);
    return this.usersService.toJSON(user);
  }
}

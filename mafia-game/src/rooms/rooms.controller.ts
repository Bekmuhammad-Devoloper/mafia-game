import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, JoinRoomDto, UpdateRoomDto } from './dto';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi xona yaratish' })
  @ApiResponse({ status: 201, description: 'Xona yaratildi' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get('available')
  @ApiOperation({ summary: 'Ochiq xonalar ro\'yxati' })
  async getAvailableRooms() {
    return this.roomsService.findAvailableRooms();
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Kod bo\'yicha xona topish' })
  async findByCode(@Param('code') code: string) {
    const room = await this.roomsService.findByCode(code);
    return {
      ...room,
      currentPlayers: this.roomsService.getPlayersCount(room.id),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo\'yicha xona topish' })
  async findById(@Param('id') id: string) {
    const room = await this.roomsService.findById(id);
    return {
      ...room,
      currentPlayers: this.roomsService.getPlayersCount(room.id),
    };
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Xonaga qo\'shilish' })
  async joinRoom(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.roomsService.joinRoom(id, body.userId);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Xonadan chiqish' })
  async leaveRoom(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.roomsService.leaveRoom(id, body.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Xona sozlamalarini yangilash' })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xonani o\'chirish' })
  async delete(@Param('id') id: string) {
    return this.roomsService.delete(id);
  }
}

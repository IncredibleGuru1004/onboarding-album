import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import * as net from 'node:net';

@Controller()
export class TestController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test')
  async getTest() {
    const host = process.env.DB_HOST ?? 'localhost';
    const port = Number(process.env.DB_PORT ?? 3306);

    const canConnect = await new Promise<boolean>((resolve) => {
      const socket = net.createConnection({ host, port }, () => {
        socket.end();
        resolve(true);
      });

      socket.on('error', () => {
        resolve(false);
      });

      socket.setTimeout(3000, () => {
        socket.destroy();
        resolve(false);
      });
    });

    if (!canConnect) {
      throw new HttpException(
        {
          message: 'DB connection failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'DB connection successful',
    };
  }

  @Post('test/echo')
  echo(@Body() body: unknown) {
    return {
      received: body,
    };
  }
}

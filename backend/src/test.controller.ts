import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import * as net from 'node:net';

@ApiTags('test')
@Controller()
export class TestController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns the health status of the application',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test database connection' })
  @ApiResponse({
    status: 200,
    description: 'Database connection successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'DB connection successful' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Database connection failed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'DB connection failed' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Echo test endpoint' })
  @ApiBody({
    description: 'Any JSON object to echo back',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the received body',
    schema: {
      type: 'object',
      properties: {
        received: {
          type: 'object',
          additionalProperties: true,
        },
      },
    },
  })
  echo(@Body() body: unknown) {
    return {
      received: body,
    };
  }
}

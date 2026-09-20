import { Controller, Get, Query } from '@nestjs/common';
import { SearchAppService } from './search-app.service';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller('search-app')
export class SearchAppController {
  constructor(
    private readonly searchAppService: SearchAppService,
    private prisma: PrismaService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  //api/search-app?text=abc
  @Get()
  searchApp(@Query('text') text: string) {
    return this.searchAppService.searchApp(text);
  }
}

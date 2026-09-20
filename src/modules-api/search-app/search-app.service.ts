import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchAppService {
  constructor(
    private prisma: PrismaService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    this.initArticle();
    this.initFood();
  }

  async searchApp(text: string) {
    const result = await this.elasticsearchService.search({
      index: ['articles', 'food'],
      query: {
        multi_match: {
          query: text,
          fields: ['title', 'content', 'name', 'description'],
          operator: 'or', // dùng để tìm kiếm mềm, chỉ cần khớp 1 phần từ khóa
          fuzziness: 'AUTO', // cho phép tìm kiếm gần đúng, hữu ích khi người dùng gõ sai chính tả
          minimum_should_match: '60%', // yêu cầu ít nhất 60% từ khóa phải khớp
        },
      },
    });

    return result.hits.hits;
  }

  async initArticle() {
    //nạp dữ liệu ban đầu vào elastic search
    const article = await this.prisma.articles.findMany();
    article.forEach((item) => {
      this.elasticsearchService.index({
        index: 'articles', // tên index trong Elasticsearch
        id: String(item.id),
        document: item,
      });
    });
  }

  async initFood() {
    //nạp dữ liệu ban đầu vào elastic search
    const food = await this.prisma.foods.findMany();
    food.forEach((item) => {
      this.elasticsearchService.index({
        index: 'food', // tên index trong Elasticsearch
        id: String(item.id),
        document: item,
      });
    });
  }
}

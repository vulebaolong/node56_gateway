import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { buildQueryPrisma } from 'src/common/helpers/build-query-prisma.helper';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll(req) {
    // kiểm tra trong ram có cache k, nếu có thì trả về luôn
    // const value = await this.cacheManager.get('article');
    // if (value) {
    //   return value;
    // }

    const { where, page, pageSize, index } = buildQueryPrisma(req);

    const resultPrisma = await this.prisma.articles.findMany({
      where: where,
      skip: index, //Offset
      take: pageSize, //Limit
    });

    const totalItems = await this.prisma.articles.count({
      where: where,
    });
    const totalPages = Math.ceil(totalItems / pageSize);

    const result = {
      items: resultPrisma,
      totalItems: totalItems,
      totalPages: totalPages,
      page: page,
      pageSize: pageSize,
    };

    // lưu vào cache
    // 1000 = 1s
    // await this.cacheManager.set('article', result, 10000);
    // console.dir(this.cacheManager.stores, {
    //   depth: null,
    //   colors: true,
    // });
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}

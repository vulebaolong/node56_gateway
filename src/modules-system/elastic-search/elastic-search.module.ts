import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
} from 'src/common/constant/app.constant';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: ELASTICSEARCH_NODE,
      auth: {
        username: ELASTICSEARCH_USERNAME as string,
        password: ELASTICSEARCH_PASSWORD as string,
      },
      tls: {
        rejectUnauthorized: false, // cho phép kết nối với Elasticsearch qua HTTPS mà không cần xác thực chứng chỉ
      },
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticSearchModule {}

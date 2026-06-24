import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Автоматическая генерация схемы
      sortSchema: true,
      playground: true, // Включаем Playground для тестирования
    }),
  ],
})
export class AppGraphQLModule {}

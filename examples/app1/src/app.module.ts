import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module.js";
import { AppController } from "./app.controller.js";
import { RedisTestModule } from "lib1";

@Module({
  imports: [CatsModule, RedisTestModule],
  controllers: [AppController],
})
export class AppModule {}

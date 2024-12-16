import { Module, type OnApplicationShutdown } from "@nestjs/common";
import { setTimeout } from "timers/promises";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MathController } from "./math.controller";

export * from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MATH_SERVICE",
        transport: Transport.REDIS,
        options: {
          host: "localhost",
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [MathController],
})
export class RedisTestModule implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await setTimeout(1000);
    console.log("shutting down now");
  }
}

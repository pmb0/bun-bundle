import { Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";

@Controller("/math")
export class MathController {
  constructor(@Inject("MATH_SERVICE") private client: ClientProxy) {}

  @MessagePattern({ cmd: "sum" })
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }

  @Post()
  async test() {
    const pattern = { cmd: "sum" };
    const payload = [1, 2, 3];
    this.client.emit("bla", { bla: true });
    return this.client.send<number>(pattern, payload);
  }
}

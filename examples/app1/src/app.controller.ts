import { BadRequestException, Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/throws")
  throws() {
    throw new Error("This is a test error");
  }

  @Get("/bad")
  bad() {
    throw new BadRequestException("This is a bad request");
  }
}

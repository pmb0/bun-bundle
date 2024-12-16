import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import { Transport, type MicroserviceOptions } from "lib1";

const app = await NestFactory.create(AppModule);

app.useGlobalPipes(new ValidationPipe());
app.enableShutdownHooks();

const config = new DocumentBuilder()
  .setTitle("Cats example")
  .setDescription("The cats API description")
  .setVersion("1.0")
  .addTag("cats")
  .build();

const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup("api", app, documentFactory);

app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: {
    host: "localhost",
    port: 6379,
  },
});

await app.startAllMicroservices();
await app.listen(process.env.PORT ?? 3000);
console.log("Listening on", await app.getUrl());

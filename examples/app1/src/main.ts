import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Transport, type MicroserviceOptions } from "lib1";
import { AppModule } from "./app.module.js";
import * as Integrations from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import type { SamplingContext, Transaction } from "@sentry/types";

Sentry.init({
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Mongo(),
    new Integrations.ExtraErrorData(),
  ],
});

console.log("Sentry OK, NodeClient:", Sentry.NodeClient.name);

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

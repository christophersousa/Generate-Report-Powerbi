import fastify from "fastify";
import cors from '@fastify/cors'
import { tokenRoutes } from "./routes/generated_token";
import fastifyEnv from "@fastify/env";
import path from "path";

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3030
    }
  }
}


const envPath = path.resolve(__dirname, '..', '.env');

const options = {
  schema: schema,
  dotenv: {
    path: envPath,
    debug: true
  }
}

const app = fastify()

app.register(fastifyEnv, options)
app.register(cors,{
  origin: true, // All URLs
})

app.register(tokenRoutes)

app.listen({
  port: 3030,
}).then(() => {
  console.log('listening on port 3030')
})
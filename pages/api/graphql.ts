import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import Cors from "micro-cors";
import {
  ObjectType,
  Field,
  ID,
  Resolver,
  Query,
  buildSchema,
} from "type-graphql";
import path from "path";

import { DogsResolver } from "./dogs.resolver";

@ObjectType()
class Framework {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
}

@Resolver(Framework)
class FrameworkResolver {
  constructor() {}

  @Query(() => [Framework])
  frameworks() {
    return [
      {
        id: "1",
        name: "React",
      },
      {
        id: "2",
        name: "Vue",
      },
      {
        id: "3",
        name: "Angular",
      },
      {
        id: "4",
        name: "Ember",
      },
    ];
  }
}

const schema = await buildSchema({
  resolvers: [DogsResolver],
});

const server = new ApolloServer({
  schema,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors();
const startServer = server.start();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
});

import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typedefs";
import { resolvers } from "./resolvers";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler(server);
export { handler as GET, handler as POST };

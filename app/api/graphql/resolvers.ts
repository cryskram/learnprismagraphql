import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    users: async () =>
      await prisma.user.findMany({
        orderBy: {
          createdAt: "asc",
        },
      }),
    user: async (_: never, { id }: { id: string }) =>
      await prisma.user.findUnique({ where: { id: id } }),
    posts: async () =>
      await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),
    post: async (_: never, { id }: { id: string }) =>
      await prisma.post.findUnique({ where: { id: id } }),
  },

  Mutation: {
    createUser: async (
      _: never,
      { email, name }: { email: string; name: string }
    ) => {
      return await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    },

    createPost: async (
      _: never,
      {
        title,
        content,
        authorId,
      }: { title: string; content: string; authorId: string }
    ) => {
      return await prisma.post.create({
        data: {
          title,
          content,
          authorId,
        },
      });
    },

    publishPost: async (_: never, { id }: { id: string }) => {
      const getPost = await prisma.post.findUnique({ where: { id } });
      return await prisma.post.update({
        where: { id },
        data: { published: !getPost?.published, updatedAt: new Date() },
      });
    },
  },

  User: {
    posts: (parent) => {
      return prisma.post.findMany({ where: { authorId: parent.id } });
    },
  },
  Post: {
    author: (parent) => {
      return prisma.user.findUnique({ where: { id: parent.authorId } });
    },
  },
};

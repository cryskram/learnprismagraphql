"use client";

import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { FormEvent, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      posts {
        id
        title
        content
        published
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String, $authorId: ID!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      published
      author {
        id
        name
        email
      }
    }
  }
`;

const TOGGLE_POST = gql`
  mutation PublishPost($id: ID!) {
    publishPost(id: $id) {
      id
      title
      content
      published
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export default function Home() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createPost, { loading: postLoading }] = useMutation(CREATE_POST);
  const [publishPost] = useMutation(TOGGLE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createPost({
      variables: {
        title,
        content,
        authorId,
      },
    })
      .then((res) => {
        console.log("post created:", res.data.createPost);
        setTitle("");
        setContent("");
        setAuthorId("");
        refetch();
      })
      .catch((err) => {
        console.log("Error creating post:", err);
      });
  };

  const handleToggle = (id: string) => {
    publishPost({ variables: { id } })
      .then(() => {
        refetch();
      })
      .catch((e) => {
        console.log("Error publishing post:", e);
      });
  };

  if (loading) return <p>Loading..</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="mt-8 w-3/4 mx-auto">
        <h1>Create Post</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Title"
          />
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Content"
          />
          <select
            id="author"
            required
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select an author</option>
            {data.users.map((user) => (
              <option className="bg-black" key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            type="submit"
            disabled={postLoading}
          >
            {postLoading ? "Creating..." : "Create post"}
          </button>
        </form>
      </div>
      <ul className="w-1/2 mx-auto">
        {data.users.map((user, idx: number) => (
          <div className="mb-10" key={idx}>
            <li className="text-2xl font-bold text-gray-500">@{user.name}</li>
            {user.posts.length === 0 ? (
              <div>
                <h1 className="text-xl">no posts</h1>
              </div>
            ) : (
              <div>
                {user.posts.map((post, id: number) => (
                  <div
                    key={id}
                    className="flex items-center justify-between bg-gray-600 my-4 px-4 py-2 rounded-lg"
                  >
                    <div>
                      <h1 className="text-2xl font-bold">{post.title}</h1>
                      <p>{post.content}</p>
                      <button
                        onClick={() => handleToggle(post.id)}
                        className={
                          post.published
                            ? "bg-green-400 text-black px-2 py-1 rounded w-max cursor-pointer"
                            : "bg-red-400 text-white px-2 py-1 rounded w-max cursor-pointer"
                        }
                      >
                        {post.published ? "Published" : "Draft"}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        deletePost({ variables: { id: post.id } });
                        refetch();
                      }}
                    >
                      <FaRegTrashCan
                        size={40}
                        className="bg-red-600 p-2 rounded-xl"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchAuthQuery } from "@/lib/auth-server";

export default async function Page({
  params,
}: Readonly<{ params: Promise<{ id: Id<"posts"> }> }>) {
  const { id } = await params;
  const data = await fetchAuthQuery(api.posts.getPostById, { id });
  if (!data) {
    return null;
  }
  return (
    <div>
      <h2>Blog Id - {id}</h2>
      <h1>{data.title}</h1>
      <h1>{data.authorEmail}</h1>
      <p className="whitespace-pre-line">{data.content}</p>
    </div>
  );
}

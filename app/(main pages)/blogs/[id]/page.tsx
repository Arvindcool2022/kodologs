export default async function Page({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return (
    <div>
      <h2>Blog Id - {id}</h2>
    </div>
  );
}

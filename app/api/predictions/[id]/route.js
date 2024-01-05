export async function GET(req, { params }) {
  const id = params.id;

  const response = await fetch("https://api.replicate.com/v1/predictions/" + id, {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
    next: { revalidate: 0 },
  });

  if (response.status !== 200) {
    const error = await response.json();
    return Response.json({ status: "error", message: error.detail });
  }

  const prediction = await response.json();
  return Response.json({ status: "success", data: prediction });
}

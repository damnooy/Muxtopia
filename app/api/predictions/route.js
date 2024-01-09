export async function POST(req) {
  const { prompt, duration } = await req.json();
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
      input: {
        top_k: 250,
        top_p: 0,
        prompt: prompt,
        duration: duration ? parseInt(duration) : 3,
        temperature: 1,
        continuation: false,
        model_version: "stereo-large",
        output_format: "wav",
        continuation_start: 0,
        multi_band_diffusion: false,
        normalization_strategy: "peak",
        classifier_free_guidance: 3,
      },
    }),
  });

  if (response.status !== 201) {
    const error = await response.json();
    return Response.json({ status: "error", message: error.detail });
  }

  const prediction = await response.json();
  return Response.json({ status: "success", data: prediction });
}

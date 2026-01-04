export async function refineImage(
  imageBase64: string,
  prompt: string,
  constraints: object
): Promise<string> {

  const res = await fetch("http://localhost:8000/refine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_base64: imageBase64,
      prompt,
      constraints,
    }),
  });

  const data = await res.json();
  return data.image_base64;
}

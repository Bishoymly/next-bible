import { getDownloadUrl, list } from "@vercel/blob";
import { getURL, imageExists, uploadImage } from "../lib/blobStorage";
import crypto from "crypto";
import OpenAI from "openai";
const openai = new OpenAI();

export async function GetCachedImage(key) {
  const existingBlobs = await list({
    limit: 1,
    prefix: key,
  });

  if (existingBlobs.blobs.length > 0) {
    return existingBlobs.blobs[0].url;
  }
  return null;
}

export default async function GenerateImage({ key, prompt }) {
  //console.log(prompt);
  // Generate a unique key for the image based on the prompt
  //const imageKey = `${crypto.createHash("md5").update(prompt).digest("hex")}.png`;
  const imageKey = `${key}.png`;

  const existingBlobs = await list({
    limit: 1,
    prefix: key,
  });

  if (existingBlobs.blobs.length > 0) {
    return existingBlobs.blobs[0].url;
  }
  return null;

  // If the image doesn't exist, generate a new one using DALL-E 3
  /*const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  // Fetch the generated image from the URL
  const imageUrl = response.data[0].url;
  const imageResponse = await fetch(imageUrl);
  let imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

  // Save the image in Vercel Blob storage
  return await uploadImage(imageKey, imageBuffer);*/
}

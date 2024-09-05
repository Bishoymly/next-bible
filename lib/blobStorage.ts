import { put, getDownloadUrl, head } from "@vercel/blob";

// Function to upload image buffer to Vercel Blob
export const uploadImage = async (key, buffer) => {
  const { url } = await put(key, buffer, {
    access: "public",
    contentType: "image/png",
  });

  return url;
};

// Function to fetch an image from Vercel Blob
export async function imageExists(key) {
  console.log(key);
  const response = await head("https://ltfwyq7brtlu1mhp.public.blob.vercel-storage.com/" + key);
  console.log(response);
  return response;
}

export function getURL(key) {
  return getDownloadUrl(key);
}

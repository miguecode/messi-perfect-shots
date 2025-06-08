import { cloudinary } from "./cloudinaryClient";
import { twitterClient } from "./twitterClient";

/**
 * Gets a random image URL from the 'Messi' folder in Cloudinary.
 * It fetches up to 100 images, sorts them by public_id in descending order,
 * and selects one randomly.
 */
async function getRandomImageUrlFromCloudinary(): Promise<string> {
  const result = await cloudinary.search
    .expression("folder:Messi")
    .sort_by("public_id", "desc")
    .max_results(100)
    .execute();

  // If no result are found, throw an error
  if (!result) {
    throw new Error("No hubo respuesta en la búsqueda de Cloudinary.");
  }

  // Extract the resources from the response
  const resources = result.resources;

  // If no resources are found, throw an error
  if (!resources || resources.length === 0) {
    throw new Error("No se encontraron recursos en la carpeta llamada 'Messi'.");
  }

  // Select a random image
  const randomIndex = Math.floor(Math.random() * resources.length);

  // Return the URL from the selected image
  return resources[randomIndex].secure_url;
}

/**
 * Downloads an image from Cloudinary using the given URL.
 * Converts the response to a Buffer for Twitter API upload.
 */
async function downloadImageFromCloudinary(randomImageUrl: string) {
  // Downloads the image from Cloudinary
  const response = await fetch(randomImageUrl);

  if (!response.ok) {
    throw new Error(`No se pudo descargar la imagen: ${response.statusText}`);
  }

  // Convert the image data to a Node.js Buffer
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Uploads the image to Twitter using the v1 media endpoint.
 * Returns the media ID required to attach media to a tweet.
 */
async function uploadImageToTwitter(imageBuffer: Buffer): Promise<string> {
  const mediaId = await twitterClient.v1.uploadMedia(imageBuffer, {
    mimeType: "image/jpeg",
  });

  return mediaId;
}

/**
 * Posts a tweet containing the uploaded image using its media ID.
 */
async function postImageOnTwitter(mediaId: string): Promise<void> {
  await twitterClient.v2.tweet({
    text: "", // Optional
    media: {
      media_ids: [mediaId],
    },
  });
}

/**
 * Main runner function that orchestrates:
 * 1. Fetching a random image URL
 * 2. Downloading it
 * 3. Uploading it to Twitter
 * 4. Posting the tweet
 */
async function run(): Promise<void> {
  try {
    const imageUrl = await getRandomImageUrlFromCloudinary();
    const imageBuffer = await downloadImageFromCloudinary(imageUrl);
    const mediaId = await uploadImageToTwitter(imageBuffer);
    await postImageOnTwitter(mediaId);

    console.log(`✅ Tweet publicado correctamente. URL de la imagen: ${imageUrl}`);
  } catch (error) {
    console.error(`❌ Error al publicar el tweet: ${error}`);
  }
}

// Run the main function
run();
import { cloudinary } from "./cloudinaryClient";
import { twitterClient } from "./twitterClient";

/**
 * Gets a random image URL from the 'Messi' folder in Cloudinary.
 * It fetches up to 100 images, sorts them by public_id in descending order,
 * and selects one randomly.
 */
async function getRandomImageUrlFromCloudinary(): Promise<{
  secure_url: string;
  public_id: string;
}> {
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
    throw new Error(
      "No se encontraron recursos en la carpeta llamada 'Messi'."
    );
  }

  // Select a random image
  const randomIndex = Math.floor(Math.random() * resources.length);

  // Gets the secure_url and public_id from the selected image
  const { secure_url, public_id } = resources[randomIndex];

  // Return an object with both values
  return { secure_url, public_id };
}

/**
 * Downloads an image from Cloudinary using the given URL.
 * Converts the response to a Buffer for Twitter API upload.
 */
async function downloadImageFromCloudinary(randomImageUrl: string) {
  // Downloads the image from Cloudinary
  const response = await fetch(randomImageUrl);

  if (!response.ok) {
    throw new Error(
      `No se pudo descargar la imagen desde Cloudinary: ${response.statusText}`
    );
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
 * Moves the posted image to the posted images folder
 */
async function moveImageToPostedFolder(publicId: string): Promise<void> {
  const newPublicId = publicId.replace("Messi/", "MessiPosted/");

  await cloudinary.uploader.rename(publicId, newPublicId);
}

/**
 * Main runner function that orchestrates:
 * 1. Fetching a random image URL
 * 2. Downloading it
 * 3. Uploading it to Twitter
 * 4. Posting the tweet
 * 5. Move the posted image
 */
async function run(): Promise<void> {
  try {
    const { secure_url, public_id } = await getRandomImageUrlFromCloudinary();
    const imageBuffer = await downloadImageFromCloudinary(secure_url);
    const mediaId = await uploadImageToTwitter(imageBuffer);
    await postImageOnTwitter(mediaId);
    await moveImageToPostedFolder(public_id);

    console.log(
      `✅ Tweet publicado correctamente. URL de la imagen: ${secure_url}`
    );
  } catch (error) {
    console.error(`❌ Error al publicar el tweet: ${error}`);
  }
}

// Run the main function
run();
import { config } from "dotenv";
config();

import { cloudinary } from "./cloudinaryClient";
import { twitterClient } from "./twitterClient";

/**
 * Gets a random image URL from Cloudinary (except for images already posted).
 */
async function getRandomImageUrlFromCloudinary(): Promise<{
  secure_url: string;
  public_id: string;
}> {
  const result = await cloudinary.search
    .expression("resource_type:image AND NOT public_id:Posted-*")
    .max_results(350)
    .execute();

  // If no result are found, throw an error
  if (!result) {
    throw new Error("Falló la búsqueda de Cloudinary, no hubo resultado.");
  }

  // Extract the resources from the response
  const resources = result.resources;

  // If no resources are found, throw an error
  if (!resources || resources.length === 0) {
    throw new Error(
      "No se encontraron recursos en el resultado de búsqueda de Cloudinary."
    );
  }

  // Select a random image
  const randomIndex = Math.floor(Math.random() * resources.length);

  // Gets the secure_url and public_id from the selected image
  const { secure_url, public_id } = resources[randomIndex];

  console.log("📷 Se seleccionó una imagen.");
  console.log("📄 ID Pública: ", public_id);

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

  if (!mediaId) throw new Error("No se pudo obtener el mediaId de la imagen.");

  return mediaId;
}

/**
 * Posts a tweet containing the uploaded image using its media ID.
 */
async function postImageOnTwitter(mediaId: string): Promise<void> {
  try {
    await twitterClient.v2.tweet({
      text: "", // Optional
      media: {
        media_ids: [mediaId],
      },
    });
  } catch (error) {
    console.log(`No se pudo publicar el tweet: ${error}`);
  }
}

/**
 * Changes the public_id of the image (to prevent repetitions).
 */
async function updateImagePublicId(publicId: string): Promise<string> {
  try {
    const newPublicId = `Posted-${publicId}`;
    await cloudinary.uploader.rename(publicId, newPublicId);
    return newPublicId;
  } catch (error) {
    console.error(`No se pudo renombrar la ID pública de la imagen: ${error}`);
    return publicId;
  }
}

/**
 * Changes the display_name visible on the Cloudinary UI (a detail).
 */
async function updateDisplayName(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      display_name: publicId,
    });
  } catch (error) {
    console.error(`No se pudo renombrar el display_name: ${error}`);
  }
}

/**
 * Gets the new URL of the posted image from Cloudinary (to display in the console).
 * The URL is new because we updated the public ID of the image.
 */
async function getNewUrlImageFromCloudinary(publicId: string): Promise<string> {
  try {
    const result = await cloudinary.api.resource(publicId, {
      type: "upload",
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error(
      `No se pudo obtener la nueva URL de la imagen renombrada: ${error}`
    );
    return publicId;
  }
}

/**
 * Main runner function that orchestrates:
 * 1. Fetching a random image URL
 * 2. Downloading it
 * 3. Uploading it to Twitter
 * 4. Posting the tweet
 * 5. Update public_id and display_name of the image
 */
async function run(): Promise<void> {
  try {
    const { secure_url, public_id } = await getRandomImageUrlFromCloudinary();
    console.log("\n✅ [1/5] Lista de URLs e imagen aleatoria obtenidas.");

    const imageBuffer = await downloadImageFromCloudinary(secure_url);
    console.log("✅ [2/5] Imagen seleccionada descargada correctamente.");

    const mediaId = await uploadImageToTwitter(imageBuffer);
    console.log("✅ [3/5] Imagen subida al servidor de Twitter correctamente.");

    await postImageOnTwitter(mediaId);
    console.log("✅ [4/5] Tweet publicado correctamente.");

    const renamedPublicId = await updateImagePublicId(public_id);
    await updateDisplayName(renamedPublicId);
    console.log(
      `✅ [5/5] Public_id y display_name renombrados correctamente: ${renamedPublicId}`
    );

    const newUrl = await getNewUrlImageFromCloudinary(renamedPublicId);
    console.log(`\n🔗 URL de la imagen publicada y renombrada: ${newUrl}`);

    console.log(
      "\n🚀 Todo el proceso se completó correctamente. ¡Tweet publicado y backup hecho! 😁"
    );
  } catch (error) {
    console.error(`❌ Error durante el proceso: ${error}`);
  }
}

// Run the main function
run();

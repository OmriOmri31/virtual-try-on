import { Client } from "@gradio/client";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function fetchLocalImage(filePath) {
    return new Blob([fs.readFileSync(filePath)]);
}

async function performTryOn() {
    const personImage = await fetchLocalImage(path.resolve('./assets/image1.jpg'));
    const garmentImage = await fetchLocalImage(path.resolve('./assets/image2.jpg'));

    const client = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On");
    const result = await client.predict("/tryon", {
        person_img: personImage,
        garment_img: garmentImage,
        seed: 0,
        randomize_seed: true,
    });

    console.log(result.data); // Log the response data to see the structure

    const imageUrl = result.data[0].url; // Extract the URL of the generated image
    const response = await fetch(imageUrl); // Fetch the image from the URL
    const imageBuffer = await response.buffer(); // Convert the response to a buffer

    const outputFilePath = path.resolve('./assets/output.webp');
    fs.writeFileSync(outputFilePath, imageBuffer); // Save the buffer to a file

    console.log(`Image saved to ${outputFilePath}`);
}

performTryOn();

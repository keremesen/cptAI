import redis from "@/utils/redis";
import requestIp from "request-ip";

import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

async function readStream(stream: any) {
  // Get a reader
  const reader = stream.getReader();

  // A variable to store the final result
  let result = "";

  // A TextDecoder instance
  const decoder = new TextDecoder();

  // A loop to read the data
  while (true) {
    // Read a chunk
    const { value, done } = await reader.read();

    // If there is no more data, break the loop
    if (done) {
      break;
    }

    // If there is data, decode it and append it to the result
    result += decoder.decode(value);
  }

  // Return the result
  return result;
}

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

// Create a new ratelimiter, that allows 3 requests every 15 minutes
const ratelimit = redis
  ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(3, "1440 m"),
    analytics: true,
  })
  : undefined;

async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  // Rate Limiter Code
  // if (ratelimit) {
  //   const identifier = requestIp.getClientIp(req);
  //   const result = await ratelimit.limit(identifier!);
  //   res.setHeader("X-RateLimit-Limit", result.limit);
  //   res.setHeader("X-RateLimit-Remaining", result.remaining);


  //   if (!result.success) {
  //     res
  //       .status(429)
  //       .json(
  //         "Too many uploads in 1 day. Please try again after 24 hours."
  //       );
  //     return;
  //   }
  // }

  const data = await readStream(req.body);
  // Parse the data into JSON
  const imageUrl = JSON.parse(data).imageUrl;


  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",

    body: JSON.stringify({
      version:
        "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      input: {
        image: imageUrl,
        task: "image_captioning",
      },
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
      Accept: 'application/json',
    },
  });

  let jsonStartResponse = await startResponse.json()
  let endpointUrl = jsonStartResponse.urls.get


  if (!endpointUrl) {
    // Handle the case when the endpoint URL is missing
    return new NextResponse(
      JSON.stringify({ error: "Endpoint URL is missing" }),
      { status: 500 }
    );
  }

  // GET request to get the status of the image restoration process & return the result when it's ready
  let caption: string | null = null;
  while (!caption) {
    // Loop in 1s intervals until the alt text is ready
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
      caption = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  let finalCaption: string = caption ? caption : "Failed"
  return new NextResponse(finalCaption, { status: 200 })

}
export { handler as POST }


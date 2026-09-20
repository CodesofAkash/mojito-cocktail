import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "../env";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
});

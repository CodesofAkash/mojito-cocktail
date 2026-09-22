import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "../env";

// browserToken stays false: it would ship a Sanity token to every visitor,
// and the public site only ever reads published content.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: false,
});

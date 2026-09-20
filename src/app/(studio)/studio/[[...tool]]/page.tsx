import Studio from "./Studio";

// Importing sanity.config from a server component makes Next resolve swr's
// "react-server" entry, which exports no default — Sanity 6 imports one.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}

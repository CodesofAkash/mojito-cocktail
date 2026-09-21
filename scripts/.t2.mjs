import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
for (const l of readFileSync(".env.local","utf8").split("\n")){const[k,...r]=l.split("=");if(k&&r.length&&!process.env[k.trim()])process.env[k.trim()]=r.join("=").trim();}
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,apiVersion:process.env.NEXT_PUBLIC_SANITY_API_VERSION,token:process.env.SANITY_API_WRITE_TOKEN,useCdn:false});
await c.patch("siteSettings-en-IN").set({"cookieConsent.message":process.argv[2]}).commit();
console.log("published new banner text");

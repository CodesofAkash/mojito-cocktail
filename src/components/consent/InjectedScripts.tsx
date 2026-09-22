"use client";

import { useEffect } from "react";

type Target = "head" | "bodyEnd";

// AK-SAN-030 — a browser does not execute a <script> inserted as innerHTML.
// Pasted markup rendered with dangerouslySetInnerHTML appears in the DOM and
// does nothing, which reads as "the embed is broken" rather than as a bug here.
// Only a freshly created element, appended, runs.
export function InjectedScripts({ html, target }: { html: string | null; target: Target }) {
  useEffect(() => {
    if (!html) return;

    const parent = target === "head" ? document.head : document.body;
    const parsed = document.createRange().createContextualFragment(html);
    const added: Node[] = [];

    for (const node of Array.from(parsed.childNodes)) {
      if (node instanceof HTMLScriptElement) {
        const fresh = document.createElement("script");
        for (const { name, value } of Array.from(node.attributes)) {
          fresh.setAttribute(name, value);
        }
        fresh.text = node.text;
        parent.appendChild(fresh);
        added.push(fresh);
        continue;
      }
      const clone = node.cloneNode(true);
      parent.appendChild(clone);
      added.push(clone);
    }

    // Without this, a remount stacks a second copy of every embed.
    return () => {
      for (const node of added) node.parentNode?.removeChild(node);
    };
  }, [html, target]);

  return null;
}

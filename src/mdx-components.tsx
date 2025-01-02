import type { MDXComponents } from "mdx/types";

import { LinkPreview } from "@/components/ui/link-preview";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ href, ...props }) =>
      href.startsWith("http") ? (
        <LinkPreview url={href} {...props} />
      ) : (
        <a {...props} href={href} />
      ),
  };
}

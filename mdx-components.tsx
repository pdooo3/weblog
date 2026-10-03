import type { MDXComponents } from "mdx/types";
import CodeBlock from "@/components/CodeBlock";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock,
    // استایل برای کدهای درون‌خطی ساده مثل `npm install`
    code: ({ children, className }) => {
      // اگر داخل بلاک چندخطی باشد دست نمی‌زنیم
      if (className && className.includes("language-")) {
        return <code className={className}>{children}</code>;
      }
      return (
        <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-sm font-mono text-pink-400">
          {children}
        </code>
      );
    },
  };
}

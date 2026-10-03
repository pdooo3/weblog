"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodeBlock({ children }: any) {
  // MDX تگ code را داخل pre قرار می‌دهد، اینجا پیدایش می‌کنیم
  const codeElement = React.isValidElement(children) ? children : null;

  // استخراج نام زبان از className که روی تگ code قرار دارد (مثل language-javascript)
  const className = (codeElement?.props as any)?.className || "";
  const match = /language-(\w+)/.exec(className);
  const language = match ? match[1] : "text";

  // استخراج متن خام کد
  const rawCode = (codeElement?.props as any)?.children ?? children;
  const codeString = String(rawCode).replace(/\n$/, "");

  return (
    <div
      dir="ltr"
      className="my-6 overflow-hidden rounded-xl border border-neutral-800 shadow-md text-left"
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={true}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "#1e1e1e",
          fontSize: "0.875rem",
          lineHeight: "1.6",
        }}
        lineNumberStyle={{
          color: "#6e7681",
          minWidth: "2.5em",
          paddingRight: "1em",
          userSelect: "none",
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

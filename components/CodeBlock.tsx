"use client";

import { useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick01Icon } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockProps {
  language: string;
  code: string;
}

const syntaxColors: Record<string, string> = {
  keyword: "var(--color-code-keyword)",
  string: "var(--color-code-string)",
  function: "var(--color-code-function)",
  comment: "var(--color-code-comment)",
};

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <div className="my-3 rounded-[6px] border border-line bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line">
        <span
          className="text-xs font-[500] text-muted leading-4 lowercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {language}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 text-xs font-[500] leading-4 text-muted hover:text-ink transition-colors duration-100"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="tick"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={Tick01Icon} size={16} />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={Copy01Icon} size={16} />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre
          className="px-4 py-3 text-[13.5px] leading-[22px]"
          style={{ fontFamily: "var(--font-geist-mono)", color: "var(--color-code-text)" }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function highlightSyntax(code: string): React.ReactNode {
  const lines = code.split("\n");
  return lines.map((line, i) => (
    <div key={i} className="whitespace-pre">
      {tokenizeLine(line)}
    </div>
  ));
}

function tokenizeLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(\b(const|let|var|function|return|if|else|for|while|import|export|from|async|await|type|interface|class|extends|implements|new|throw|try|catch|finally|typeof|instanceof|in|of|as|abstract|private|protected|public|static|readonly|enum|declare|namespace|module|package|yield|default|switch|case|break|continue|do|void|this|super|with)\b)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/\/.*$)|(\b[A-Z]\w*(?=\s*[<(])?)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(line.slice(lastIndex, match.index));
    }
    if (match[1]) {
      tokens.push(
        <span key={match.index} style={{ color: syntaxColors.keyword }}>
          {match[1]}
        </span>
      );
    } else if (match[2]) {
      tokens.push(
        <span key={match.index} style={{ color: syntaxColors.string }}>
          {match[2]}
        </span>
      );
    } else if (match[3]) {
      tokens.push(
        <span key={match.index} style={{ color: syntaxColors.comment }}>
          {match[3]}
        </span>
      );
    } else if (match[4]) {
      tokens.push(
        <span key={match.index} style={{ color: syntaxColors.function }}>
          {match[4]}
        </span>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push(line.slice(lastIndex));
  }

  return tokens.length > 0 ? tokens : [line];
}

export function CodeBlockHighlighted({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <div className="my-3 rounded-[6px] border border-line bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line">
        <span
          className="text-xs font-[500] text-muted leading-4 lowercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {language}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 text-xs font-[500] leading-4 text-muted hover:text-ink transition-colors duration-100"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="tick"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={Tick01Icon} size={16} />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={Copy01Icon} size={16} />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre
          className="px-4 py-3 text-[13.5px] leading-[22px]"
          style={{ fontFamily: "var(--font-geist-mono)", color: "var(--color-code-text)" }}
        >
          <code>{highlightSyntax(code)}</code>
        </pre>
      </div>
    </div>
  );
}

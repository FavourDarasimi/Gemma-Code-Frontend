"use client";

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  "Explain how React reconciliation works",
  "Write a debounce function in TypeScript",
  "Help me debug this error: Cannot read properties of undefined",
  "Refactor this callback chain into async/await",
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <p className="t-label text-muted mb-4">
          {" > ready"}
        </p>
        <p className="text-base text-muted leading-6 mb-8">
          Ask about a bug, paste a stack trace, or describe what you&apos;re building.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="px-4 py-2 rounded-[6px] text-sm text-ink border border-line bg-transparent hover:bg-surface hover:border-muted/30 transition-colors duration-150 ease-out"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

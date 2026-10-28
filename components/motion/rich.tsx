import { Fragment } from "react";

// Textele pot conține *accente* - cuvinte afișate în italic serif.
export interface Token {
  text: string;
  em: boolean;
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  text.split("*").forEach((part, index) => {
    const em = index % 2 === 1;
    part
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => tokens.push({ text: word, em }));
  });
  return tokens;
}

export const plain = (text: string) => text.replaceAll("*", "");

export function Rich({ text, emClassName = "serif-i" }: { text: string; emClassName?: string }) {
  return (
    <>
      {text.split("*").map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className={emClassName}>
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}

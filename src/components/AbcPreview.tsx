import { useEffect, useRef } from "react";
import abcjs from "abcjs";
import type { Theme } from "../types/abc";

interface AbcPreviewProps {
  value: string;
  theme?: Theme;
}

export const AbcPreview = ({ value, theme = 'light' }: AbcPreviewProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      abcjs.renderAbc(ref.current, value, {
        responsive: "resize",
        foregroundColor: theme === 'dark' ? "#ffffff" : "#000000",
        format: {
          titlefont: "serif 20",
        },
      });
    }
  }, [value, theme]);

  return <div ref={ref} className="w-full abc-preview" data-theme={theme} />;
};

import { useState } from "react";
import { AbcEditor } from "./components/AbcEditor";
import { AbcPreview } from "./components/AbcPreview";
import type { Theme } from "./types/abc";

function App() {
  const [abc, setAbc] = useState(`X:1
T:Untitled
M:4/4
K:C
F A D E  D A G E |`);
  const [theme, setTheme] = useState<Theme>('light');

  const colors = theme === 'dark'
    ? { bg: '#0a0a0a', previewBg: '#161616', previewInner: '#1a1a1a' }
    : { bg: '#e5e5e5', previewBg: '#f5f5f5', previewInner: '#ffffff' };

  return (
    <div className="h-screen flex flex-col bg-slate-950" style={{ backgroundColor: colors.bg }}>
      {/* テーマ切り替えボタン */}
      <div className="flex justify-end p-2" style={{ backgroundColor: colors.bg }}>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{
            backgroundColor: theme === 'dark' ? '#333' : '#ddd',
            color: theme === 'dark' ? '#fff' : '#000'
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      <div className="flex-1 flex flex-col-reverse md:flex-row">
        {/* 左側: エディタ */}
        <div className="w-full md:w-1/2 h-2/3 md:h-full">
          <AbcEditor value={abc} onChange={setAbc} theme={theme} />
        </div>

        {/* 右側: プレビュー */}
        <div className="w-full md:w-1/2 h-1/3 md:h-full flex flex-col p-4" style={{ backgroundColor: colors.previewBg }}>
          <div className="w-full h-full rounded-lg border border-slate-600 overflow-auto p-4" style={{ backgroundColor: colors.previewInner }}>
            <AbcPreview value={abc} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

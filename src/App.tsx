import { useState } from "react";
import { AbcEditor } from "./components/AbcEditor";
import { AbcPreview } from "./components/AbcPreview";

function App() {
  const [abc, setAbc] = useState(`X:1
T:タイトル
M:4/4
K:C
C D E F | G A B c |`);

  return (
    <div className="h-screen flex bg-slate-950">
      <AbcEditor value={abc} onChange={setAbc} />

      {/* 右側: プレビュー */}
      <div className="w-1/2 overflow-auto p-6" style={{ backgroundColor: '#161616' }}>
        <AbcPreview abc={abc} />
      </div>
    </div>
  );
}

export default App;

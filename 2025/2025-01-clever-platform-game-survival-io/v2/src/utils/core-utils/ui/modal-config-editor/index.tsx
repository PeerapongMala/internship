import { useState, useEffect } from 'react';
import { RectTransform } from '@core-utils/ui/rect-transform/RectTransform';
import { Anchor } from '@core-utils/ui/rect-transform/type';
import { ConfigEditorPhase } from '@core-utils/scene/GameplayTemplate';

interface ModalConfigEditorProps<T = any> {
  configData: T | null;
  onConfirm: (editedConfig: T) => void;
  onDownload?: (editedConfig: T) => void;
  phase: ConfigEditorPhase;
}

export const ModalConfigEditor = <T = any>({
  configData,
  onConfirm,
  onDownload,
  phase,
}: ModalConfigEditorProps<T>) => {
  const [jsonText, setJsonText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValidJson, setIsValidJson] = useState<boolean>(true);

  useEffect(() => {
    if (configData) {
      setJsonText(JSON.stringify(configData, null, 2));
    }
  }, [configData]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);

    // Validate JSON
    try {
      JSON.parse(newText);
      setIsValidJson(true);
      setError('');
    } catch (err) {
      setIsValidJson(false);
      setError('Invalid JSON format');
    }
  };

  const handleConfirm = () => {
    try {
      const parsedConfig = JSON.parse(jsonText) as T;
      onConfirm(parsedConfig);
    } catch (err) {
      setError('Cannot parse JSON. Please check your input.');
    }
  };

  const handleDownload = () => {
    try {
      const parsedConfig = JSON.parse(jsonText) as T;

      // Call parent download handler (handles the actual download)
      if (onDownload) {
        onDownload(parsedConfig);
      }
    } catch (err) {
      setError('Cannot download. Please check your JSON format.');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setIsValidJson(true);
      setError('');
    } catch (err) {
      setError('Cannot format invalid JSON');
    }
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <RectTransform
        anchor={Anchor.MiddleCenter}
        pivot={{ x: 0.5, y: 0.5 }}
        position={{ x: 0, y: 0 }}
        boxSize={{ width: 900, height: 700 }}
      >
        <div className="flex h-full w-full flex-col rounded-2xl bg-gradient-to-b from-[#ff80c0] to-[#fe679a] p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-4 text-center">
            <h2 className="font-cherry-bomb-one text-3xl font-bold text-white [-webkit-text-stroke:1px_#ff1493]">
              {phase === ConfigEditorPhase.BEFORE_GAME ? 'Wave Configuration' : 'Game Completed - Download Config'}
            </h2>
            <p className="mt-2 text-sm text-white">
              {phase === ConfigEditorPhase.BEFORE_GAME
                ? 'Review and edit the wave configuration before starting the game'
                : 'Download your customized configuration for future use'}
            </p>
          </div>

          {/* JSON Editor */}
          <div className="mb-4 flex flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-white">
                JSON Configuration:
              </label>
              <button
                onClick={handleFormat}
                className="rounded bg-white bg-opacity-30 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-opacity-50"
              >
                Format JSON
              </button>
            </div>
            <textarea
              value={jsonText}
              onChange={handleJsonChange}
              className={`flex-1 rounded-lg border-2 p-4 font-mono text-sm ${isValidJson
                ? 'border-white border-opacity-50'
                : 'border-red-500'
                } bg-white bg-opacity-90 text-gray-800 focus:border-opacity-100 focus:outline-none`}
              spellCheck={false}
              style={{
                resize: 'none',
                minHeight: '400px',
              }}
            />
            {error && (
              <p className="mt-2 text-sm font-semibold text-red-200">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs text-white">
            <div className="rounded bg-white bg-opacity-20 p-2">
              <div className="font-semibold">Lines</div>
              <div>{jsonText.split('\n').length}</div>
            </div>
            <div className="rounded bg-white bg-opacity-20 p-2">
              <div className="font-semibold">Characters</div>
              <div>{jsonText.length}</div>
            </div>
            <div className="rounded bg-white bg-opacity-20 p-2">
              <div className="font-semibold">Status</div>
              <div>{isValidJson ? '✓ Valid' : '✗ Invalid'}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Start/Restart Game Button - Always Available */}
            <button
              onClick={handleConfirm}
              disabled={!isValidJson}
              className={`font-cherry-bomb-one flex-1 rounded-xl py-3 text-lg font-bold transition-all ${isValidJson
                ? 'bg-white text-[#fe679a] shadow-lg hover:scale-105 hover:shadow-xl'
                : 'cursor-not-allowed bg-gray-400 text-gray-600 opacity-50'
                }`}
            >
              {phase === ConfigEditorPhase.BEFORE_GAME ? '🎮 Start Game' : '🔄 Restart Game'}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!isValidJson}
              className={`font-cherry-bomb-one flex-1 rounded-xl py-3 text-lg font-bold transition-all ${isValidJson
                ? 'bg-yellow-400 text-[#fe679a] shadow-lg hover:scale-105 hover:shadow-xl'
                : 'cursor-not-allowed bg-gray-400 text-gray-600 opacity-50'
                }`}
            >
              📥 Download JSON
            </button>
          </div>
        </div>
      </RectTransform>
    </div>
  );
};

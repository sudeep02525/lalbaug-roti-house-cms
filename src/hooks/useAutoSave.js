import { useState, useEffect, useRef } from 'react';

export function useAutoSave(data, saveFunction, delay = 1000) {
  const [saveState, setSaveState] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!data) return;

    setSaveState('saving');
    
    const handler = setTimeout(async () => {
      try {
        await saveFunction(data);
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 2000); // revert to idle after 2s
      } catch (err) {
        console.error("Auto-save failed", err);
        setSaveState('error');
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [data, saveFunction, delay]);

  return { saveState };
}

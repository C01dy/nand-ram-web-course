import { Button } from './Button';
import { useLanguage } from '../../contexts/LanguageContext';

export const ControlPanel = ({ 
  isPlaying, 
  onPlay, 
  onPause, 
  onStep, 
  onReset,
  speed,
  onSpeedChange 
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-terminal-green bg-terminal-bg-light box-glow">
      <div className="flex gap-2 flex-wrap">
        {!isPlaying ? (
          <Button onClick={onPlay}>{t('common.play')}</Button>
        ) : (
          <Button onClick={onPause}>{t('common.pause')}</Button>
        )}
        <Button onClick={onStep}>{t('common.step')}</Button>
        <Button onClick={onReset}>{t('common.reset')}</Button>
      </div>
      
      {speed !== undefined && onSpeedChange && (
        <div className="flex flex-col gap-2">
          <label className="text-terminal-green text-sm">{t('common.speed')}: {speed}ms</label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full accent-terminal-green"
          />
        </div>
      )}
    </div>
  );
};


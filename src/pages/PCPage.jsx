import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/UI/Button';

export const PCPage = () => {
  const { t } = useLanguage();
  const [pc, setPc] = useState(0);
  const [jumpAddress, setJumpAddress] = useState('');
  const [history, setHistory] = useState([0]);
  const [lastOperation, setLastOperation] = useState('reset');

  const handleIncrement = () => {
    const newPc = (pc + 1) % 65536;
    setPc(newPc);
    setHistory([...history, newPc]);
    setLastOperation('increment');
  };

  const handleLoad = () => {
    const addr = parseInt(jumpAddress) || 0;
    if (addr >= 0 && addr <= 65535) {
      setPc(addr);
      setHistory([...history, addr]);
      setLastOperation('load');
    }
  };

  const handleReset = () => {
    setPc(0);
    setHistory([...history, 0]);
    setLastOperation('reset');
  };

  const toHex = (num) => {
    return '0x' + num.toString(16).toUpperCase().padStart(4, '0');
  };

  const toBinary = (num) => {
    return num.toString(2).padStart(16, '0');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('pc.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('pc.intro')}</p>

      <div className="border-2 border-terminal-green p-8 mb-8 box-glow-strong">
        <h3 className="text-xl font-bold mb-4 text-center">{t('pc.currentValue')}</h3>
        <div className="text-8xl font-bold text-center py-8 text-glow-strong">
          {pc}
        </div>
        <div className="flex justify-center gap-8 text-xl">
          <div>Binary: {toBinary(pc).slice(0, 8)} {toBinary(pc).slice(8)}</div>
          <div>Hex: {toHex(pc)}</div>
        </div>
        {lastOperation && (
          <div className="text-center mt-4 text-terminal-green-light animate-pulse">
            Last operation: {lastOperation.toUpperCase()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-terminal-green p-6 bg-terminal-bg-light">
          <h3 className="text-xl font-bold mb-4">{t('pc.inc')}</h3>
          <p className="text-terminal-green-light mb-4 text-sm">{t('pc.incDesc')}</p>
          <Button onClick={handleIncrement} className="w-full text-lg py-4">
            PC + 1
          </Button>
          <div className="mt-4 text-center text-terminal-green-light">
            Next: {(pc + 1) % 65536}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-6 bg-terminal-bg-light">
          <h3 className="text-xl font-bold mb-4">{t('pc.load')}</h3>
          <p className="text-terminal-green-light mb-4 text-sm">{t('pc.loadDesc')}</p>
          <input
            type="number"
            min="0"
            max="65535"
            value={jumpAddress}
            onChange={(e) => setJumpAddress(e.target.value)}
            className="terminal-input w-full mb-2"
            placeholder={t('pc.jumpAddress')}
          />
          <Button onClick={handleLoad} className="w-full text-lg py-4">
            JUMP
          </Button>
        </div>

        <div className="border-2 border-terminal-green p-6 bg-terminal-bg-light">
          <h3 className="text-xl font-bold mb-4">{t('pc.reset')}</h3>
          <p className="text-terminal-green-light mb-4 text-sm">{t('pc.resetDesc')}</p>
          <Button onClick={handleReset} className="w-full text-lg py-4">
            RESET
          </Button>
          <div className="mt-4 text-center text-terminal-green-light">
            Reset to: 0
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Program Counter History</h3>
        <div className="flex gap-2 overflow-x-auto pb-4">
          {history.slice(-20).map((value, i) => {
            const actualIndex = history.length - 20 + i;
            const isCurrent = actualIndex === history.length - 1;
            
            return (
              <div
                key={actualIndex}
                className={`min-w-24 border-2 p-3 transition-all ${
                  isCurrent
                    ? 'border-terminal-green bg-terminal-green text-black box-glow-strong scale-110'
                    : 'border-terminal-green-dark'
                }`}
              >
                <div className="text-xs mb-1">Step {actualIndex}</div>
                <div className="text-2xl font-bold text-center">{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8 bg-terminal-bg-light">
        <h3 className="text-xl font-bold mb-4">PC Control Logic</h3>
        <div className="space-y-4">
          <div className="p-4 border border-terminal-green-dark">
            <div className="font-bold mb-2">if (reset) then PC = 0</div>
            <div className="text-terminal-green-light text-sm">
              Reset has highest priority. Sets PC to 0.
            </div>
          </div>
          
          <div className="p-4 border border-terminal-green-dark">
            <div className="font-bold mb-2">else if (load) then PC = address</div>
            <div className="text-terminal-green-light text-sm">
              Load (jump) sets PC to specified address.
            </div>
          </div>
          
          <div className="p-4 border border-terminal-green-dark">
            <div className="font-bold mb-2">else if (inc) then PC = PC + 1</div>
            <div className="text-terminal-green-light text-sm">
              Increment advances to next instruction.
            </div>
          </div>
          
          <div className="p-4 border border-terminal-green-dark">
            <div className="font-bold mb-2">else PC = PC</div>
            <div className="text-terminal-green-light text-sm">
              If no operation, PC maintains its value.
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Simulation Examples</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold mb-2 text-terminal-green-light">Sequential Execution</h4>
            <Button
              onClick={() => {
                setPc(0);
                setHistory([0]);
                let current = 0;
                const interval = setInterval(() => {
                  current++;
                  if (current <= 10) {
                    setPc(current);
                    setHistory(h => [...h, current]);
                    setLastOperation('increment');
                  } else {
                    clearInterval(interval);
                  }
                }, 300);
              }}
              className="w-full"
            >
              Simulate 10 Instructions
            </Button>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-terminal-green-light">Jump Example</h4>
            <Button
              onClick={() => {
                setPc(0);
                setHistory([0]);
                setTimeout(() => {
                  setPc(1);
                  setHistory(h => [...h, 1]);
                  setTimeout(() => {
                    setPc(2);
                    setHistory(h => [...h, 2]);
                    setTimeout(() => {
                      setPc(100);
                      setHistory(h => [...h, 100]);
                      setLastOperation('load');
                    }, 300);
                  }, 300);
                }, 300);
              }}
              className="w-full"
            >
              Execute with Jump
            </Button>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-terminal-green-light">Loop Simulation</h4>
            <Button
              onClick={() => {
                setPc(10);
                setHistory([10]);
                let current = 10;
                const interval = setInterval(() => {
                  current++;
                  if (current <= 15) {
                    setPc(current);
                    setHistory(h => [...h, current]);
                  } else {
                    setPc(10);
                    setHistory(h => [...h, 10]);
                    clearInterval(interval);
                  }
                }, 300);
              }}
              className="w-full"
            >
              Loop (10-15, jump to 10)
            </Button>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-terminal-green-light">Clear History</h4>
            <Button
              onClick={() => {
                setPc(0);
                setHistory([0]);
                setLastOperation('reset');
              }}
              className="w-full"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6">
        <h3 className="text-xl font-bold mb-4">Why Program Counter?</h3>
        <div className="space-y-3 text-terminal-green-light">
          <p>
            • The PC keeps track of which instruction to execute next
          </p>
          <p>
            • In normal execution, PC increments by 1 after each instruction
          </p>
          <p>
            • Jump instructions (goto, if-goto) load a new address into PC
          </p>
          <p>
            • This allows programs to have loops, conditionals, and function calls
          </p>
          <p>
            • The PC is the key component that makes a stored-program computer work
          </p>
        </div>
      </div>
    </div>
  );
};


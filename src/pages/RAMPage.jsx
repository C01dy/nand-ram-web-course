import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/UI/Button';

export const RAMPage = () => {
  const { t } = useLanguage();
  const [ramSize] = useState(8); // 8 registers for visualization
  const [memory, setMemory] = useState(Array(8).fill(0));
  const [address, setAddress] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(0);

  const handleWrite = () => {
    const value = parseInt(inputValue) || 0;
    if (value >= 0 && value <= 65535) {
      const newMemory = [...memory];
      newMemory[address] = value;
      setMemory(newMemory);
      setSelectedAddress(address);
    }
  };

  const handleRead = (addr) => {
    setAddress(addr);
    setSelectedAddress(addr);
    setInputValue(memory[addr].toString());
  };

  const toBinary = (num) => {
    return num.toString(2).padStart(16, '0');
  };

  const toHex = (num) => {
    return '0x' + num.toString(16).toUpperCase().padStart(4, '0');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('ram.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('ram.intro')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-terminal-green p-4 box-glow">
          <h3 className="text-lg font-bold mb-2">{t('ram.address')}</h3>
          <div className="text-6xl font-bold text-center py-4 text-glow-strong">
            {address}
          </div>
          <div className="text-center text-sm mt-2">
            Binary: {address.toString(2).padStart(3, '0')}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('ram.input')}</h3>
          <input
            type="number"
            min="0"
            max="65535"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="terminal-input w-full text-center text-2xl"
            placeholder="Value"
          />
          <Button onClick={handleWrite} className="w-full mt-4">
            {t('ram.load')}
          </Button>
        </div>

        <div className="border-2 border-terminal-green p-4 box-glow">
          <h3 className="text-lg font-bold mb-2">{t('ram.output')}</h3>
          <div className="text-4xl font-bold text-center py-4 text-glow-strong">
            {memory[address]}
          </div>
          <div className="text-center text-sm mt-2">
            {toHex(memory[address])}
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">{t('ram.size')}: {ramSize} {t('ram.registers')}</h3>
        <p className="text-terminal-green-light mb-4">{t('ram.selectAddress')}</p>
        
        <div className="space-y-2">
          {memory.map((value, addr) => {
            const isSelected = addr === selectedAddress;
            const isCurrentAddress = addr === address;
            
            return (
              <div
                key={addr}
                onClick={() => handleRead(addr)}
                className={`border-2 p-4 cursor-pointer transition-all duration-300 ${
                  isCurrentAddress
                    ? 'border-terminal-green bg-terminal-green text-black box-glow-strong'
                    : isSelected
                    ? 'border-terminal-green box-glow'
                    : 'border-terminal-green-dark hover:border-terminal-green'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${isCurrentAddress ? 'text-black' : 'text-terminal-green'}`}>
                      [{addr}]
                    </div>
                    <div className={`text-sm ${isCurrentAddress ? 'text-black' : 'text-terminal-green-light'}`}>
                      Address: {addr.toString(2).padStart(3, '0')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className={`text-xl font-mono ${isCurrentAddress ? 'text-black font-bold' : ''}`}>
                      {toBinary(value).slice(0, 8)} {toBinary(value).slice(8)}
                    </div>
                    <div className={`text-2xl font-bold ${isCurrentAddress ? 'text-black' : 'text-terminal-green'}`}>
                      {value}
                    </div>
                    <div className={`text-lg ${isCurrentAddress ? 'text-black' : 'text-terminal-green-light'}`}>
                      {toHex(value)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8 bg-terminal-bg-light">
        <h3 className="text-xl font-bold mb-4">Address Decoder (DMux)</h3>
        <p className="text-terminal-green-light mb-4">
          The address decoder uses the address bits to select which register to access.
          With 3 address bits, we can address 2³ = 8 registers.
        </p>
        
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`border-2 p-2 text-center transition-all ${
                i === address
                  ? 'border-terminal-green bg-terminal-green text-black box-glow'
                  : 'border-terminal-green-dark'
              }`}
            >
              <div className="text-xs mb-1">Addr {i}</div>
              <div className="text-xs font-mono">{i.toString(2).padStart(3, '0')}</div>
              {i === address && (
                <div className="text-xs mt-1 font-bold">SELECTED</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <Button onClick={() => {
            setMemory(Array(8).fill(0));
            setAddress(0);
            setInputValue('0');
          }}>
            Clear All
          </Button>
          <Button onClick={() => {
            setMemory(Array.from({ length: 8 }, (_, i) => i * 100));
          }}>
            Fill Pattern
          </Button>
          <Button onClick={() => {
            setMemory(Array.from({ length: 8 }, () => Math.floor(Math.random() * 256)));
          }}>
            Random Values
          </Button>
          <Button onClick={() => {
            setMemory(Array.from({ length: 8 }, (_, i) => Math.pow(2, i)));
          }}>
            Powers of 2
          </Button>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6">
        <h3 className="text-xl font-bold mb-4">RAM Operation</h3>
        <div className="space-y-4">
          <div className="p-4 border border-terminal-green-dark">
            <div className="font-bold mb-2">WRITE Operation:</div>
            <div className="text-terminal-green-light">
              1. Set ADDRESS to target location<br/>
              2. Set INPUT to desired value<br/>
              3. Set LOAD = 1<br/>
              4. On clock edge, value is stored at ADDRESS
            </div>
          </div>
          
          <div className="p-4 border border-terminal-green-dark">
            <div className="font-bold mb-2">READ Operation:</div>
            <div className="text-terminal-green-light">
              1. Set ADDRESS to target location<br/>
              2. OUTPUT shows value at ADDRESS<br/>
              3. No clock needed - reading is instantaneous
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout/Layout';
import { MemoryPage } from './pages/MemoryPage';
import { ClockPage } from './pages/ClockPage';
import { TickTockPage } from './pages/TickTockPage';
import { DFFPage } from './pages/DFFPage';
import { BitPage } from './pages/BitPage';
import { RegisterPage } from './pages/RegisterPage';
import { RAMPage } from './pages/RAMPage';
import { PCPage } from './pages/PCPage';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/memory" replace />} />
            <Route path="memory" element={<MemoryPage />} />
            <Route path="clock" element={<ClockPage />} />
            <Route path="ticktock" element={<TickTockPage />} />
            <Route path="dff" element={<DFFPage />} />
            <Route path="bit" element={<BitPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="ram" element={<RAMPage />} />
            <Route path="pc" element={<PCPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

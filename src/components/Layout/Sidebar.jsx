import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const routes = [
  { path: '/memory', key: 'nav.memory' },
  { path: '/clock', key: 'nav.clock' },
  { path: '/ticktock', key: 'nav.ticktock' },
  { path: '/dff', key: 'nav.dff' },
  { path: '/bit', key: 'nav.bit' },
  { path: '/register', key: 'nav.register' },
  { path: '/ram', key: 'nav.ram' },
  { path: '/pc', key: 'nav.pc' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside className="w-64 bg-terminal-bg-light border-r-2 border-terminal-green p-4 overflow-y-auto">
      <nav className="space-y-2">
        {routes.map((route, index) => {
          const isActive = location.pathname === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className={`block p-3 border-2 transition-all duration-200 ${
                isActive
                  ? 'border-terminal-green bg-terminal-green text-black box-glow-strong'
                  : 'border-terminal-green-dark hover:border-terminal-green hover:box-glow'
              }`}
            >
              <span className="text-terminal-green-dark mr-2">[{index + 1}]</span>
              <span className={isActive ? 'text-black font-bold' : 'text-terminal-green'}>
                {t(route.key)}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};


import { Outlet } from 'react-router-dom';
import { TabBar } from '../TabBar';
import './AppLayout.css';

export function AppLayout() {
  return (
    <div className="app-layout">
      <main className="app-layout-content">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}

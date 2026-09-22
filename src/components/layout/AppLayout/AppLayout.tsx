import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { TabBar } from '../TabBar';
import './AppLayout.css';

export function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-layout-content">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}

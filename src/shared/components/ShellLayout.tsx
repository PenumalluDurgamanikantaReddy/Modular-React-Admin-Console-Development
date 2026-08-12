import React from 'react';
import { useAppSelector } from '../../store/rootStore';
import { selectSidebarCollapsed } from '../../modules/settings/slice/settingsSlice';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

export default function ShellLayout({ children }: Props) {
  const collapsed = useAppSelector(selectSidebarCollapsed);

  return (
    <div className="app-shell">
      <Sidebar />
      <motion.div
        className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <Topbar />
        <main className="page-content">
          {children}
        </main>
      </motion.div>
    </div>
  );
}

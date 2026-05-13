import React from 'react';
import styles from '../Usuario.module.css';

interface TabsEstudianteProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    disponibles: number;
    completados: number;
    programados: number;
    expirados: number;
    cerrados: number;
  };
}

const TabsEstudiante: React.FC<TabsEstudianteProps> = ({
  activeTab,
  onTabChange,
  counts
}) => {
  const tabs = [
    {
      id: 'disponibles',
      label: 'Disponibles',
      icon: 'fas fa-calendar',
      count: counts.disponibles,
      className: styles.tabDisponibles
    },
    {
      id: 'completados',
      label: 'Completados',
      icon: 'fas fa-check-double',
      count: counts.completados,
      className: styles.tabCompletados
    },
    {
      id: 'programados',
      label: 'Programados',
      icon: 'fas fa-clock',
      count: counts.programados,
      className: styles.tabProgramados
    },
    {
      id: 'expirados',
      label: 'Expirados',
      icon: 'fas fa-exclamation-triangle',
      count: counts.expirados,
      className: styles.tabExpirados
    },
    {
      id: 'cerrados',
      label: 'Cerrados',
      icon: 'fas fa-lock',
      count: counts.cerrados,
      className: styles.tabCerrados
    }
  ];

  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''} ${tab.className}`}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={tab.icon}></i>
          <span className={styles.tabLabel}>{tab.label}</span>
          <span className={styles.tabCountSmall}>{tab.count}</span>
        </button>
      ))}
    </div>
  );
};

export default TabsEstudiante; 
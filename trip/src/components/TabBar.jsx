export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <nav className="bottom-tabbar" aria-label="Primary">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.id === activeTab ? 'active' : ''}
          onClick={() => onChange(tab.id)}
          aria-current={tab.id === activeTab ? 'page' : undefined}
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

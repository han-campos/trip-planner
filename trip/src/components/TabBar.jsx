import { iconStroke, tabIcons } from './uiIcons.jsx';

export default function TabBar({ tabs, activeTab, onChange, variant = 'mobile' }) {
  return (
    <nav className={variant === 'desktop' ? 'desktop-tabs' : 'bottom-nav'} aria-label={variant === 'desktop' ? 'Primary desktop' : 'Primary'}>
      {tabs.map((tab) => {
        const Icon = tabIcons[tab.id];
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={`${variant === 'desktop' ? 'desktop-tabs__tab' : 'bottom-nav__tab'} ${active ? `${variant === 'desktop' ? 'desktop-tabs__tab' : 'bottom-nav__tab'}--active` : ''}`}
            onClick={() => onChange(tab.id)}
            aria-current={active ? 'page' : undefined}
          >
            <span className={variant === 'desktop' ? 'desktop-tabs__icon' : 'bottom-nav__icon'} aria-hidden="true">
              {Icon && <Icon size={variant === 'desktop' ? 16 : 22} strokeWidth={iconStroke} />}
            </span>
            <span className={variant === 'desktop' ? 'desktop-tabs__label' : 'bottom-nav__label'}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

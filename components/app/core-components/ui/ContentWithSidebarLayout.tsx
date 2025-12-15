

import React from "react";
import { LucideIcon } from "lucide-react";

interface MenuItemObj {
    label: string;
    icon?: LucideIcon;
}

export const ContentWithSidebarLayout: React.FC<{
    title: string;
    menuItems: { 
        category: string; 
        badge?: string;
        items: (string | MenuItemObj)[] 
    }[];
    children: React.ReactNode;
    selectedItem: string;
    setSelectedItem: (item: string) => void;
}> = ({ title, menuItems, children, selectedItem, setSelectedItem }) => {
    
    return (
        <div className="flex gap-6 h-full overflow-hidden">
            <aside className="w-1/4 max-w-xs bg-white dark:bg-[var(--bg-card)] rounded-lg shadow-sm border border-gray-200 dark:border-[var(--border-color)] shrink-0 flex flex-col h-full max-h-full">
                <div className="p-4 pb-3 shrink-0 border-b border-gray-100 dark:border-[var(--border-color)]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                </div>
                <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 relative py-2">
                    {menuItems.map(({ category, badge, items }) => (
                        <div key={category} className="mb-2">
                            <div className="flex items-center justify-between px-4 py-2 mt-2 first:mt-0">
                                <h3 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    {category}
                                </h3>
                                {badge && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <ul className="px-2 space-y-0.5">
                                {items.map(item => {
                                    const label = typeof item === 'string' ? item : item.label;
                                    const Icon = typeof item === 'object' ? item.icon : null;
                                    const isSelected = selectedItem === label;

                                    return (
                                        <li key={label}>
                                            <button 
                                                onClick={() => setSelectedItem(label)}
                                                className={`w-full text-left text-sm py-2 px-3 rounded-md transition-all leading-snug flex items-center justify-between group ${
                                                    isSelected 
                                                    ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-semibold shadow-sm ring-1 ring-primary-200 dark:ring-primary-800' 
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[var(--bg-input)]'
                                                }`}
                                            >
                                                <span className="truncate mr-2">{label}</span>
                                                {Icon && (
                                                    <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-600'}`} />
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
            <section className="flex-1 overflow-y-auto h-full p-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                {children}
            </section>
        </div>
    );
};
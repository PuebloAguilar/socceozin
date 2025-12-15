
import React from "react";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
    title: string;
    amount: string;
    period?: string;
    Icon: LucideIcon;
    iconColor: string;
    borderColor: string;
    amountColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, amount, period, Icon, iconColor, borderColor, amountColor }) => {
    return (
        <div className={`p-5 rounded-xl border-l-4 ${borderColor} bg-[var(--bg-card)] shadow-sm hover:shadow-md transition-shadow border-y border-r border-[var(--border-color)]`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <p className={`text-2xl font-bold ${amountColor || 'text-gray-900 dark:text-gray-100'}`}>{amount}</p>
            {period && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{period}</p>}
        </div>
    );
};

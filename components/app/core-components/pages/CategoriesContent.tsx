
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  BarChart3,
  TrendingDown,
  Calendar,
  DollarSign,
  LineChart,
  BarChart,
  ArrowUp,
} from "lucide-react";
import { Transaction } from './TransactionsContent';
import { SmartForecastWidget } from '../ui/SmartForecastWidget'; // Importing reused widget

interface Category {
    id: number;
    name: string;
}

interface CategoriesContentProps {
    categories: Category[];
    transactions: Transaction[];
    onSaveCategory: (category: Category) => void;
    onDeleteCategory: (id: number) => void;
    currency: string;
}


// --- COMPONENTE DE GRÁFICO DETALHADO (Adaptado de MetricsContent) ---

type DataSet = {
    labels: string[];
    data: number[];
    fullDates: string[];
    comparisonData: number[];
    yMax: number;
};
type Period = 'Dias' | 'Semanas' | 'Meses' | 'Trimestres' | 'Anos';
type PeriodDataObject = {
    [key in Period]: DataSet;
};

const CategoryExpenseChart: React.FC<{ 
    metricTitle: string,
    dataSets: PeriodDataObject,
    valueFormatter: (value: number) => string,
    analysisType: 'income' | 'expense'
}> = ({ metricTitle, dataSets, valueFormatter, analysisType }) => {
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');
    const [period, setPeriod] = useState<Period>('Meses');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
    
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const activeDataSet = useMemo(() => dataSets[period], [period, dataSets]);

    const getChangeColor = (change: number) => {
        if (change === 0) return 'text-gray-500 dark:text-gray-400';
        if (analysisType === 'expense') {
            return change > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400';
        } else { // income
            return change > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
        }
    };

    const chartConfig = useMemo(() => ({
        data: activeDataSet.data,
        labels: activeDataSet.labels,
        fullDates: activeDataSet.fullDates,
        comparisonData: activeDataSet.comparisonData,
        yLabels: [1, 0.8, 0.6, 0.4, 0.2, 0].map(m => m * activeDataSet.yMax),
        yMax: activeDataSet.yMax,
        viewBox: "0 0 820 320",
        chartHeight: 280,
        chartWidth: 750,
        yOffset: 20,
        xOffset: 50,
    }), [activeDataSet]);

    const chartCalculations = useMemo(() => {
        const dataLength = chartConfig.data.length;

        const getY = (value: number) => {
            if (chartConfig.yMax === 0) return chartConfig.yOffset + chartConfig.chartHeight;
            return chartConfig.yOffset + chartConfig.chartHeight - (value / chartConfig.yMax) * chartConfig.chartHeight;
        }

        const barSlotWidth = chartConfig.chartWidth / dataLength;
        const barWidth = barSlotWidth * 0.6;
        const getBarX = (index: number) => 
            chartConfig.xOffset + (barSlotWidth * index) + (barSlotWidth / 2);

        const getLineX = (index: number) => {
            if (dataLength <= 1) return chartConfig.xOffset + chartConfig.chartWidth / 2;
            return chartConfig.xOffset + (index / (dataLength - 1)) * chartConfig.chartWidth;
        }

        const pathData = chartConfig.data.map((point, index) => {
            const x = getLineX(index);
            const y = getY(point);
            return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' ');

        const dataPoints = chartConfig.data.map((point, index) => ({
            x: chartType === 'line' ? getLineX(index) : getBarX(index),
            y: getY(point),
            value: point,
            label: chartConfig.labels[index],
            fullDate: chartConfig.fullDates[index],
            comparison: chartConfig.comparisonData[index]
        }));

        return { getY, getBarX, pathData, dataPoints, barWidth };
    }, [chartConfig, chartType]);

    const { getY, getBarX, pathData, dataPoints, barWidth } = chartCalculations;

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current || !containerRef.current || dataPoints.length === 0) return;
        
        const svg = svgRef.current;
        const svgRect = svg.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left;
        const viewBoxWidth = parseFloat(chartConfig.viewBox.split(' ')[2] || '1');
        const svgX = (mouseX / svgRect.width) * viewBoxWidth;

        const closestIndex = dataPoints.reduce((closest, point, index) => {
            const dist = Math.abs(point.x - svgX);
            return dist < Math.abs(dataPoints[closest].x - svgX) ? index : closest;
        }, 0);
        
        setHoveredIndex(closestIndex);

        const point = dataPoints[closestIndex];
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const viewBoxHeight = parseFloat(chartConfig.viewBox.split(' ')[3] || '1');
        
        const pixelX = (point.x / viewBoxWidth) * containerWidth;
        const pixelY = (point.y / viewBoxHeight) * containerHeight;
        
        setTooltipPosition({ x: pixelX, y: pixelY });
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        setTooltipPosition(null);
    };

    const hoveredPoint = hoveredIndex !== null && dataPoints[hoveredIndex] ? dataPoints[hoveredIndex] : null;

    const formatYAxisLabel = (value: number) => {
        if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
        return value.toFixed(0);
    };

    const comparisonText = useMemo(() => {
        switch (period) {
            case 'Dias': return 'vs dia anterior';
            case 'Semanas': return 'vs semana anterior';
            case 'Meses': return 'vs mês anterior';
            case 'Trimestres': return 'vs trimestre anterior';
            case 'Anos': return 'vs ano anterior';
            default: return 'vs período anterior';
        }
    }, [period]);

    const summaryData = useMemo(() => {
        const currentData = activeDataSet.data;
        if (currentData.length === 0) return { currentValue: 0, startValue: 0, previousValue: 0, startPercentageChange: 0, previousPeriodPercentageChange: 0 };
        
        const currentValue = currentData[currentData.length - 1] ?? 0;
        const previousValue = currentData[currentData.length - 2] ?? 0;
        const startValue = currentData[0] ?? 0;

        const startPercentageChange = startValue !== 0 ? ((currentValue - startValue) / startValue) * 100 : (currentValue > 0 ? 100 : 0);
        const previousPeriodPercentageChange = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : (currentValue > 0 ? 100 : 0);

        return { currentValue, startValue, previousValue, startPercentageChange, previousPeriodPercentageChange };
    }, [activeDataSet]);


    return (
        <div className="bg-[var(--bg-card)] p-6 rounded-xl text-gray-600 dark:text-gray-300 font-sans border border-[var(--border-color)]">
           <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
               <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{metricTitle}</h2>
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-input)]">
                    <button onClick={() => setChartType('line')} className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md transition-colors ${chartType === 'line' ? 'bg-[var(--color-detail)] text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                        <LineChart className="h-4 w-4"/> Linha
                    </button>
                    <button onClick={() => setChartType('bar')} className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md transition-colors ${chartType === 'bar' ? 'bg-[var(--color-detail)] text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                        <BarChart className="h-4 w-4"/> Barras
                    </button>
                  </div>
                  <div className="h-6 border-l border-[var(--border-color)] mx-2"></div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(Object.keys(dataSets) as Period[]).map(p => (
                        <button key={p} onClick={() => setPeriod(p)} className={`text-sm px-3 py-1.5 rounded-md transition-colors ${period === p ? 'bg-[var(--color-detail)] text-gray-900 dark:text-gray-100 font-semibold shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                            {p}
                        </button>
                    ))}
                  </div>
               </div>
           </div>

           <div ref={containerRef} className="relative h-80 w-full">
                {activeDataSet.data.length > 0 ? (
                <svg 
                    ref={svgRef}
                    width="100%" 
                    height="100%" 
                    viewBox={chartConfig.viewBox} 
                    preserveAspectRatio="none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="overflow-visible font-sans"
                >
                    {chartConfig.yLabels.map((label) => (
                        <g key={label}>
                            <text x={chartConfig.xOffset - 15} y={getY(label) + 4} textAnchor="end" className="text-sm font-semibold fill-gray-500 dark:fill-gray-400">
                                {formatYAxisLabel(label)}
                            </text>
                             { label !== 0 && <line x1={chartConfig.xOffset} y1={getY(label)} x2={chartConfig.xOffset + chartConfig.chartWidth} y2={getY(label)} className="stroke-[var(--border-color)]" strokeWidth="1" />}
                        </g>
                    ))}
                    
                    {chartConfig.labels.map((label, index) => (
                        <text key={`${label}-${index}`} x={getBarX(index)} y={chartConfig.yOffset + chartConfig.chartHeight + 25} textAnchor="middle" className="text-sm font-semibold fill-gray-500 dark:fill-gray-400">
                            {label}
                        </text>
                    ))}

                    {chartType === 'line' ? (
                        <path d={pathData} fill="none" stroke="currentColor" className="text-primary-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                        <g>
                           {dataPoints.map((point, index) => (
                               <rect key={index} x={point.x - barWidth / 2} y={point.y} width={barWidth} height={(chartConfig.yOffset + chartConfig.chartHeight) - point.y} fill="currentColor" className={`transition-colors ${hoveredIndex === index ? 'text-primary-400' : 'text-primary-600'}`} />
                           ))}
                        </g>
                    )}

                     {hoveredPoint && (
                        <g className="pointer-events-none">
                            <line x1={hoveredPoint.x} y1={chartConfig.yOffset - 10} x2={hoveredPoint.x} y2={chartConfig.yOffset + chartConfig.chartHeight} className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="1" strokeDasharray="4 4" />
                            {chartType === 'line' && (
                                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6" fill="currentColor" stroke="#f9fafb" className="text-primary-500 dark:stroke-gray-900" strokeWidth="3" />
                            )}
                        </g>
                    )}
                </svg>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <p>Sem dados de {analysisType === 'expense' ? 'despesas' : 'receitas'} para o período selecionado.</p>
                    </div>
                )}
                {hoveredPoint && tooltipPosition && (
                    <div className="absolute pointer-events-none rounded-lg bg-[var(--bg-card)] shadow-2xl p-3 border border-[var(--border-color)]" style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px`, transform: 'translate(-50%, -100%) translateY(-15px)', minWidth: '160px' }}>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">{hoveredPoint.fullDate}</p>
                       <p className="text-xl font-bold text-primary-500 dark:text-primary-400 mb-1">{valueFormatter(hoveredPoint.value)}</p>
                       <div className={`flex items-center text-sm ${getChangeColor(hoveredPoint.comparison)}`}>
                           {hoveredPoint.comparison !== 0 && (
                               <ArrowUp className={`h-4 w-4 mr-1 ${hoveredPoint.comparison < 0 ? 'rotate-180' : ''}`}/>
                           )}
                           <span className="font-semibold">{Math.abs(hoveredPoint.comparison)}%</span>
                           <span className="ml-1 text-gray-500 dark:text-gray-400 text-xs">{comparisonText}</span>
                       </div>
                    </div>
                )}
           </div>
       
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-color)] mt-4 border-t border-[var(--border-color)]">
                <div className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Atual</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{valueFormatter(summaryData.currentValue)}</p>
                </div>
                 <div className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Início do Período</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 flex items-center gap-2">
                        {valueFormatter(summaryData.startValue)}
                        <span className={`text-sm font-medium ${getChangeColor(summaryData.startPercentageChange)} flex items-center`}>
                            {summaryData.startPercentageChange !== 0 && (
                               <ArrowUp className={`h-3 w-3 ${summaryData.startPercentageChange < 0 ? 'rotate-180' : ''}`} />
                            )}
                            {Math.abs(summaryData.startPercentageChange).toFixed(1)}%
                        </span>
                    </p>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{comparisonText.replace('vs ', '')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 flex items-center gap-2">
                        {valueFormatter(summaryData.previousValue)}
                        <span className={`text-sm font-medium ${getChangeColor(summaryData.previousPeriodPercentageChange)} flex items-center`}>
                             {summaryData.previousPeriodPercentageChange !== 0 && (
                                <ArrowUp className={`h-3 w-3 ${summaryData.previousPeriodPercentageChange < 0 ? 'rotate-180' : ''}`} />
                             )}
                            {Math.abs(summaryData.previousPeriodPercentageChange).toFixed(1)}%
                        </span>
                    </p>
                </div>
            </div>

            {/* Smart Forecast Integration */}
            <SmartForecastWidget 
                currentValue={summaryData.currentValue}
                previousValue={summaryData.previousValue}
                percentageChange={summaryData.previousPeriodPercentageChange}
                period={period}
                type={analysisType}
            />
       </div>
    );
};


// --- Componente Modal de Análise ---
const CategoryAnalysisModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    transactions: Transaction[];
    formatCurrency: (value: number) => string;
}> = ({ isOpen, onClose, category, transactions, formatCurrency }) => {

    const { analysisType, categoryTransactions } = useMemo(() => {
        if (!category) return { analysisType: 'expense' as 'income' | 'expense', categoryTransactions: [] as Transaction[] };
        
        const allCategoryTransactions = transactions.filter(
            t => t.category.toLowerCase() === category.name.toLowerCase()
        );
        
        const hasExpenses = allCategoryTransactions.some(t => t.type === 'expense');
        const typeToAnalyze = hasExpenses ? 'expense' : 'income';

        const filteredTransactions = allCategoryTransactions.filter(t => t.type === typeToAnalyze);

        return { analysisType: typeToAnalyze as 'income' | 'expense', categoryTransactions: filteredTransactions };
    }, [category, transactions]);


    const analysisData = useMemo(() => {
        if (!category) return null;

        const total = categoryTransactions.reduce((acc, t) => acc + t.amount, 0);
        const largestTransaction = categoryTransactions.reduce((max, t) => (t.amount > max.amount ? t : max), { amount: 0 } as Transaction);
        const recentTransactions = [...categoryTransactions]
            .sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime())
            .slice(0, 5);

        const monthlyTotals: Record<string, number> = {};
        categoryTransactions.forEach(t => {
            const [day, month, year] = t.date.split('/').map(Number);
            const monthKey = `${year}-${String(month).padStart(2, '0')}`;
            monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + t.amount;
        });
        const monthCount = Object.keys(monthlyTotals).length;
        const avgMonthly = monthCount > 0 ? total / monthCount : 0;
        
        return { total, avgMonthly, largestTransaction, recentTransactions };
    }, [category, categoryTransactions]);
    
    const chartData = useMemo(() => {
        if (!category) return null;
        const transactionsForChart = categoryTransactions
            .map(t => ({ amount: t.amount, date: new Date(t.date.split('/').reverse().join('-')) }));
        
        const createComparison = (data: number[]) => data.map((v, i, arr) => {
            if (i === 0) return 0;
            const prev = arr[i-1];
            if (prev === 0) return v > 0 ? 100 : 0;
            return parseFloat((((v - prev) / prev) * 100).toFixed(1));
        });

        const now = new Date(2025, 10, 28); // Using a fixed date for consistent example data
        const emptyDataSet = { labels: [], data: [], fullDates: [], comparisonData: [], yMax: 100 };
        if (transactionsForChart.length === 0) return { Dias: emptyDataSet, Semanas: emptyDataSet, Meses: emptyDataSet, Trimestres: emptyDataSet, Anos: emptyDataSet };
        
        // --- Dias ---
        const dailyTotals = new Map<string, number>();
        transactionsForChart.forEach(t => {
            const key = t.date.toISOString().split('T')[0];
            dailyTotals.set(key, (dailyTotals.get(key) || 0) + t.amount);
        });
        const last30Days = Array.from({ length: 30 }).map((_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29 + i));
        const dataDias = last30Days.map(d => dailyTotals.get(d.toISOString().split('T')[0]) || 0);
        const yMaxDias = Math.max(...dataDias, 100) * 1.2;
        const Dias = {
            labels: last30Days.map(d => d.getDate().toString()),
            data: dataDias,
            fullDates: last30Days.map(d => d.toLocaleDateString('pt-BR')),
            comparisonData: createComparison(dataDias),
            yMax: yMaxDias,
        };
        
        // --- Meses ---
        const monthlyTotals = new Map<string, number>();
        transactionsForChart.forEach(t => {
            const key = `${t.date.getFullYear()}-${t.date.getMonth()}`;
            monthlyTotals.set(key, (monthlyTotals.get(key) || 0) + t.amount);
        });
        const last12Months = Array.from({ length: 12 }).map((_, i) => new Date(now.getFullYear(), now.getMonth() - 11 + i, 1));
        const dataMeses = last12Months.map(d => monthlyTotals.get(`${d.getFullYear()}-${d.getMonth()}`) || 0);
        const yMaxMeses = Math.max(...dataMeses, 100) * 1.2;
        const Meses = {
            labels: last12Months.map(d => d.toLocaleString('pt-BR', { month: 'short' })),
            data: dataMeses,
            fullDates: last12Months.map(d => d.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })),
            comparisonData: createComparison(dataMeses),
            yMax: yMaxMeses,
        };

        return { Dias, Meses, Semanas: emptyDataSet, Trimestres: emptyDataSet, Anos: emptyDataSet };
    }, [category, categoryTransactions]);


    if (!isOpen || !category || !analysisData || !chartData) return null;

    const { total, avgMonthly, largestTransaction, recentTransactions } = analysisData;
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-5xl relative animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Análise de Categoria</h2>
                        <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold">{category.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{analysisType === 'expense' ? 'Gasto Total' : 'Receita Total'}</p>
                            <p className={`text-2xl font-bold ${analysisType === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{formatCurrency(total)}</p>
                        </div>
                         <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Média Mensal</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(avgMonthly)}</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Maior Transação</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(largestTransaction.amount)}</p>
                             <p className="text-xs text-gray-400 truncate">{largestTransaction.name}</p>
                        </div>
                    </div>
                    
                    <CategoryExpenseChart
                        metricTitle={`Evolução de ${analysisType === 'expense' ? 'Gastos' : 'Receitas'}: ${category.name}`}
                        dataSets={chartData}
                        valueFormatter={formatCurrency}
                        analysisType={analysisType}
                    />
                    
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Transações Recentes</h3>
                        <div className="space-y-2">
                            {recentTransactions.length > 0 ? recentTransactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{t.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                                    </div>
                                    <p className={`font-semibold ${analysisType === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{formatCurrency(t.amount)}</p>
                                </div>
                            )) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Nenhuma transação encontrada.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Componente Modal de Formulário ---
const CategoryFormModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    initialData?: Category | null; 
    onSave: (category: Category) => void;
}> = ({ isOpen, onClose, initialData, onSave }) => {
    
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            id: initialData?.id || 0,
            name: name.trim()
        });
        onClose();
    };

    const formKey = initialData ? `edit-cat-${initialData.id}` : 'new-cat';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
            <div 
                className="bg-[var(--bg-card)] rounded-lg shadow-xl p-8 w-full max-w-sm relative transform transition-all duration-300 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
                
                <div className="text-left mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {initialData ? 'Editar Categoria' : 'Nova Categoria'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {initialData ? 'Alterar nome da categoria.' : 'Adicione uma categoria para organizar.'}
                    </p>
                </div>

                <form key={formKey} onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Ex: Alimentação" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            autoFocus
                        />
                    </div>

                    <button type="submit" className="w-full py-2.5 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900">
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export const CategoriesContent: React.FC<CategoriesContentProps> = ({ categories, transactions, onSaveCategory, onDeleteCategory, currency }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(value);

    const handleNew = () => {
        setEditingCategory(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormModalOpen(true);
    };
    
    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setIsAnalysisModalOpen(true);
    };

    return (
        <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Categorias</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Organize e analise suas transações</p>
                </div>
                <button 
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Nova Categoria
                </button>
            </div>

            <div className="space-y-3">
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className="group w-full text-left bg-[var(--bg-card)] p-4 rounded-lg shadow-sm flex items-center justify-between border border-[var(--border-color)] transition-all hover:border-primary-500 dark:hover:border-primary-700 hover:shadow-md"
                    >
                        <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{category.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleEdit(category); }}
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteCategory(category.id); }}
                                className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </button>
                ))}
            </div>

            <CategoryFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)}
                initialData={editingCategory}
                onSave={onSaveCategory}
            />
            
            <CategoryAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                category={selectedCategory}
                transactions={transactions}
                formatCurrency={formatCurrency}
            />
        </div>
    );
};

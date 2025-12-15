
import React, { useState, useMemo, useRef } from 'react';
import {
  LineChart,
  BarChart,
  ArrowUp,
  Activity,
  TrendingUp,
  Scale,
  CheckCircle2,
  Lightbulb,
  TrendingDown,
  Target,
  PieChart,
  Briefcase,
  Lock,
  Users,
  Megaphone,
  Rocket,
  Zap,
  Percent,
  Info,
  BookOpen
} from "lucide-react";
import { ContentWithSidebarLayout } from '../ui/ContentWithSidebarLayout';
import { PlaceholderContent } from '../ui/PlaceholderContent';
import { SmartForecastWidget } from '../ui/SmartForecastWidget';

// --- Types ---
type Period = 'Dias' | 'Semanas' | 'Meses' | 'Trimestres' | 'Anos';
type DataSet = {
    labels: string[];
    data: number[];
    fullDates: string[];
    comparisonData: number[];
    yMax: number;
};

// --- MOCK DATASETS ---
const generateMockData = (base: number, variance: number): DataSet => {
    const data = Array.from({ length: 10 }, () => base + Math.random() * variance - variance / 2);
    return {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
        data: data,
        fullDates: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'],
        comparisonData: data.map(() => Math.floor(Math.random() * 20) - 10),
        yMax: base + variance,
    };
};

const balanceDataSets: Record<Period, DataSet> = {
  Dias: generateMockData(500, 100),
  Semanas: generateMockData(2000, 500),
  Meses: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
      data: [350, 450, 400, 570, 510, 680, 610, 780, 850, 920],
      fullDates: ['19 Jan, 2025', '19 Fev, 2025', '19 Mar, 2025', '19 Abr, 2025', '19 Mai, 2025', '19 Jun, 2025', '19 Jul, 2025', '19 Ago, 2025', '19 Set, 2025', '19 Out, 2025'],
      comparisonData: [8, 28, -11, 42, -10, 33, -10, 27, 9, 8],
      yMax: 1200,
  },
  Trimestres: generateMockData(5000, 1000),
  Anos: generateMockData(20000, 5000),
};

const incomeDataSets: Record<Period, DataSet> = {
    Dias: generateMockData(800, 150),
    Semanas: generateMockData(3000, 600),
    Meses: generateMockData(8000, 1200),
    Trimestres: generateMockData(24000, 3000),
    Anos: generateMockData(90000, 10000),
};

const expenseDataSets: Record<Period, DataSet> = {
    Dias: generateMockData(400, 100),
    Semanas: generateMockData(1500, 300),
    Meses: generateMockData(4500, 800),
    Trimestres: generateMockData(13000, 2000),
    Anos: generateMockData(50000, 5000),
};

// --- DEFINIÇÕES DE MÉTRICAS (Descriptions) ---
const METRIC_DEFINITIONS: Record<string, { description: string; formula?: string }> = {
    // RECEITA & RETENÇÃO
    "Receita Recorrente Mensal (MRR)": { description: "Total de receita recorrente prevista no mês. Reflete a saúde financeira base das assinaturas.", formula: "Soma de todas as assinaturas ativas" },
    "Receita Recorrente Anual (ARR)": { description: "Receita anual recorrente. Mostra previsibilidade e projeção de longo prazo.", formula: "MRR × 12" },
    "Taxa de Crescimento": { description: "Crescimento mês a mês (MoM) ou ano a ano (YoY). Indica aceleração, estabilidade ou queda.", formula: "((Valor Atual - Valor Anterior) / Valor Anterior) * 100" },
    "Receita Bruta": { description: "Total faturado antes de taxas, impostos e descontos. A força bruta da operação.", formula: "Preço x Quantidade Vendida" },
    "Receita Líquida": { description: "Receita real após deduções, taxas e impostos. O que realmente entra no caixa.", formula: "Receita Bruta - Deduções" },
    "Churn de Usuários": { description: "Taxa de cancelamento de clientes em um período.", formula: "(Clientes Cancelados / Total Clientes Início) * 100" },
    "Churn de Receita (MRR)": { description: "Valor monetário perdido devido a cancelamentos.", formula: "Soma do MRR de clientes cancelados" },
    "Valor do Ciclo de Vida do Cliente (LTV / CLV)": { description: "Lucro líquido previsto de todo o relacionamento futuro com um cliente.", formula: "(Ticket Médio x Margem Bruta) / Churn Rate" },
    "Custo de Aquisição de Cliente (CAC)": { description: "Custo total para adquirir um novo cliente, incluindo marketing e vendas.", formula: "Investimento Total em Aquisição / Novos Clientes" },
    "Ticket Médio / Receita Média por Cliente (ARPA / ARPU)": { description: "Média de receita gerada por cada cliente ou conta ativa.", formula: "Receita Total / Número de Clientes" },
    // Padrão para outros
    "default": { description: "Métrica avançada de desempenho de negócio. Conecte suas fontes de dados para visualizar este indicador.", formula: "Cálculo personalizado" }
};

// --- Components ---

// New Overlay Component for Locked Features
const LockedFeatureOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative h-full w-full">
      <div className="blur-sm select-none pointer-events-none opacity-60 h-full w-full transition-all duration-500">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center max-w-sm backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Em Breve</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Esta funcionalidade avançada está em desenvolvimento e estará disponível na próxima atualização do sistema.
          </p>
        </div>
      </div>
    </div>
);

export const MetricsChart: React.FC<{ 
    metricTitle: string,
    dataSets: Record<Period, DataSet>,
    valueFormatter: (value: number) => string,
    onDataChange?: (data: { current: number, previous: number, change: number, period: string }) => void
}> = ({ metricTitle, dataSets, valueFormatter, onDataChange }) => {
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');
    const [period, setPeriod] = useState<Period>('Meses');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
    
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const activeDataSet = useMemo(() => dataSets[period], [period, dataSets]);

    const getChangeColor = (change: number) => {
        if (change === 0) return 'text-gray-500 dark:text-gray-400';
        return change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
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

    // Propagate data changes to parent for external widgets
    React.useEffect(() => {
        if (onDataChange) {
            onDataChange({
                current: summaryData.currentValue,
                previous: summaryData.previousValue,
                change: summaryData.previousPeriodPercentageChange,
                period: period
            });
        }
    }, [summaryData, period, onDataChange]);


    return (
        <div className="bg-[var(--bg-card)] p-6 rounded-xl text-gray-600 dark:text-gray-300 font-sans border border-[var(--border-color)] shadow-sm">
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
                        <p>Sem dados.</p>
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
       </div>
    );
};

const FinancialHealthDeepDive: React.FC = () => {
    return (
        <div>
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary-500" />
                        Análise de Saúde Financeira
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase">
                        Saudável
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Liquidity */}
                    <div className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-color)]">
                        <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-semibold text-sm">Índice de Liquidez</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.5x</p>
                        <p className="text-xs text-gray-500 mt-1">Você tem 2.5x mais ativos líquidos do que despesas mensais.</p>
                    </div>

                    {/* Debt to Income */}
                    <div className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-color)]">
                        <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                            <Scale className="h-4 w-4" />
                            <span className="font-semibold text-sm">Comprometimento</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">25%</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Sua renda está bem distribuída.</p>
                    </div>

                    {/* Reserve */}
                    <div className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-color)]">
                        <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-semibold text-sm">Reserva de Emergência</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3 Meses</p>
                        <p className="text-xs text-gray-500 mt-1">Recomendado: 6 meses. Você está no caminho certo.</p>
                    </div>
                </div>
            </div>
            
            {/* Smart Recommendation below Health */}
            <SmartForecastWidget 
                customTitle="Dica de Especialista"
                customText="Para atingir o nível 'Excelente', tente aumentar sua reserva de emergência para cobrir 6 meses de custos fixos."
                forceColor="green"
            />
        </div>
    );
};

// Componente para exibir explicação de uma métrica específica
const MetricExplanationView: React.FC<{ title: string }> = ({ title }) => {
    const definition = METRIC_DEFINITIONS[title] || METRIC_DEFINITIONS['default'];

    return (
        <div className="animate-in fade-in duration-300 space-y-6 h-full flex flex-col">
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-8 shadow-sm relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Target className="h-32 w-32" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                    </div>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-3xl">
                        {definition.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="bg-[var(--bg-input)] rounded-lg p-4 border border-[var(--border-color)] flex-1">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Fórmula</span>
                            <code className="text-sm font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                                {definition.formula}
                            </code>
                        </div>
                        <div className="bg-[var(--bg-input)] rounded-lg p-4 border border-[var(--border-color)] flex-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Lock className="h-4 w-4" />
                            <span className="text-sm">Dados insuficientes para cálculo automático.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Placeholder Visual para Simulação e Smart Widget - Wrapper para o Blur */}
            <div className="flex-1 flex flex-col relative">
                <div className="opacity-60 pointer-events-none relative mb-4">
                    <div className="blur-sm filter">
                         <MetricsChart 
                            metricTitle={`Evolução de ${title}`}
                            dataSets={incomeDataSets} // Dummy data for visual
                            valueFormatter={(v) => v.toString()}
                        />
                    </div>
                </div>
                
                {/* Smart Forecast Dummy - To be covered by blur as requested */}
                <SmartForecastWidget 
                    customTitle="Insight Preditivo"
                    customText="Com base nos dados históricos, projetamos um crescimento de 15% nesta métrica nos próximos 3 meses."
                    forceColor="neutral"
                />
            </div>
        </div>
    );
};

export const MetricsContent: React.FC<{ currency: string }> = ({ currency }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(val);
    
    const [chartDataState, setChartDataState] = useState<{current: number, previous: number, change: number, period: string} | null>(null);
    const [selectedMetric, setSelectedMetric] = useState('Saldo Total');

    const menuItems = [
        { 
            category: "VISÃO GERAL",
            badge: "EM BREVE",
            items: ["Saldo Total", "Receitas", "Despesas", "Fluxo de Caixa", "Saúde Financeira", "Metas", "Comparativos"].map(label => ({ label, icon: Lock })) 
        },
        // Apply badges and icons to the specific categories as requested
        ...[
            {
                category: "RECEITA & RETENÇÃO",
                items: [
                    "Receita Recorrente Mensal (MRR)", "Receita Recorrente Anual (ARR)", "Taxa de Crescimento", 
                    "Receita Bruta", "Taxas de Pagamento", "Reembolsos", "Receita Líquida", 
                    "Churn de Usuários", "Churn de Receita (MRR)", "Churn Líquido de Receita (Net MRR)", 
                    "Taxa de Retenção de Clientes (CRR)", "Nova Receita Recorrente (New MRR)", 
                    "Receita de Expansão (Expansion MRR)", "Receita de Reativação (Reactivation MRR)", 
                    "Receita Perdida por Downgrade (Contraction MRR)", "Volatilidade de Receita (MRR Volatility)"
                ]
            },
            {
                category: "CLIENTES & VALOR",
                items: [
                    "Quantidade de Clientes", "Ticket Médio / Receita Média por Cliente (ARPA / ARPU)", 
                    "Valor do Ciclo de Vida do Cliente (LTV / CLV)", "Retenção Bruta de Receita (GRR)", 
                    "Retenção Líquida de Receita (NRR)", "Razão de Upgrades/Downgrades"
                ]
            },
            {
                category: "AQUISIÇÃO & MARKETING",
                items: [
                    "Custo de Aquisição de Cliente (CAC)", "Custo de Aquisição por Canal (CAC)", 
                    "Eficiência do Gasto em Marketing (SER)", "Eficiência Geral de Marketing (MER)", 
                    "Taxa de Conversão de Leads", "Taxa de Fechamento de Leads Qualificados (SQL)", 
                    "Período de Payback do CAC", "Custo por Clique (CPC)", "Custo por Mil Impressões (CPM)", 
                    "Custo por Lead (CPL)", "Custo por Aquisição (CPA)", "Taxa de Cliques (CTR)", 
                    "Taxa de Conversão da Página (CVR)", "Retorno sobre Anúncios (ROAS)", "Frequência de Exibição", 
                    "Pontuação de Relevância (QS)", "Impressões", "Alcance", "Cliques que Viram Leads", 
                    "Cliques que Viram Compras", "Valor Médio por Conversão (ACV)", "Tempo até a Conversão"
                ]
            },
            {
                category: "ATIVAÇÃO & ONBOARDING",
                items: [
                    "Tempo até o Primeiro Valor (TTFV)", "Taxa de Ativação", "Índice de Satisfação do Cliente (NPS)"
                ]
            },
            {
                category: "PROJETOS & ENGENHARIA",
                items: [
                    "Índice de Desempenho de Custos (CPI)", "Índice de Desempenho de Cronograma (SPI)", 
                    "Retorno de Projetos (ROI)", "Produtividade do Time (Throughput)", "Tempo de Implementação (Lead Time)"
                ]
            }
        ].map(cat => ({
            ...cat,
            badge: "EM BREVE",
            items: cat.items.map(label => ({ label, icon: Lock }))
        }))
    ];

    // Helper to identify if the selected item belongs to a locked category
    const isLockedItem = (itemName: string) => {
        const lockedCategory = menuItems.find(cat => cat.items.some(item => item.label === itemName));
        return lockedCategory?.badge === "EM BREVE";
    };

    const renderContent = () => {
        let content = null;

        switch(selectedMetric) {
            case 'Saldo Total':
            case 'Receitas':
            case 'Despesas':
            case 'Fluxo de Caixa':
            case 'Saúde Financeira':
            case 'Metas':
            case 'Comparativos':
                // All these are now locked based on the prompt for 'Visão Geral' and 'Análise'
                content = <MetricExplanationView title={selectedMetric} />;
                break;
            default:
                // Renderiza a tela de explicação para qualquer métrica nova do menu lateral
                content = <MetricExplanationView title={selectedMetric} />;
        }

        if (isLockedItem(selectedMetric)) {
            return (
                <LockedFeatureOverlay>
                    {content}
                </LockedFeatureOverlay>
            );
        }

        return content;
    };

    return (
        <ContentWithSidebarLayout
            title="Métricas"
            menuItems={menuItems}
            selectedItem={selectedMetric}
            setSelectedItem={setSelectedMetric}
        >
            {renderContent()}
        </ContentWithSidebarLayout>
    );
};

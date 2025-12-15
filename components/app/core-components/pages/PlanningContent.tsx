
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  ZoomIn, 
  ZoomOut,
  Target,
  MoreHorizontal
} from 'lucide-react';
import { Meta } from '../../types';

// --- Interfaces ---

interface PlanningContentProps {
    metas?: Meta[];
    onUpdateMetas?: (metas: Meta[]) => void;
}

// Internal representation for Gantt
interface Task {
  id: string; // KR ID
  title: string;
  startOffset: number;
  duration: number;
  progress: number;
  color: string;
  status: 'active' | 'done';
  parentId: string; // Meta ID
  originalStartDate: string;
  originalEndDate: string;
  dependencyId?: string; // Links to another Task ID
}

interface TaskGroup {
  id: string; // Meta ID
  label: string;
  tasks: Task[];
  expanded: boolean;
}

// --- Constantes de Layout ---
const ROW_HEIGHT = 48; // Mais espaçamento vertical (respiro)
const HEADER_HEIGHT = 64; // Cabeçalho mais compacto
const GROUP_HEADER_HEIGHT = 40; // Altura do grupo

export const PlanningContent: React.FC<PlanningContentProps> = ({ metas = [], onUpdateMetas }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [colWidth, setColWidth] = useState(56); // Colunas um pouco mais largas por padrão
  
  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize-left' | 'resize-right' | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialTaskSnapshot, setInitialTaskSnapshot] = useState<{ start: number, duration: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- Date Calculation Logic ---
  
  const timelineStart = useMemo(() => {
      if (metas.length === 0) {
          const d = new Date();
          d.setDate(d.getDate() - 7);
          return d;
      }
      
      let minDate = new Date();
      metas.forEach(m => {
          m.keyResults.forEach(kr => {
              const start = new Date(kr.startDate);
              if (start < minDate) minDate = start;
          });
      });
      const buffer = new Date(minDate);
      buffer.setDate(buffer.getDate() - 7); // Buffer de 1 semana antes
      return buffer;
  }, [metas]);

  const daysArray = useMemo(() => {
      let maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 90); 

      metas.forEach(m => {
          m.keyResults.forEach(kr => {
              const end = new Date(kr.endDate);
              if (end > maxDate) maxDate = end;
          });
      });
      
      // Add buffer to end
      const bufferEnd = new Date(maxDate);
      bufferEnd.setDate(bufferEnd.getDate() + 14);

      const days = [];
      const current = new Date(timelineStart);
      const today = new Date();

      while (current <= bufferEnd) {
          days.push({
              date: new Date(current),
              day: current.getDate(),
              weekday: current.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase(),
              isWeekend: current.getDay() === 0 || current.getDay() === 6,
              isToday: current.getDate() === today.getDate() && current.getMonth() === today.getMonth() && current.getFullYear() === today.getFullYear()
          });
          current.setDate(current.getDate() + 1);
      }
      return days;
  }, [timelineStart, metas]);

  const groups: TaskGroup[] = useMemo(() => {
      return metas.map(meta => {
          const tasks: Task[] = meta.keyResults.map(kr => {
              const start = new Date(kr.startDate);
              const end = new Date(kr.endDate);
              
              const diffTime = Math.abs(start.getTime() - timelineStart.getTime());
              const startOffset = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              const durationTime = Math.abs(end.getTime() - start.getTime());
              const duration = Math.ceil(durationTime / (1000 * 60 * 60 * 24)) + 1;

              const progress = Math.min((kr.current / kr.target) * 100, 100);

              // Cores mais sofisticadas e menos saturadas
              let color = 'bg-slate-500';
              if (meta.area === 'sales') color = 'bg-emerald-500';
              if (meta.area === 'marketing') color = 'bg-violet-500';
              if (meta.area === 'tech') color = 'bg-blue-500';
              if (meta.area === 'product') color = 'bg-amber-500';

              return {
                  id: kr.id,
                  title: kr.description,
                  startOffset,
                  duration: Math.max(1, duration),
                  progress,
                  color,
                  status: progress >= 100 ? 'done' : 'active',
                  parentId: meta.id,
                  originalStartDate: kr.startDate,
                  originalEndDate: kr.endDate,
                  dependencyId: kr.dependencyId
              };
          });

          return {
              id: meta.id,
              label: meta.objective,
              tasks,
              expanded: expandedGroups[meta.id] !== false // Default expanded
          };
      });
  }, [metas, timelineStart, expandedGroups]);


  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // --- Update & Drag Logic ---

  const updateTaskDate = (taskId: string, newStartOffset: number, newDuration: number) => {
      if (!onUpdateMetas) return;

      const newStartDate = new Date(timelineStart);
      newStartDate.setDate(newStartDate.getDate() + newStartOffset);
      
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + (newDuration - 1));

      const sStr = newStartDate.toISOString().split('T')[0];
      const eStr = newEndDate.toISOString().split('T')[0];

      const updatedMetas = metas.map(m => ({
          ...m,
          keyResults: m.keyResults.map(kr => {
              if (kr.id === taskId) {
                  return { ...kr, startDate: sStr, endDate: eStr };
              }
              return kr;
          })
      }));

      onUpdateMetas(updatedMetas);
  };

  const handleMouseDown = (e: React.MouseEvent, task: Task, type: 'move' | 'resize-left' | 'resize-right') => {
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setActiveTaskId(task.id);
    setDragStartX(e.clientX);
    setInitialTaskSnapshot({ start: task.startOffset, duration: task.duration });
  };

  const [tempTaskState, setTempTaskState] = useState<{ id: string, start: number, duration: number } | null>(null);

  const handleWindowMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging || !activeTaskId || !initialTaskSnapshot) return;

      const deltaPixels = e.clientX - dragStartX;
      const deltaDays = Math.round(deltaPixels / colWidth);

      let newStart = initialTaskSnapshot.start;
      let newDuration = initialTaskSnapshot.duration;

      if (dragType === 'move') {
        newStart = Math.max(0, initialTaskSnapshot.start + deltaDays);
      } else if (dragType === 'resize-right') {
        newDuration = Math.max(1, initialTaskSnapshot.duration + deltaDays);
      } else if (dragType === 'resize-left') {
        const potentialStart = initialTaskSnapshot.start + deltaDays;
        if (potentialStart < (initialTaskSnapshot.start + initialTaskSnapshot.duration)) {
            newStart = Math.max(0, potentialStart);
            newDuration = (initialTaskSnapshot.start + initialTaskSnapshot.duration) - newStart;
        }
      }

      setTempTaskState({ id: activeTaskId, start: newStart, duration: newDuration });

  }, [isDragging, activeTaskId, dragStartX, initialTaskSnapshot, dragType, colWidth]);

  const handleWindowMouseUp = useCallback(() => {
    if (isDragging && activeTaskId && tempTaskState) {
        updateTaskDate(activeTaskId, tempTaskState.start, tempTaskState.duration);
    }
    setIsDragging(false);
    setDragType(null);
    setActiveTaskId(null);
    setInitialTaskSnapshot(null);
    setTempTaskState(null);
  }, [isDragging, activeTaskId, tempTaskState]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, handleWindowMouseMove, handleWindowMouseUp]);


  // --- Layout Calculation ---
  
  interface VisibleRow {
    type: 'group' | 'task';
    id: string;
    data: TaskGroup | Task;
    y: number;
    height: number;
  }

  const { visibleRows, totalHeight, taskCoordinates } = useMemo(() => {
    let currentY = 0;
    const rows: VisibleRow[] = [];
    const coordinates: Record<string, { xStart: number, xEnd: number, y: number, height: number }> = {};

    groups.forEach(group => {
      rows.push({ type: 'group', id: group.id, data: group, y: currentY, height: GROUP_HEADER_HEIGHT });
      currentY += GROUP_HEADER_HEIGHT;

      if (group.expanded) {
        group.tasks.forEach(task => {
          rows.push({ type: 'task', id: task.id, data: task, y: currentY, height: ROW_HEIGHT });
          
          const isDraggingThis = activeTaskId === task.id && tempTaskState;
          const start = isDraggingThis ? tempTaskState!.start : task.startOffset;
          const duration = isDraggingThis ? tempTaskState!.duration : task.duration;
          
          coordinates[task.id] = {
              xStart: start * colWidth,
              xEnd: (start + duration) * colWidth,
              y: currentY + (ROW_HEIGHT / 2),
              height: ROW_HEIGHT
          };

          currentY += ROW_HEIGHT;
        });
      }
    });

    return { visibleRows: rows, totalHeight: currentY, taskCoordinates: coordinates };
  }, [groups, colWidth, activeTaskId, tempTaskState]);

  // Generate Dependency Paths (SVG)
  const dependencyLines = useMemo(() => {
      const lines: React.ReactElement[] = [];
      
      groups.forEach(group => {
          if(!group.expanded) return; 

          group.tasks.forEach(task => {
              if (task.dependencyId && taskCoordinates[task.dependencyId] && taskCoordinates[task.id]) {
                  const from = taskCoordinates[task.dependencyId];
                  const to = taskCoordinates[task.id];
                  
                  // Elegant stepped line
                  const path = `
                      M ${from.xEnd} ${from.y} 
                      L ${from.xEnd + 12} ${from.y} 
                      L ${from.xEnd + 12} ${to.y} 
                      L ${to.xStart} ${to.y}
                  `;

                  lines.push(
                      <path 
                          key={`${task.dependencyId}-${task.id}`}
                          d={path}
                          fill="none"
                          stroke="currentColor" 
                          strokeWidth="1.5"
                          className="text-gray-300 dark:text-gray-600"
                          markerEnd="url(#arrowhead)"
                      />
                  );
              }
          });
      });
      return lines;
  }, [groups, taskCoordinates]);


  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] bg-[var(--bg-right)] overflow-hidden rounded-xl border border-[var(--border-color)] shadow-sm">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Planejamento</h2>
                        <p className="text-xs text-gray-500">Cronograma estratégico</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center bg-[var(--bg-input)] rounded-lg p-1 border border-[var(--border-color)]">
                    <button onClick={() => setColWidth(Math.max(30, colWidth - 8))} className="p-1.5 hover:bg-[var(--bg-card)] rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"><ZoomOut className="h-4 w-4"/></button>
                    <button onClick={() => setColWidth(Math.min(100, colWidth + 8))} className="p-1.5 hover:bg-[var(--bg-card)] rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"><ZoomIn className="h-4 w-4"/></button>
                </div>
            </div>
        </div>

        {/* Chart Area */}
        <div className="flex flex-1 overflow-hidden relative select-none" ref={containerRef}>
            
            {/* Sidebar (List) */}
            <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-card)] z-20">
                <div 
                    className="flex items-end pb-4 px-6 border-b border-[var(--border-color)] bg-[var(--bg-card)]"
                    style={{ height: HEADER_HEIGHT }}
                >
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metas & Resultados Chave</span>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full" style={{ height: totalHeight }}>
                        {visibleRows.map(row => {
                            if (row.type === 'group') {
                                const group = row.data as TaskGroup;
                                return (
                                    <div 
                                        key={row.id}
                                        onClick={() => toggleGroup(group.id)}
                                        className="absolute w-full flex items-center justify-between px-4 cursor-pointer transition-colors hover:bg-[var(--bg-input)]/50 border-b border-[var(--border-color)] bg-gray-50/50 dark:bg-white/[0.02]"
                                        style={{ top: row.y, height: row.height }}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden w-full">
                                            {group.expanded ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{group.label}</span>
                                        </div>
                                    </div>
                                );
                            } else {
                                const task = row.data as Task;
                                return (
                                    <div 
                                        key={row.id}
                                        className="absolute w-full flex items-center px-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-input)]/30 group transition-colors box-border pl-10"
                                        style={{ top: row.y, height: row.height }}
                                    >
                                        <div className="flex items-center gap-2 w-full overflow-hidden">
                                            <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'done' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            <span className={`text-sm truncate ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-600 dark:text-gray-300'}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>

            {/* Timeline (Chart) */}
            <div className={`flex-1 overflow-auto bg-[var(--bg-right)] relative scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                <div className="relative" style={{ width: daysArray.length * colWidth, minWidth: '100%' }}>
                    
                    {/* Header */}
                    <div className="sticky top-0 z-30 flex border-b border-[var(--border-color)] bg-[var(--bg-card)]" style={{ height: HEADER_HEIGHT }}>
                        {daysArray.map((d, i) => (
                            <div 
                                key={i} 
                                className={`flex flex-col items-center justify-end pb-3 border-r border-[var(--border-color)] flex-shrink-0 transition-colors ${d.isToday ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                                style={{ width: colWidth }}
                            >
                                <span className={`text-[10px] font-semibold mb-0.5 ${d.isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                                    {d.weekday}
                                </span>
                                <div className={`text-sm font-bold ${d.isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {d.day}
                                </div>
                                {d.isToday && <div className="h-0.5 w-4 bg-primary-500 rounded-full mt-1"></div>}
                            </div>
                        ))}
                    </div>

                    {/* Grid & Bars */}
                    <div className="relative" style={{ height: totalHeight }}>
                        
                        {/* Background Grid - Very Subtle */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {daysArray.map((d, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-shrink-0 border-r border-[var(--border-color)]/30 border-dashed h-full ${d.isWeekend ? 'bg-gray-50/30 dark:bg-white/[0.01]' : ''}`}
                                    style={{ width: colWidth }}
                                />
                            ))}
                        </div>

                        {/* Dependency Lines Layer */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                            <defs>
                                <marker id="arrowhead" markerWidth="5" markerHeight="5" refX="2" refY="2.5" orient="auto">
                                    <polygon points="0 0, 5 2.5, 0 5" className="fill-gray-300 dark:fill-gray-600" />
                                </marker>
                            </defs>
                            {dependencyLines}
                        </svg>

                        {/* Items */}
                        {visibleRows.map(row => {
                            if (row.type === 'group') {
                                return (
                                    <div 
                                        key={row.id}
                                        className="absolute w-full border-b border-[var(--border-color)] bg-gray-50/50 dark:bg-white/[0.02]"
                                        style={{ top: row.y, height: row.height }}
                                    />
                                );
                            } else {
                                const task = row.data as Task;
                                const isTaskActive = activeTaskId === task.id;
                                
                                const currentStart = (isTaskActive && tempTaskState) ? tempTaskState.start : task.startOffset;
                                const currentDuration = (isTaskActive && tempTaskState) ? tempTaskState.duration : task.duration;

                                return (
                                    <div 
                                        key={row.id}
                                        className="absolute w-full border-b border-[var(--border-color)] hover:bg-[var(--bg-input)]/10 transition-colors"
                                        style={{ top: row.y, height: row.height }}
                                    >
                                        {/* Task Bar */}
                                        <div 
                                            className={`absolute h-6 top-3 rounded-full shadow-sm border border-white/20 ${task.color} transition-all z-20 group select-none flex items-center justify-between
                                                ${isDragging && !isTaskActive ? 'opacity-40' : 'opacity-100'}
                                                ${isTaskActive ? 'shadow-lg ring-2 ring-primary-500/50 z-30' : 'hover:brightness-110'}
                                            `}
                                            style={{
                                                left: currentStart * colWidth + 2, // +2 margin
                                                width: Math.max(colWidth, currentDuration * colWidth) - 4, // -4 margin
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, task, 'move')}
                                        >
                                            {/* Resize Handle Left */}
                                            <div 
                                                className="w-3 h-full cursor-w-resize opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-l-full hover:bg-black/10 transition-opacity"
                                                onMouseDown={(e) => handleMouseDown(e, task, 'resize-left')}
                                            >
                                                <div className="w-1 h-1 bg-white/70 rounded-full" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 px-2 overflow-hidden flex items-center">
                                                <span className="text-[11px] font-bold text-white whitespace-nowrap drop-shadow-sm truncate">
                                                    {task.title}
                                                </span>
                                            </div>

                                            {/* Resize Handle Right */}
                                            <div 
                                                className="w-3 h-full cursor-e-resize opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-r-full hover:bg-black/10 transition-opacity"
                                                onMouseDown={(e) => handleMouseDown(e, task, 'resize-right')}
                                            >
                                                <div className="w-1 h-1 bg-white/70 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

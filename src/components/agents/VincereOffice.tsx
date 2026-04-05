import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentAvatar, AgentRole } from './AgentAvatar';

interface Position {
  x: number;
  y: number;
}

interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  pos: Position;
  target: Position;
  state: 'idle' | 'walking' | 'thinking';
}

const GRID_SIZE = 16;
const CELL_SIZE = 32; // Pixels per grid unit

const initialAgents: Agent[] = [
  { id: '1', name: 'Nathan (CEO)', role: 'CEO', pos: { x: 4, y: 4 }, target: { x: 4, y: 4 }, state: 'idle' },
  { id: '2', name: 'Rhyan (CTO)', role: 'CTO', pos: { x: 12, y: 4 }, target: { x: 12, y: 4 }, state: 'idle' },
  { id: '3', name: 'Dev (Dev)', role: 'Programmer', pos: { x: 8, y: 12 }, target: { x: 8, y: 12 }, state: 'idle' },
];

export const VincereOffice: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [missionLog, setMissionLog] = useState<string[]>(['Time Vincere Inicializado...']);

  // Simulate AI logic / Movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (Math.random() > 0.8 && agent.state === 'idle') {
          const newTarget = { 
            x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1, 
            y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 
          };
          return { ...agent, target: newTarget, state: 'walking' };
        }

        if (agent.state === 'walking') {
          const dx = agent.target.x - agent.pos.x;
          const dy = agent.target.y - agent.pos.y;
          
          if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            return { ...agent, pos: agent.target, state: 'thinking' };
          }

          return { 
            ...agent, 
            pos: { 
              x: agent.pos.x + (dx > 0 ? 0.2 : dx < 0 ? -0.2 : 0),
              y: agent.pos.y + (dy > 0 ? 0.2 : dy < 0 ? -0.2 : 0)
            }
          };
        }

        if (agent.state === 'thinking' && Math.random() > 0.9) {
           return { ...agent, state: 'idle' };
        }

        return agent;
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-square bg-[#1a1a1a] rounded-3xl p-4 overflow-hidden border-8 border-slate-800 shadow-2xl group">
      {/* Grid Floor */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
        }}
      />

      {/* Office Walls (CSS Pseudo-3D) */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-700/50" />
      <div className="absolute top-0 left-0 h-full w-8 bg-slate-700/30" />

      {/* Office Furniture (Pixel-style Rects) */}
      {/* Meeting Table */}
      <div 
        className="absolute w-24 h-48 bg-amber-900 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${7 * CELL_SIZE}px`, top: `${3 * CELL_SIZE}px` }}
      />

      {/* Desks */}
      <div className="absolute flex flex-wrap gap-12 p-8 inset-0 pointer-events-none">
        {[
          { x: 2, y: 10 }, { x: 12, y: 10 }, { x: 7, y: 12 }
        ].map((desk, i) => (
          <div 
            key={i}
            className="absolute w-20 h-12 bg-slate-600 border-2 border-black rounded shadow-[4px_4px_0_0_black]"
            style={{ left: `${desk.x * CELL_SIZE}px`, top: `${desk.y * CELL_SIZE}px` }}
          >
            <div className="absolute top-1 left-1 w-8 h-4 bg-sky-500 rounded-sm opacity-60" /> {/* Laptop */}
          </div>
        ))}
      </div>

      {/* Agents Rendering */}
      {agents.map(agent => (
        <AgentAvatar
          key={agent.id}
          role={agent.role}
          name={agent.name}
          isThinking={agent.state === 'thinking'}
          isMoving={agent.state === 'walking'}
          direction={(agent.target.x - agent.pos.x) >= 0 ? 'right' : 'left'}
          className="absolute z-20 transition-all duration-100 ease-linear"
          style={{ 
            left: `${agent.pos.x * CELL_SIZE}px`, 
            top: `${agent.pos.y * CELL_SIZE}px`,
            transform: 'translate(-50%, -100%)' 
          }}
        />
      ))}

      {/* Mission Control Sidebar (Glassmorphism Overlay) */}
      <div className="absolute bottom-6 left-6 right-6 h-24 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-4 overflow-hidden shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30 shrink-0">
          <div className="w-4 h-4 rounded-full bg-sky-500 animate-pulse" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-[10px] uppercase font-black text-sky-400 tracking-widest">Missão Vincere: SQL Metrics Generation</h4>
          <div className="h-0.5 w-full bg-white/10 rounded-full">
            <motion.div 
               animate={{ width: ['0%', '100%'] }}
               transition={{ duration: 10, repeat: Infinity }}
               className="h-full bg-sky-500 rounded-full" 
            />
          </div>
          <p className="text-[9px] text-white/60 font-mono italic">AGENT_CTO: "Calculando esquemas de Churn e MRR..."</p>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export type AgentRole = 'CEO' | 'CTO' | 'Programmer' | 'Reviewer' | 'Designer';

interface AgentAvatarProps {
  role: AgentRole;
  name: string;
  isThinking?: boolean;
  isMoving?: boolean;
  direction?: 'left' | 'right';
  className?: string;
}

const colors: Record<AgentRole, { primary: string; secondary: string; hair: string }> = {
  CEO: { primary: '#10B981', secondary: '#064E3B', hair: '#1F2937' },
  CTO: { primary: '#3B82F6', secondary: '#1E3A8A', hair: '#D1D5DB' },
  Programmer: { primary: '#8B5CF6', secondary: '#4C1D95', hair: '#4B5563' },
  Reviewer: { primary: '#F59E0B', secondary: '#78350F', hair: '#71717A' },
  Designer: { primary: '#EC4899', secondary: '#831843', hair: '#F472B6' },
};

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  role,
  name,
  isThinking,
  isMoving,
  direction = 'right',
  className = '',
}) => {
  const { primary, secondary, hair } = useMemo(() => colors[role], [role]);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Thinking Bubble */}
      {isThinking && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute -top-12 bg-white text-black text-[8px] font-bold py-1 px-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20"
        >
          PENSANDO...
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-black rotate-45" />
        </motion.div>
      )}

      {/* Pixel Character Container */}
      <motion.div
        animate={isMoving ? { 
          y: [0, -2, 0],
          scaleX: direction === 'left' ? -1 : 1 
        } : { 
          scaleX: direction === 'left' ? -1 : 1 
        }}
        transition={isMoving ? { duration: 0.2, repeat: Infinity } : { duration: 0.2 }}
        className="relative w-8 h-8 flex items-center justify-center p-1"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Simple Pixel Art Representation (SVG) */}
        <svg viewBox="0 0 8 8" className="w-full h-full">
          {/* Hair */}
          <rect x="2" y="0" width="4" height="2" fill={hair} />
          <rect x="1" y="1" width="6" height="1" fill={hair} />
          {/* Face */}
          <rect x="2" y="2" width="4" height="2" fill="#FDE68A" />
          <rect x="2" y="3" width="1" height="1" fill="#000" /> {/* Eye L */}
          <rect x="5" y="3" width="1" height="1" fill="#000" /> {/* Eye R */}
          {/* Body */}
          <rect x="2" y="4" width="4" height="3" fill={primary} />
          <rect x="1" y="5" width="1" height="2" fill={secondary} /> {/* Arm L */}
          <rect x="6" y="5" width="1" height="2" fill={secondary} /> {/* Arm R */}
          {/* Legs */}
          <rect x="2" y="7" width="1" height="1" fill="#1F2937" />
          <rect x="5" y="7" width="1" height="1" fill="#1F2937" />
        </svg>
      </motion.div>

      {/* Name Label */}
      <div className="mt-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap border border-white/20">
        {name}
      </div>
    </div>
  );
};

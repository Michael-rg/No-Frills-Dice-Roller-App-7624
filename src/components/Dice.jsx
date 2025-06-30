import React from 'react';
import {motion} from 'framer-motion';

const Dice = ({value, isHeld, isRolling, onClick}) => {
  // Dot patterns for each face
  const getDotPattern = (num) => {
    const patterns = {
      1: [4], // center
      2: [0, 8], // top-left, bottom-right
      3: [0, 4, 8], // diagonal
      4: [0, 2, 6, 8], // corners
      5: [0, 2, 4, 6, 8], // corners + center
      6: [0, 1, 2, 6, 7, 8] // two columns
    };
    return patterns[num] || [];
  };

  const dotPositions = [
    'top-0.5 left-0.5', // 0: top-left
    'top-0.5 left-1/2 -translate-x-1/2', // 1: top-center
    'top-0.5 right-0.5', // 2: top-right
    'top-1/2 left-0.5 -translate-y-1/2', // 3: middle-left
    'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', // 4: center
    'top-1/2 right-0.5 -translate-y-1/2', // 5: middle-right
    'bottom-0.5 left-0.5', // 6: bottom-left
    'bottom-0.5 left-1/2 -translate-x-1/2', // 7: bottom-center
    'bottom-0.5 right-0.5' // 8: bottom-right
  ];

  const activeDots = getDotPattern(value);

  return (
    <motion.div
      className={`
        relative w-14 h-14 sm:w-16 sm:h-16 cursor-pointer select-none transform-gpu perspective-1000
      `}
      onClick={onClick}
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      animate={isRolling ? {
        rotateX: [0, 360, 720, 1080],
        rotateY: [0, 180, 540, 900],
        rotateZ: [0, 90, 270, 450],
      } : {}}
      transition={isRolling ? {
        duration: 0.8,
        ease: "easeOut",
        times: [0, 0.3, 0.6, 1]
      } : {
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {/* Dice Face */}
      <div
        className={`
          w-full h-full rounded-lg shadow-lg border-2 transition-all duration-200 transform-gpu preserve-3d
          ${isHeld 
            ? 'bg-blue-100 border-blue-300' 
            : 'bg-white border-gray-200 hover:shadow-xl'
          }
        `}
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            translateZ(3px)
            ${isRolling ? 'rotateX(15deg) rotateY(-15deg)' : ''}
          `
        }}
      >
        {/* Top face shadow for 3D effect */}
        <div 
          className="absolute inset-0 rounded-lg bg-gray-100 -z-10"
          style={{
            transform: 'translateX(-1.5px) translateY(-1.5px) translateZ(-1.5px)'
          }}
        />
        
        {/* Side face shadow for 3D effect */}
        <div 
          className="absolute inset-0 rounded-lg bg-gray-200 -z-20"
          style={{
            transform: 'translateX(-3px) translateY(-3px) translateZ(-3px)'
          }}
        />

        {/* Dots - Adjusted for smaller dice */}
        <div className="relative w-full h-full p-0.5">
          {dotPositions.map((position, index) => (
            <div
              key={index}
              className={`
                absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200
                ${position}
                ${activeDots.includes(index) 
                  ? 'bg-black scale-100' 
                  : 'bg-transparent scale-0'
                }
              `}
            />
          ))}
        </div>

        {/* Held indicator - smaller for smaller dice */}
        {isHeld && (
          <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"
            style={{backgroundColor: '#007AFF'}}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dice;
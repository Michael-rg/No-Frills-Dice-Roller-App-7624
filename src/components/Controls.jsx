import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRefreshCw, FiPlay, FiRotateCcw } = FiIcons;

const Controls = ({ numDice, setNumDice, onRoll, onRollAll, isRolling, hasHeldDice }) => {
  const diceOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="space-y-4">
      {/* Number of Dice Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Dice: {numDice}
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {diceOptions.map((num) => (
            <motion.button
              key={num}
              onClick={() => setNumDice(num)}
              className={`
                px-2 py-1.5 rounded-lg font-medium text-sm transition-all duration-200
                ${numDice === num 
                  ? 'text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
              style={{ backgroundColor: numDice === num ? '#007AFF' : undefined }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRolling}
            >
              {num}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Roll Button */}
        <motion.button
          onClick={onRoll}
          disabled={isRolling}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200
            ${isRolling 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-xl transform hover:-translate-y-0.5'
            }
          `}
          style={{ backgroundColor: '#007AFF' }}
          whileHover={!isRolling ? { scale: 1.02 } : {}}
          whileTap={!isRolling ? { scale: 0.98 } : {}}
        >
          <SafeIcon 
            icon={isRolling ? FiRefreshCw : FiPlay} 
            className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} 
          />
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </motion.button>

        {/* Roll All Dice Button */}
        <motion.button
          onClick={onRollAll}
          disabled={isRolling}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg
            ${isRolling 
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 hover:shadow-xl transform hover:-translate-y-0.5'
            }
          `}
          whileHover={!isRolling ? { scale: 1.02 } : {}}
          whileTap={!isRolling ? { scale: 0.98 } : {}}
        >
          <SafeIcon icon={FiRotateCcw} className="w-4 h-4" />
          Roll All Dice
        </motion.button>
      </div>
    </div>
  );
};

export default Controls;
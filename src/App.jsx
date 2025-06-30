import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiceGrid from './components/DiceGrid';
import Controls from './components/Controls';
import DarkModeToggle from './components/DarkModeToggle';
import useDarkMode from './hooks/useDarkMode';

function App() {
  const [numDice, setNumDice] = useState(5);
  const [dice, setDice] = useState([]);
  const [heldDice, setHeldDice] = useState(new Set());
  const [isRolling, setIsRolling] = useState(false);
  const [isDark, toggleDarkMode] = useDarkMode();

  // Initialize dice when number changes
  React.useEffect(() => {
    const newDice = Array.from({ length: numDice }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 6) + 1
    }));
    setDice(newDice);
    setHeldDice(new Set());
  }, [numDice]);

  const rollDice = useCallback(() => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Roll animation duration
    setTimeout(() => {
      setDice(prevDice => 
        prevDice.map(die => 
          heldDice.has(die.id) 
            ? die 
            : { ...die, value: Math.floor(Math.random() * 6) + 1 }
        )
      );
      setIsRolling(false);
    }, 800);
  }, [heldDice, isRolling]);

  const toggleHold = useCallback((diceId) => {
    if (isRolling) return;
    
    setHeldDice(prev => {
      const newSet = new Set(prev);
      if (newSet.has(diceId)) {
        newSet.delete(diceId);
      } else {
        newSet.add(diceId);
      }
      return newSet;
    });
  }, [isRolling]);

  const rollAllDice = useCallback(() => {
    if (isRolling) return;
    
    // Reset all held dice and then roll all dice
    setHeldDice(new Set());
    setIsRolling(true);
    
    // Roll animation duration
    setTimeout(() => {
      setDice(prevDice => 
        prevDice.map(die => ({ 
          ...die, 
          value: Math.floor(Math.random() * 6) + 1 
        }))
      );
      setIsRolling(false);
    }, 800);
  }, [isRolling]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
      
      {/* Header - Fixed at top */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-4 pb-2 text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          🎲 No Frills Dice
        </h1>
      </motion.div>

      <div className="flex flex-col items-center p-4 space-y-4">
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-300 text-sm text-center"
        >
          Click dice to hold, then roll the rest
        </motion.p>

        {/* Dice Grid */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <DiceGrid 
            dice={dice}
            heldDice={heldDice}
            isRolling={isRolling}
            onToggleHold={toggleHold}
          />
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md"
        >
          <Controls
            numDice={numDice}
            setNumDice={setNumDice}
            onRoll={rollDice}
            onRollAll={rollAllDice}
            isRolling={isRolling}
            hasHeldDice={heldDice.size > 0}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
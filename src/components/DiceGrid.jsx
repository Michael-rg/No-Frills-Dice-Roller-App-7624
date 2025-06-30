import React from 'react';
import { motion } from 'framer-motion';
import Dice from './Dice';

const DiceGrid = ({ dice, heldDice, isRolling, onToggleHold }) => {
  // Group dice into rows of 4
  const rows = [];
  for (let i = 0; i < dice.length; i += 4) {
    rows.push(dice.slice(i, i + 4));
  }

  return (
    <div className="space-y-4">
      {rows.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="flex justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rowIndex * 0.1 }}
        >
          {row.map((die) => (
            <Dice
              key={die.id}
              value={die.value}
              isHeld={heldDice.has(die.id)}
              isRolling={isRolling && !heldDice.has(die.id)}
              onClick={() => onToggleHold(die.id)}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default DiceGrid;
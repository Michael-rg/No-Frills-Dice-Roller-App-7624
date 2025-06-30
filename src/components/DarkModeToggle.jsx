import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSun, FiMoon } = FiIcons;

const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`
        fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-yellow-400 hover:from-gray-800 hover:to-gray-700' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-600 hover:from-blue-100 hover:to-indigo-200'
        }
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-5 h-5" />
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
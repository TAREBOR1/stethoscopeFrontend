import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = true, ...props }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
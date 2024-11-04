'use client'

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const ContentWrapper = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 1000 }}
        className="p-4 client-side-wrap"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContentWrapper;

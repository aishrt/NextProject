'use client'

import { useHookForm } from "@/hooks/useHookForm";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from '@mui/lab/LoadingButton';
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function AnimateAuth({ children }: { children: React.ReactNode }) {
    const animations = {
        initial: { opacity: 0, x: -1000 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 300 },
    };

    return (
        <AnimatePresence>
            <motion.div {...animations}>
                {children}
            </motion.div>
        </AnimatePresence>

    );
}

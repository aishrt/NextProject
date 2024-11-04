'use client'

import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import { Button } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import * as z from "zod";

type FormValues = {
    string: string;
};
const schema = z.object({
    string: z.string().min(1, "This is required"),
});
export default function Sample() {
    const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
    const { formState, control, register } = methods;

    const handleSubmit = (values: FormValues) => {
    };

    useEffect(() => {
        setValues({
            string: "",
        });
    }, []);


    return (
        <div className="m-5">
            <Link href="/sample/form">Form</Link>
        </div>
    );
}

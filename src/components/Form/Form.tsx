import clsx from 'clsx';
import * as React from 'react';
import { UseFormReturn, SubmitHandler, UseFormProps, FieldValues } from 'react-hook-form';

type FormProps<TFormValues extends FieldValues> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  methods: UseFormReturn<TFormValues>;
};

const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>>({
  onSubmit,
  children,
  className,
  id,
  methods
}: FormProps<TFormValues>) => {
  return (
    <form
      className={clsx('', className)}
      onSubmit={methods.handleSubmit(onSubmit)}
      id={id}
    >
      {children}
    </form>
  );
};

export default Form;
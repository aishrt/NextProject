import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, Control } from "react-hook-form";

type NumberFieldProps = {
  type?: string;
  name?: string;
  control: Control<any>;
  error: any;
  label?: string;
  className?: string;
  variant?: "standard" | "outlined" | "filled";
};

export const NumberField = (props: NumberFieldProps) => {
  const {
    error,
    name,
    label,
    className,
    control,
    type = "text",
    variant = "standard",
  } = props;
  const [internalValue, setValue] = useState<string>(); // Initialize with null

  return (
    <Controller
      name={name ?? ""}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth error={!!error?.message}>
          {/* <InputLabel htmlFor="component-outlined">{label}</InputLabel> */}
          <TextField
            type="number"
            variant={variant}
            className={className}
            id="component-outlined"
            label={label}
            value={
              internalValue !== undefined
                ? internalValue
                : ![undefined, null].includes(value)
                ? value
                : ""
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const val = event.target.value;
              setValue(val);
              onChange(+val);
            }}
          />
          {error?.message && (
            <FormHelperText id="component-error-text">
              {error?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

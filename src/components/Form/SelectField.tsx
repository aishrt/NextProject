import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { Controller, Control } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type InputFieldProps = {
  name?: string;
  control: Control<any>;
  error: any;
  label?: string;
  className?: string;
  startIcon?: React.ReactElement;
  title?: string;
  placeholder?: string;
  options: Option[];
  disabled?:boolean;
  emitChange?: (val: string | null) => void;
  variant?: "standard" | "outlined" | "filled";
};

const SelectField = (props: InputFieldProps) => {
  const {
    error,
    name,
    disabled = false,
    label,
    control,
    options,
    className,
    startIcon,
    emitChange,
    variant = "standard",
  } = props;

  const [internalValue, setValue] = React.useState<string | null>(null); // Initialize with null
  const [inputValue, setInputValue] = React.useState("");

  const getVal = (vl: string) =>
    options.find((option) => option.value === vl) || null;

  return (
    <Controller
      name={name ?? ""}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          value={internalValue ? getVal(internalValue) : getVal(value)}
          onChange={(
            event: any,
            newValue: { label: string; value: string } | null
          ) => {
            setValue(newValue?.value || null);
            onChange(newValue?.value || null);
            {
              emitChange && emitChange(newValue?.value || null);
            }
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="controllable-states-demo"
          options={options}
          className={className}
          disabled={disabled}
          getOptionLabel={(option) => option.label}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant={variant}
              error={!!error?.message}
              helperText={error?.message}
              InputProps={{
                ...params.InputProps,
                startAdornment: startIcon ? (
                  <InputAdornment position="start">{startIcon}</InputAdornment>
                ) : null,
              }}
            />
          )}
        />
      )}
    />
  );
};

export default SelectField;

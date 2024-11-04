import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

export const MaterialSelectField = ({
  options,
  changeValue,
  setChangeValue,
  label,
  className,
  placeholder,
  customInputValue,
  disabled = false,
  loading,
}: {
  label?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  customInputValue?: React.Dispatch<React.SetStateAction<string>>;
  options: { label: string; value: string | { id: string; sku: string } }[];
  changeValue:
    | { label: string; value: string }
    | null
    | undefined
    | { label: string; value: { id: string; sku: string } };
  setChangeValue: any;
  loading?: boolean;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [open, setOpen] = React.useState(false);

  // useEffect(() => {
  //     if (open && options.length === 0) {
  //         setLoading(true);
  //     } else {
  //         setLoading(false);
  //     }
  // }, [open, options])

  return (
    <div>
      <Autocomplete
        disabled={disabled}
        value={changeValue}
        className={`custom-select ${className}`}
        onChange={(
          event: any,
          newValue: {
            label: string;
            value: string | { id: string; sku: string };
          } | null
        ) => {
          if (typeof newValue?.value === "string") {
            setChangeValue(
              (newValue as { label: string; value: string }) || null
            );
          } else {
            setChangeValue(newValue);
          }
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          if (customInputValue) {
            customInputValue(newInputValue);
          }
        }}
        id="asynchronous-demo"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        loading={loading}
        options={options}
        getOptionLabel={(option) => option.label}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              // endAdornment: (
              //     <React.Fragment>
              //         {loading ? <CircularProgress color="inherit" size={20} /> : null}
              //         {params.InputProps.endAdornment}
              //     </React.Fragment>
              // ),
            }}
          />
        )}
      />
    </div>
  );
};

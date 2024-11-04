import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment, { Moment } from "moment";
import { Controller, Control } from "react-hook-form";

type DateProps = {
  name?: string;
  control: Control<any>;
  error: any;
  label?: string;
  className?: string;
  disablePast?: boolean;
  disabled?:boolean;
  variant?: "standard" | "outlined" | "filled";
  shouldDisableDate?: ((day: any) => boolean) | undefined;
  disableFuture?: boolean;
  emitChange?: (val: string) => void;
};

export default function DateField(props: DateProps) {
  const {
    error,
    name,
    label,
    control,
    className,
    disabled = false,
    disablePast = false,
    variant = "standard",
    shouldDisableDate,
    disableFuture,
    emitChange,
  } = props;
  const [internalValue, setValue] = React.useState<Moment | null>(null);

  return (
    <Controller
      name={name ?? ""}
      control={control}
      render={({ field: { onChange, value } }) => (
        <>
          <DatePicker
            format="DD/MM/YYYY"
            sx={{ width: "100%" }}
            label={label}
            className={className}
            disabled={disabled}
            disablePast={disablePast}
            disableFuture={disableFuture}
            value={value ? moment(value, "DD/MM/YYYY") : internalValue}
            shouldDisableDate={shouldDisableDate}
            onChange={(newValue) => {
              onChange(newValue?.format("DD/MM/YYYY"));
              setValue(newValue);
              {
                emitChange && emitChange(newValue?.format("DD/MM/YYYY") ?? "");
              }
            }}
            slotProps={{
              textField: {
                error: !!error?.message,
                // helperText: error?.message,
                sx: {
                  "& .mui-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    padding: "10px",
                  },
                },
              },
            }}
          />
          {
            !!error?.message && (
              <span className="text-danger f-12">{error?.message}</span>
            )
            // <FormHelperText sx={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
            //   {error.message}
            // </FormHelperText>
          }
        </>
      )}
    />
  );
}

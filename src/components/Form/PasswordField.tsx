import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import { Controller, UseFormRegisterReturn, Control } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type PasswordFieldProps = {
  name?: string;
  control: Control<any>;
  error: any;
  label?: string;
  placeholder?: string;
  className?: string;
};

export const PasswordField = (props: PasswordFieldProps) => {
  const { error, name, label, control, className, placeholder } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={name ?? ""}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth variant="outlined" error={!!error?.message}>
          {/* <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel> */}
          <TextField
            id="outlined-adornment-password"
            variant="standard"
            className={className}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
            //label={label}
            value={value ?? ""}
            defaultValue={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const val = event.target.value;
              onChange(val);
            }}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
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

import clsx from "clsx";
import { useState } from "react";
import { Control, Controller, UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import { FormHelperText } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const variants = {
  primary: "",
  secondary: "bg-button",
  standard: "",
  outlined: "",
  filled: "",
};

type InputFieldProps = FieldWrapperPassThroughProps & {
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "phone"
    | "file"
    | "date"
    | "time";
  className?: string;
  name?: string;
  startIcon?: React.ReactElement;
  control?: Control<any>;
  placeholder?: string;
  blueLabel?: boolean;
  registration?: Partial<UseFormRegisterReturn>;
  variant?: keyof typeof variants;
  floating?: boolean;
  emitChange?: (val: string) => void;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const InputField = (props: InputFieldProps) => {
  const {
    type = "text",
    label,
    name,
    variant = "primary",
    className,
    error,
    control,
    placeholder,
    registration,
    startIcon,
    blueLabel = false,
    floating = false,
    emitChange,
    value,
    onChange,
    disabled,
  } = props;

  const [show, setShow] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (onChange) {
      onChange(event); // Call the passed onChange directly
    } else if (emitChange) {
      emitChange(val); // Call emitChange if provided
    }
  };

  return (
    <FieldWrapper
      floating={floating}
      label={label}
      error={error}
      blueLabel={blueLabel}
    >
      {(() => {
        const Input = control ? (
          <Controller
            name={name ?? ""}
            control={control}
            render={({
              field: { onChange: formOnChange, value: formValue },
            }) => (
              <input
                type={show && type === "password" ? "text" : type}
                value={formValue}
                disabled={disabled}
                className={clsx(
                  "form-control",
                  error?.message && "is-invalid",
                  variants[variant],
                  className
                )}
                {...registration}
                style={{
                  paddingRight: type === "password" ? "35px" : "0.75rem",
                }}
                placeholder={placeholder ?? label}
                onChange={(event) => {
                  handleChange(event);
                  formOnChange(event); // Call the form's onChange
                }}
              />
            )}
          />
        ) : (
          <input
            type={show && type === "password" ? "text" : type}
            value={value}
            className={clsx(
              "form-control",
              error?.message && "is-invalid",
              variants[variant],
              className
            )}
            style={{
              paddingRight: type === "password" ? "35px" : "0.75rem",
            }}
            placeholder={placeholder ?? label}
            {...registration}
            onChange={handleChange} // Use the local handleChange for custom onChange handling
          />
        );

        let InputType = null;

        if (!floating) {
          InputType = Input;
        } else {
          InputType = (
            <div className="form-floating">
              {Input}
              <label>{label}</label>
            </div>
          );
        }

        return (
          <div className="input-group mb-3">
            {startIcon && (
              <span className="input-group-text" id="basic-addon1">
                {startIcon}
              </span>
            )}
            {InputType}
            {type === "password" && (
              <span
                onClick={() => setShow(!show)}
                className={clsx(
                  "input-group-text",
                  "passwordIcon",
                  floating && "floating-icon",
                  error && "errored"
                )}
              >
                {!show ? <VisibilityOff /> : <Visibility />}
              </span>
            )}
          </div>
        );
      })()}
    </FieldWrapper>
  );
};

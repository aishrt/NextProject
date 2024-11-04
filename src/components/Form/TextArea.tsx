import { FormHelperText } from "@mui/material";
import clsx from "clsx";
import { TextareaHTMLAttributes } from "react";
import { Controller, Control } from "react-hook-form";
const EMPTY_OBJECT = { primary: "", secondary: "", layout: "" };

type TextAreaFieldProps = {
  name: string;
  value?: string;
  className?: string;
  control?: Control<any>;
  label?: string;
  title?: string;
  labelIconName?: string | React.FunctionComponent | null;
  requiredAsterisk?: boolean; // TODO: Deprecate in next major version.
  error?: any;
  id?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  iconsNames?: {
    layout: string;
    primary: string;
    secondary: string;
  };
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaField = (props: TextAreaFieldProps) => {
  const {
    error,
    control,
    name,
    label,
    title = "",
    variant = "standard",
    className = "",
    labelIconName,
    iconsNames = EMPTY_OBJECT,
    requiredAsterisk = false,
    id = "input",
    ...textareaProps
  } = props;

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <label>{label}</label>
            <textarea
              className={clsx(
                "form-control",
                error?.message && "is-invalid",
                className
              )}
              onChange={onChange}
              value={value}
              {...props}
            ></textarea>
            {error?.message && (
              <FormHelperText id="component-error-text" className="text-danger">
                {error?.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    );
  } else {
    return (
      <>
        <label>{title}</label>
        <textarea
          className={clsx("form-control", error && "is-invalid", className)}
          {...textareaProps}
        />
      </>
    );
  }
};

export default TextAreaField;

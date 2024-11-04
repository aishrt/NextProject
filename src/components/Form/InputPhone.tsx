import clsx from "clsx";
import { useEffect } from "react";
import {
  Controller,
  Control,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import { isValidPhoneNumber } from "react-phone-number-input";

export const isValidMobile = (phonenumber: unknown) => {
  if (!phonenumber) return false;
  return isValidPhoneNumber(phonenumber.toString());
};

export const isValidMobileMsg = (phonenumber: unknown) => {
  if (!phonenumber) return { message: "Phone number is required" };
  if (!isValidPhoneNumber(phonenumber.toString()))
    return { message: "Phone number is not valid!" };
  return { message: "" };
};

type InputFieldProps = FieldWrapperPassThroughProps & {
  name: string;
  error?: any;
  control: Control<any>;
  value?: string;
  floating?: boolean;
  className?: string;
  variant?: "standard" | "outlined" | "filled";
  emitChange?: (val: string) => void;
};

export const InputPhone = (props: InputFieldProps) => {
  const {
    control,
    name,
    error,
    label,
    className,
    variant = "standard",
    emitChange,
  } = props;

  return (
    <FieldWrapper label={label} error={error}>
      <Controller
        name={name ?? ""}
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <PhoneInput
              className={clsx(
                "form-control phone-control",
                className && "floating"
              )}
              defaultCountry="FR"
              placeholder="Enter phone number"
              value={value}
              onChange={(val: any) => {
                onChange(val);
                {
                  emitChange && emitChange(val);
                }
              }}
              variant={variant}
            />
          </>
        )}
      />
    </FieldWrapper>
  );
};

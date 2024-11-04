import { zodResolver } from "@hookform/resolvers/zod";
import { Path, PathValue, UseFormProps, useForm } from "react-hook-form";
import { ZodType, ZodTypeDef } from "zod";

export const useHookForm = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
    unknown,
    ZodTypeDef,
    unknown
  >
>(
  schema: Schema,
  options?: UseFormProps<TFormValues>,
) => {
  const methods = useForm<TFormValues>({
    ...options,
    resolver: schema && zodResolver(schema),
  });

  const setValues = (valuesToSet: Partial<TFormValues>) => {
    Object.keys(valuesToSet).forEach((fieldName) => {
      methods.setValue(
        fieldName as Path<TFormValues>,
        valuesToSet[fieldName] as PathValue<TFormValues, Path<TFormValues>>
      );
    });
  };
  return { methods, setValues };
};

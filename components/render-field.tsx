"use client";

import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

interface BaseFieldProps {
  children?: React.ReactNode;
  label: string;
  placeholder?: string;
}
interface RenderFieldProps<T extends FieldValues> extends BaseFieldProps {
  control: Control<T>;
  name: FieldPath<T>;

  type?: string;
  children?: React.ReactNode;
}

interface RenderTextAreaFieldProps<T extends FieldValues>
  extends BaseFieldProps {
  control: Control<T>;
  name: FieldPath<T>;
  rows?: number;
}

export const RenderField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  children,
}: RenderFieldProps<T>) => {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              pattern={type === "tel" ? "[0-9]+" : undefined}
              placeholder={placeholder}
              type={type}
              {...field}
              onChange={(e) => {
                if (type === "tel") {
                  const numericValue = e.target.value.replaceAll(/\D/g, "");
                  field.onChange(numericValue);
                } else {
                  field.onChange(e);
                }
              }}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      {children}
    </FieldGroup>
  );
};

export const RenderTextAreaField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  children,
  rows = 5,
}: RenderTextAreaFieldProps<T>) => {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            <Textarea
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              rows={rows}
              {...field}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      {children}
    </FieldGroup>
  );
};

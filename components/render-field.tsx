"use client";

import { type Control, Controller, type FieldPath } from "react-hook-form";
import type { SignUpData } from "@/app/schema/auth";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface RenderFieldProps {
  control: Control<SignUpData>;
  name: FieldPath<SignUpData>;
  label: string;
  placeholder?: string;
  type?: string;
  children?: React.ReactNode;
}

export const RenderField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  children,
}: RenderFieldProps) => {
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

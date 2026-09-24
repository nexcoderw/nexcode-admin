export function paymentFieldError(
  fields: string[],
  field: string,
  message: string,
) {
  return fields.includes(
    field,
  )
    ? message
    : undefined;
}

export function optionalValue(
  value: string,
) {
  return value.trim();
}
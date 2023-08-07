import { ValidationRuleWithoutParams } from "@vuelidate/core";

export function ArrayNotEmpty(
  array: Array<any>
): ValidationRuleWithoutParams {
  return {
    $validator: () => array.length > 0,
    $message: () => `Select at least one option.`,
  };
}

import resultLabelDictionary from "../data/result-label-dictionary.json";

const RESULT_LABEL_DICTIONARY: Record<string, string> = resultLabelDictionary;

function humanizeTechnicalKey(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
}

export function translateResultLabel(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return RESULT_LABEL_DICTIONARY[value] ?? humanizeTechnicalKey(value);
}

export { RESULT_LABEL_DICTIONARY };

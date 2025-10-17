import { ToAttributeMap } from "./attribute-value.js";

export enum JsonFormat {
  AttributeValue = "AttributeValue",
  Document = "Document",
  Default = AttributeValue,
}

export type FormatObject<
  T,
  Format extends JsonFormat,
> = Format extends JsonFormat.AttributeValue
  ? T extends undefined
    ? undefined
    : ToAttributeMap<Extract<T, object>>
  : T;

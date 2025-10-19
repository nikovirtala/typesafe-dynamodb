export type {
  AttributeValue,
  AttributeMap,
  NativeBinaryAttribute,
  DocumentValue,
  ToAttributeMap,
  ToAttributeValue,
  S,
  N,
  B,
  BOOL,
  NULL,
  L,
  M,
} from "./attribute-value.js";
export { JsonFormat } from "./json-format.js";
export { marshall, unmarshall } from "./marshall.js";
export type { NumberValue, Unmarshall } from "./marshall.js";
export type { CreateSet } from "./create-set.js";

export type { TypeSafeDynamoDBv3 } from "./client-v3.js";

export { TypeSafeGetItemCommand } from "./get-item-command.js";
export { TypeSafePutItemCommand } from "./put-item-command.js";
export { TypeSafeDeleteItemCommand } from "./delete-item-command.js";
export { TypeSafeUpdateItemCommand } from "./update-item-command.js";
export { TypeSafeBatchWriteItemCommand } from "./batch-write-item-command.js";
export { TypeSafeTransactWriteItemsCommand } from "./transact-write-items-command.js";

export type {
  DynamoDBStreamEvent,
  DynamoDBRecord,
  StreamRecord,
} from "./stream-event.js";

export type { TypeSafeDocumentClientV3 } from "./document-client-v3.js";

export { TypeSafeGetDocumentCommand } from "./get-document-command.js";
export { TypeSafePutDocumentCommand } from "./put-document-command.js";
export { TypeSafeDeleteDocumentCommand } from "./delete-document-command.js";
export { TypeSafeUpdateDocumentCommand } from "./update-document-command.js";
export { TypeSafeQueryDocumentCommand } from "./query-document-command.js";
export { TypeSafeScanDocumentCommand } from "./scan-document-command.js";
export { TypeSafeBatchWriteDocumentCommand } from "./batch-write-document-command.js";
export { TypeSafeTransactWriteDocumentCommand } from "./transact-write-documents-command.js";

export { SchemaValidatedDocumentClient } from "./schema-validated-document-client.js";

export { SchemaValidatedPutDocumentCommand } from "./schema-validated-put-document-command.js";
export { SchemaValidatedGetDocumentCommand } from "./schema-validated-get-document-command.js";
export { SchemaValidatedDeleteDocumentCommand } from "./schema-validated-delete-document-command.js";
export { SchemaValidatedQueryDocumentCommand } from "./schema-validated-query-document-command.js";
export { SchemaValidatedScanDocumentCommand } from "./schema-validated-scan-document-command.js";
export { SchemaValidatedUpdateDocumentCommand } from "./schema-validated-update-document-command.js";

export {
  validateStreamEvent,
  validateStreamRecord,
} from "./schema-validated-stream-event.js";

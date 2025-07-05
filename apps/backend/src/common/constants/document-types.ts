export const DocumentType = {
  OUTLINE: 'OUTLINE',
  CHARACTERS: 'CHARACTERS',
  WORLDBUILDING: 'WORLDBUILDING',
  OTHER: 'OTHER',
} as const;

export type DocumentTypeValue = typeof DocumentType[keyof typeof DocumentType];

export const DocumentTypeArray = Object.values(DocumentType);

export const DocumentTypeLabels = {
  [DocumentType.OUTLINE]: '大纲',
  [DocumentType.CHARACTERS]: '人物设定',
  [DocumentType.WORLDBUILDING]: '世界观设定',
  [DocumentType.OTHER]: '其他',
} as const;

export function isValidDocumentType(type: string): type is DocumentTypeValue {
  return DocumentTypeArray.includes(type as DocumentTypeValue);
}

export function getDocumentTypeLabel(type: DocumentTypeValue): string {
  return DocumentTypeLabels[type] || '未知类型';
}

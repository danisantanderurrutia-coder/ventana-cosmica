export type StreamCategory = 
  | 'OFFICIAL_MILITARY' 
  | 'METAPHYSICAL_CANALIZATION' 
  | 'UNRESOLVED_FOLKLORE' 
  | 'PROVEN_HOAX';

export interface ExtractedEntities {
  people: string[];
  locations: string[];
  dates: string[];
  craft_types: string[];
  organizations: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  source_type: string;
  source_url?: string;
  author?: string;
  publication_date?: string;
  raw_content: string;
  cleaned_content: string;
  stream_category: StreamCategory;
  verification_status: string;
  confidence_score: number;
  summary: string;
  entities: ExtractedEntities;
  tags: string[];
  is_hoax: boolean;
  debunk_reason?: string;
  debunk_citation?: string;
  created_at: string;
  
  // Top Secret Investigative & Archival Metadata
  archive_reference?: string;        // e.g. "UK-NA: DEFE 24/1948"
  repository_name?: string;          // e.g. "The National Archives (UK) Discovery"
  repository_url?: string;           // Direct link to official repository
  classification_level?: string;      // "DECLASSIFIED // FOIA RELEASE"
  evidence_chain?: string[];         // Documentary evidence items
  case_file_number?: string;         // "CASE-NAV-2004-FLIR1"
  redacted_snippets?: string[];      // Redacted text fragments
  
  // Archival Photos & Document Plates
  image_url?: string;                // Real historical archival photo or document facsimile
  image_caption?: string;            // Journalistic caption describing the photograph
  photo_credit?: string;             // Official credit e.g. "US Navy / DoD / NARA"
}

export interface SearchResultItem {
  document: DocumentItem;
  similarity_score: number;
}

export interface StreamStats {
  total_documents: number;
  official_military_count: number;
  metaphysical_canalization_count: number;
  unresolved_folklore_count: number;
  proven_hoax_count: number;
  top_tags: { tag: string; count: number }[];
}

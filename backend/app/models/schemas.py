from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime
import uuid

class StreamCategory(str, Enum):
    OFFICIAL_MILITARY = "OFFICIAL_MILITARY"
    METAPHYSICAL_CANALIZATION = "METAPHYSICAL_CANALIZATION"
    UNRESOLVED_FOLKLORE = "UNRESOLVED_FOLKLORE"
    PROVEN_HOAX = "PROVEN_HOAX"

class VerificationStatus(str, Enum):
    OFFICIAL_RECORD = "OFFICIAL_RECORD"
    METAPHYSICAL_TRANSMISSION = "METAPHYSICAL_TRANSMISSION"
    UNCONFIRMED_FOLKLORE = "UNCONFIRMED_FOLKLORE"
    DEBUNKED_FABRICATION = "DEBUNKED_FABRICATION"

class IngestionType(str, Enum):
    MANUAL_TEXT = "MANUAL_TEXT"
    WEB_URL = "WEB_URL"
    AUDIO_TRANSCRIPT = "AUDIO_TRANSCRIPT"
    RSS_FEED = "RSS_FEED"
    PDF_DOCUMENT = "PDF_DOCUMENT"

class ExtractedEntities(BaseModel):
    people: List[str] = Field(default_factory=list, description="Witnesses, officials, researchers, contactees")
    locations: List[str] = Field(default_factory=list, description="Geographic locations, military bases, celestial systems")
    dates: List[str] = Field(default_factory=list, description="Encounter dates, declassification dates, transmission dates")
    craft_types: List[str] = Field(default_factory=list, description="Craft shapes, e.g., Tic-Tac, Triangle, Disk, Sphere, Light-form")
    organizations: List[str] = Field(default_factory=list, description="Agencies, e.g., AARO, DoD, US Navy, Blue Book, Disclosure Project")

class IngestRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    source_type: IngestionType = Field(default=IngestionType.MANUAL_TEXT)
    raw_content: Optional[str] = Field(None, description="Raw text, transcript, or pasted book excerpt")
    source_url: Optional[str] = Field(None, description="Web URL or reference link")
    author: Optional[str] = Field(None, description="Author, witness, or agency")
    publication_date: Optional[str] = Field(None, description="Date of document or event")
    custom_tags: Optional[List[str]] = Field(default_factory=list)

class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    source_type: IngestionType
    source_url: Optional[str] = None
    author: Optional[str] = None
    publication_date: Optional[str] = None
    raw_content: str
    cleaned_content: str
    
    # Truth-Filter outputs
    stream_category: StreamCategory
    verification_status: VerificationStatus
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    summary: str
    entities: ExtractedEntities
    tags: List[str]
    
    # Debunking metadata
    is_hoax: bool = False
    debunk_reason: Optional[str] = None
    debunk_citation: Optional[str] = None

    # Top Secret Investigative & Archival Metadata
    archive_reference: Optional[str] = Field(None, description="e.g. UK-NA: DEFE 24/1948 or CIA-RDP79B00752")
    repository_name: Optional[str] = Field(None, description="e.g. The National Archives (UK), The Black Vault, CIA Reading Room")
    repository_url: Optional[str] = Field(None, description="Direct URL to archive index")
    classification_level: Optional[str] = Field("RESTRICTED // UNCLASSIFIED", description="Classification header")
    evidence_chain: List[str] = Field(default_factory=list, description="Chain of documentary evidence")
    case_file_number: Optional[str] = Field(None, description="Dossier tracking code e.g. CASE-NAV-2004-FLIR1")
    redacted_snippets: List[str] = Field(default_factory=list, description="Portions flagged under FOIA redactions")
    
    # Archival Photographic Metadata
    image_url: Optional[str] = Field(None, description="Direct URL to historical archive photo or document plate")
    image_caption: Optional[str] = Field(None, description="Journalistic photo caption")
    photo_credit: Optional[str] = Field(None, description="Photo credit or archival source")

    created_at: datetime = Field(default_factory=datetime.utcnow)

class SemanticSearchQuery(BaseModel):
    query: str = Field(..., min_length=2)
    top_k: int = Field(default=5, ge=1, le=50)
    stream_filter: Optional[StreamCategory] = None
    include_hoaxes: bool = True

class SearchResultItem(BaseModel):
    document: Document
    similarity_score: float

class StreamStats(BaseModel):
    total_documents: int
    official_military_count: int
    metaphysical_canalization_count: int
    unresolved_folklore_count: int
    proven_hoax_count: int
    top_tags: List[Dict[str, Any]]

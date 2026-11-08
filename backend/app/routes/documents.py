from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional, Dict, Any
from app.models.schemas import (
    IngestRequest,
    Document,
    StreamCategory,
    SemanticSearchQuery,
    SearchResultItem,
    StreamStats
)
from app.services.ingestion import ingestion_engine
from app.services.verifier import truth_verifier
from app.services.vector_store import vector_store

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/ingest", response_model=Document, status_code=status.HTTP_201_CREATED)
async def ingest_document(request: IngestRequest):
    """
    Ingests text, URLs, transcripts, or reports.
    Passes through the Truth-Filter and Entity Extraction pipeline,
    and indexes into the semantic Vector Store.
    """
    try:
        raw_content, cleaned_content, extracted_title, extracted_author = ingestion_engine.process_ingest_request(request)
        if extracted_title:
            request.title = extracted_title
        if extracted_author:
            request.author = extracted_author
            
        analysis_result = truth_verifier.analyze(request, cleaned_content)
        
        doc = Document(
            title=request.title,
            source_type=request.source_type,
            source_url=request.source_url,
            author=request.author,
            publication_date=request.publication_date,
            raw_content=raw_content,
            cleaned_content=cleaned_content,
            stream_category=analysis_result["stream_category"],
            verification_status=analysis_result["verification_status"],
            confidence_score=analysis_result["confidence_score"],
            summary=analysis_result["summary"],
            entities=analysis_result["entities"],
            tags=analysis_result["tags"],
            is_hoax=analysis_result["is_hoax"],
            debunk_reason=analysis_result["debunk_reason"],
            debunk_citation=analysis_result["debunk_citation"]
        )
        
        vector_store.add_document(doc)
        return doc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ingestion failed: {str(e)}"
        )

@router.get("/feed", response_model=List[Document])
async def get_feed(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    tag: Optional[str] = None
):
    """Returns chronological stream of recent ingested intelligence sources."""
    return vector_store.list_documents(tag=tag, limit=limit, offset=offset)

@router.get("/library", response_model=Dict[str, List[Document]])
async def get_library():
    """Returns intelligence documents segregated across the 4 Truth Streams."""
    docs = vector_store.list_documents(limit=200)
    grouped = {
        StreamCategory.OFFICIAL_MILITARY.value: [],
        StreamCategory.METAPHYSICAL_CANALIZATION.value: [],
        StreamCategory.UNRESOLVED_FOLKLORE.value: [],
        StreamCategory.PROVEN_HOAX.value: []
    }
    for d in docs:
        if d.stream_category.value in grouped:
            grouped[d.stream_category.value].append(d)
    return grouped

@router.get("/{document_id}", response_model=Document)
async def get_document_detail(document_id: str):
    """Retrieves single intelligence document with full verification analysis and debunk banner."""
    doc = vector_store.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc

@router.post("/search", response_model=List[SearchResultItem])
async def semantic_search(query_payload: SemanticSearchQuery):
    """
    Executes a vector semantic search across documents.
    Capable of linking disparate streams (e.g. searching 'triangular craft' returns both military and folklore).
    """
    results = vector_store.semantic_search(
        query=query_payload.query,
        top_k=query_payload.top_k,
        stream_filter=query_payload.stream_filter,
        include_hoaxes=query_payload.include_hoaxes
    )
    return results

@router.get("/analytics/stats", response_model=StreamStats)
async def get_stats():
    """Returns aggregate intelligence telemetry across the 4 streams and tag frequency."""
    docs = list(vector_store.documents.values())
    official_cnt = sum(1 for d in docs if d.stream_category == StreamCategory.OFFICIAL_MILITARY)
    meta_cnt = sum(1 for d in docs if d.stream_category == StreamCategory.METAPHYSICAL_CANALIZATION)
    folk_cnt = sum(1 for d in docs if d.stream_category == StreamCategory.UNRESOLVED_FOLKLORE)
    hoax_cnt = sum(1 for d in docs if d.stream_category == StreamCategory.PROVEN_HOAX)

    # Calculate tag frequency
    tag_counts: Dict[str, int] = {}
    for d in docs:
        for t in d.tags:
            tag_counts[t] = tag_counts.get(t, 0) + 1
            
    sorted_tags = sorted(
        [{"tag": t, "count": c} for t, c in tag_counts.items()],
        key=lambda x: x["count"],
        reverse=True
    )[:12]

    return StreamStats(
        total_documents=len(docs),
        official_military_count=official_cnt,
        metaphysical_canalization_count=meta_cnt,
        unresolved_folklore_count=folk_cnt,
        proven_hoax_count=hoax_cnt,
        top_tags=sorted_tags
    )

import os
import math
import re
from typing import List, Dict, Any, Optional
from app.models.schemas import Document, SearchResultItem, StreamCategory
from app.config import settings

class VectorStoreService:
    def __init__(self):
        self.documents: Dict[str, Document] = {}
        self.chroma_client = None
        self.collection = None
        self._init_chroma()

    def _init_chroma(self):
        try:
            import chromadb
            os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
            self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIRECTORY)
            self.collection = self.chroma_client.get_or_create_collection(
                name="cosmic_archive_docs",
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            print(f"[VectorStore] ChromaDB native initialization notice: {e}. Active with fallback semantic index.")

    def add_document(self, doc: Document):
        self.documents[doc.id] = doc
        
        # Ingest into ChromaDB if available
        if self.collection:
            try:
                # Text for embedding represents title, summary, entities, and first 1000 chars of body
                entities_str = f"Craft: {', '.join(doc.entities.craft_types)} Locations: {', '.join(doc.entities.locations)} People: {', '.join(doc.entities.people)}"
                embed_text = f"{doc.title}\n{doc.summary}\n{entities_str}\n{doc.cleaned_content[:1500]}"
                
                self.collection.upsert(
                    ids=[doc.id],
                    documents=[embed_text],
                    metadatas=[{
                        "document_id": doc.id,
                        "title": doc.title,
                        "stream_category": doc.stream_category.value,
                        "is_hoax": str(doc.is_hoax),
                        "tags": ",".join(doc.tags)
                    }]
                )
            except Exception as e:
                print(f"[VectorStore] Upsert into Chroma failed: {e}")

    def get_document(self, doc_id: str) -> Optional[Document]:
        return self.documents.get(doc_id)

    def list_documents(
        self,
        stream_category: Optional[StreamCategory] = None,
        tag: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Document]:
        docs = list(self.documents.values())
        
        if stream_category:
            docs = [d for d in docs if d.stream_category == stream_category]
            
        if tag:
            clean_tag = tag if tag.startswith("#") else f"#{tag}"
            docs = [d for d in docs if clean_tag in d.tags]

        # Sort recent first
        docs.sort(key=lambda d: d.created_at, reverse=True)
        return docs[offset:offset + limit]

    def semantic_search(
        self,
        query: str,
        top_k: int = 5,
        stream_filter: Optional[StreamCategory] = None,
        include_hoaxes: bool = True
    ) -> List[SearchResultItem]:
        results = []
        
        # 1. Try ChromaDB semantic search first if active
        if self.collection and len(self.documents) > 0:
            try:
                where_filter = {}
                if stream_filter:
                    where_filter["stream_category"] = stream_filter.value
                if not include_hoaxes:
                    where_filter["is_hoax"] = "False"

                chroma_res = self.collection.query(
                    query_texts=[query],
                    n_results=min(top_k, len(self.documents)),
                    where=where_filter if where_filter else None
                )
                
                if chroma_res and chroma_res["ids"] and len(chroma_res["ids"][0]) > 0:
                    matched_ids = chroma_res["ids"][0]
                    distances = chroma_res["distances"][0] if "distances" in chroma_res and chroma_res["distances"] else [0.2] * len(matched_ids)
                    
                    for doc_id, dist in zip(matched_ids, distances):
                        if doc_id in self.documents:
                            # Convert cosine distance to similarity score
                            similarity = max(0.0, min(1.0, 1.0 - (dist if dist is not None else 0.5)))
                            results.append(SearchResultItem(document=self.documents[doc_id], similarity_score=round(similarity, 3)))
                    
                    if results:
                        return results
            except Exception as e:
                print(f"[VectorStore] Chroma query exception: {e}. Executing hybrid lexical/vector fallback.")

        # 2. Hybrid Lexical & Keyword Similarity Fallback
        query_tokens = set(re.findall(r'\w+', query.lower()))
        scored_docs = []

        for doc in self.documents.values():
            if stream_filter and doc.stream_category != stream_filter:
                continue
            if not include_hoaxes and doc.is_hoax:
                continue

            doc_text = f"{doc.title} {doc.summary} {' '.join(doc.tags)} {' '.join(doc.entities.craft_types)} {' '.join(doc.entities.locations)} {doc.cleaned_content[:2000]}".lower()
            doc_tokens = set(re.findall(r'\w+', doc_text))

            # Jaccard / Overlap bonus
            intersection = query_tokens.intersection(doc_tokens)
            if not intersection:
                continue

            overlap_ratio = len(intersection) / max(1, len(query_tokens))
            
            # Additional boost for exact title or craft matches
            title_boost = 0.3 if any(tok in doc.title.lower() for tok in query_tokens) else 0.0
            craft_boost = 0.25 if any(c.lower() in query.lower() for c in doc.entities.craft_types) else 0.0
            
            final_score = min(1.0, 0.4 * overlap_ratio + title_boost + craft_boost)
            scored_docs.append((doc, final_score))

        scored_docs.sort(key=lambda x: x[1], reverse=True)
        
        for doc, score in scored_docs[:top_k]:
            results.append(SearchResultItem(document=doc, similarity_score=round(score, 3)))

        return results

vector_store = VectorStoreService()

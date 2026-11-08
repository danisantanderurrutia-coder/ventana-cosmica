# Ventana Cósmica 🛸📰
### Plataforma de Inteligencia, Archivos Desclasificados & Búsqueda Semántica de Fenómenos Anómalos

**Ventana Cósmica** es una plataforma de investigación y análisis diseñada para cotejar de forma sistemática documentos oficiales desclasificados (AARO, Pentágono, Ministerio de Defensa del Reino Unido, CIA), literatura de contacto metafísico (*The Law of One*, *Ra Material*), folclore histórico no resuelto (Aurora 1897, Roswell 1947) y fraudes comprobados bajo peritaje forense (Cartas de Ummo, Autopsia de Santilli). 

It features an automated **Truth-Filter pipeline** classifying records into 4 dedicated streams, an **Ingestion Engine** (Web URLs, Transcripts, Documents, Manual Entry), and a **Vector Embedding Search** that uncovers cross-stream correlations (e.g., connecting military radar intercepts with historical folklore).

---

## 🌟 Core Features

1. **Ingestion Engine (The Collector)**:
   - Ingests Web URLs, PDF excerpts, RSS feeds (AARO, FOIA), and podcast/audio transcripts.
   - Text sanitizer strips noise, timestamps, and formatting artifacts.

2. **Truth-Filter & Categorization (The Verifier)**:
   - Classifies ingested content into 4 distinct epistemological streams:
     * `[OFFICIAL/MILITARY]`: Declassified sensor data, radar logs, Pentagon/AARO records, sworn pilot testimonies.
     * `[METAPHYSICAL/CANALIZATION]`: Channeled material, multidimensional philosophy, meditative contact.
     * `[UNRESOLVED FOLKLORE]`: Historical sightings, regional myths, and ancient astronaut lore lacking hard sensor verification.
     * `[PROVEN HOAX / DEBUNKED]`: Confessed or forensically disproven fabrications (e.g., Ummo letters, Santilli autopsy film, San José de Valderas photos) flagged with an unmissable red warning banner citing the exact confession and forensic debunk evidence.

3. **Knowledge Graph & Vector Semantic Search (The Connector)**:
   - Vector embeddings (ChromaDB) for semantic cross-stream discovery.
   - Example: Searching *"triangular craft"* surfaces both the 1990 Belgian F-16 radar lock and the Rendlesham Forest USAF memorandum simultaneously.
   - Entity extraction: automatically isolates witnesses, dates, locations, craft types, and agencies.

4. **Modern Dark-Themed Interface (The Dashboard)**:
   - Cyber-Noir Obsidian dark mode with neon accents (Cyan for Military, Purple for Metaphysical, Emerald for Folklore, Crimson for Debunked).
   - **Feed View**: Chronological stream of all intelligence with real-time tag filtering.
   - **4-Stream Library View**: Kanban-style side-by-side columns segregating sources by truth stream.
   - **Source Detail Modal**: Comprehensive dossier view with extracted entities, full text, and debunk banners.

---

## 📂 Project Architecture

```
cosmic-archive/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app & lifespan loader
│   │   ├── config.py            # Pydantic environment configuration
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic schemas (Document, Streams, Entities)
│   │   ├── services/
│   │   │   ├── ingestion.py     # URL scraper, transcript & text parser
│   │   │   ├── verifier.py      # LLM & Heuristic Truth-Filter & Hoax detector
│   │   │   ├── vector_store.py  # ChromaDB semantic embedding search
│   │   │   └── seed_data.py     # Canonical seed intelligence across all 4 streams
│   │   └── routes/
│   │       └── documents.py     # API Endpoints (ingest, feed, library, search)
│   ├── tests/
│   │   └── test_api.py          # Pytest suite
│   ├── requirements.txt
│   ├── Dockerfile
│   └── run.py
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Main dashboard container
│   │   └── globals.css          # Futuristic dark mode styling
│   ├── components/
│   │   ├── Header.tsx           # Telemetry counters & view switcher
│   │   ├── FeedView.tsx         # Chronological dossier feed
│   │   ├── LibraryView.tsx      # 4-Stream categorized swimlanes
│   │   ├── SemanticSearch.tsx   # Vector search with cosine matching
│   │   ├── SourceDetailModal.tsx# Detail view with forensic hoax warnings
│   │   └── IngestionModal.tsx   # Multi-modal submission form
│   ├── types/
│   │   └── index.ts
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start Guide (One-Command Runner)

### El modo más sencillo: 1 solo comando

Desde la raíz de `cosmic-archive/`:

```bash
# Opción 1: Mediante el script automatizado
./start.sh

# Opción 2: Mediante npm
npm run dev
```

Esto inicia automáticamente:
- **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000) *(tu interfaz de usuario principal)*
- **Backend (FastAPI):** [http://localhost:8001/docs](http://localhost:8001/docs) *(API y base de datos vectorial)*

Presionar `Ctrl+C` en la terminal apaga ambos servicios de forma limpia e instantánea.

---

### Opción con Docker Compose
```bash
docker compose up --build
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/documents/ingest` | Ingests URL, text, or transcript through Truth-Filter & indexes vector embeddings. |
| `GET` | `/api/v1/documents/feed` | Chronological feed of intelligence with optional `?tag=` filter. |
| `GET` | `/api/v1/documents/library` | Returns documents segregated into the 4 Truth Streams. |
| `GET` | `/api/v1/documents/{id}` | Full detail view including debunk warnings and extracted entities. |
| `POST` | `/api/v1/documents/search` | Semantic vector search across all or filtered streams. |
| `GET` | `/api/v1/documents/analytics/stats` | Real-time counts across the 4 streams and top taxonomy tags. |

from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import StreamCategory, VerificationStatus

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_seed_library_loaded():
    response = client.get("/api/v1/documents/library")
    assert response.status_code == 200
    data = response.json()
    assert StreamCategory.OFFICIAL_MILITARY.value in data
    assert StreamCategory.METAPHYSICAL_CANALIZATION.value in data
    assert StreamCategory.UNRESOLVED_FOLKLORE.value in data
    assert StreamCategory.PROVEN_HOAX.value in data
    # Ensure items exist in each stream
    assert len(data[StreamCategory.OFFICIAL_MILITARY.value]) >= 1
    assert len(data[StreamCategory.PROVEN_HOAX.value]) >= 1

def test_ingest_official_military():
    payload = {
        "title": "US Navy Radar Operator Echo Telemetry",
        "source_type": "MANUAL_TEXT",
        "raw_content": "Official declassified radar logs from Pentagon AARO investigation. Pilot testimony under oath confirmed high-speed radar track.",
        "author": "Lt. Ryan Graves",
        "publication_date": "2023-07-26",
        "custom_tags": ["#AARO", "#Telemetry"]
    }
    response = client.post("/api/v1/documents/ingest", json=payload)
    assert response.status_code == 201
    doc = response.json()
    assert doc["stream_category"] == StreamCategory.OFFICIAL_MILITARY.value
    assert doc["is_hoax"] is False

def test_ingest_and_flag_hoax():
    payload = {
        "title": "Transcripts of the San Jose de Valderas Disc Messages",
        "source_type": "MANUAL_TEXT",
        "raw_content": "Photographs of the Ummo ship with the central seal over Madrid taken in San Jose de Valderas.",
        "author": "Anonymous Ummo Contactee",
        "publication_date": "1967-06-01"
    }
    response = client.post("/api/v1/documents/ingest", json=payload)
    assert response.status_code == 201
    doc = response.json()
    assert doc["stream_category"] == StreamCategory.PROVEN_HOAX.value
    assert doc["is_hoax"] is True
    assert doc["debunk_reason"] is not None
    assert "Jordán Peña" in doc["debunk_reason"]

def test_semantic_search_cross_stream():
    query_payload = {
        "query": "triangular craft radar",
        "top_k": 5
    }
    response = client.post("/api/v1/documents/search", json=query_payload)
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    # Should include Belgian triangle or Rendlesham
    titles = [r["document"]["title"] for r in results]
    assert any("Triangular" in t or "Memorandum" in t for t in titles)

def test_stats_endpoint():
    response = client.get("/api/v1/documents/analytics/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_documents"] >= 8
    assert stats["proven_hoax_count"] >= 2
    assert stats["official_military_count"] >= 3

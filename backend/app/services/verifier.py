import json
import re
from typing import Tuple, List, Dict, Any, Optional
from app.models.schemas import (
    StreamCategory,
    VerificationStatus,
    ExtractedEntities,
    IngestRequest
)
from app.config import settings

HOAX_KEYWORDS = {
    "ummo": "Ummo letters were confessed as an elaborate psychological hoax orchestrated by José Luis Jordán Peña in 1993.",
    "alien autopsy": "The 1995 Santilli 'Alien Autopsy' footage was confirmed as a staging created with FX sculptor John Humphreys using sheep brains and raspberry jam.",
    "san jose de valderas": "The 1967 San José de Valderas photos were confessed fabrications using model saucers suspended by nylon thread by Jordán Peña.",
    "billy meier": "Multiple key photographs of 'Pleiadian beamships' and models were proven to be re-photographed trash can lids, model parts, and pictures from the Dean Martin TV show.",
    "gulf breeze": "Ed Walters Gulf Breeze photos were proven hoaxes after the discovery of the model UFO hidden in the attic of his former home.",
    "majestic 12": "Major portions of the MJ-12 Cutler-Twining memo and Eisenhower briefing documents exhibit typewriter font discrepancies and anachronistic classification markings confirmed forged by military archivist analysis.",
    "ashtar command fake": "Fabricated voice takeover hoax on Southern Television broadcast (1977) confirmed as an unauthorized pirate transmitter broadcast, not celestial radio signal."
}

METAPHYSICAL_KEYWORDS = [
    "law of one", "ra material", "channeling", "channeled", "pleiadian", "barbara marciniak",
    "cassiopaea", "seth material", "jane roberts", "density", "higher density", "fourth density",
    "telepathic contact", "spiritual evolution", "federation of light", "akashic", "arcturian",
    "starseed", "vibrational frequency", "kundalini", "cosmic consciousness", "council of nine"
]

MILITARY_KEYWORDS = [
    "aaro", "dod", "pentagon", "declassified", "flir", "radar", "fravor", "graves", "grusch",
    "nimitz", "gimbal", "go fast", "scif", "congressional hearing", "oath", "unclassified",
    "uap task force", "norad", "faa", "foia", "anomalous sensor track", "transmedium", "telemetry"
]

class TruthVerifierPipeline:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or settings.OPENAI_API_KEY
        self.has_llm = bool(self.api_key)

    def analyze(self, request: IngestRequest, cleaned_text: str) -> Dict[str, Any]:
        """
        Processes content through Truth-Filter, Entity Extraction, and Categorization.
        If an LLM API key is present, calls the LLM with structured JSON parsing.
        Otherwise, falls back to a deterministic semantic heuristics engine.
        """
        if self.has_llm and settings.GEMINI_API_KEY:
            try:
                return self._analyze_with_gemini(request, cleaned_text)
            except Exception as e:
                # Log and fallback gracefully to deterministic engine
                print(f"[TruthVerifierPipeline] LLM invocation failed, falling back to heuristic engine: {e}")

        return self._heuristic_analysis(request, cleaned_text)

    def _heuristic_analysis(self, request: IngestRequest, text: str) -> Dict[str, Any]:
        combined_text = f"{request.title} {request.author or ''} {text}".lower()
        
        # 1. Check for known hoaxes
        is_hoax = False
        debunk_reason = None
        debunk_citation = None
        
        for hoax_term, reason in HOAX_KEYWORDS.items():
            if hoax_term in combined_text:
                is_hoax = True
                debunk_reason = reason
                debunk_citation = "Investigative forensics & historical public confessions (e.g. Jordan Pena confession 1993 / CSICOP forensic reviews)."
                stream_category = StreamCategory.PROVEN_HOAX
                verification_status = VerificationStatus.DEBUNKED_FABRICATION
                confidence = 0.96
                break
                
        # 2. Check for Military / Official stream
        if not is_hoax:
            military_matches = sum(1 for kw in MILITARY_KEYWORDS if kw in combined_text)
            metaphysical_matches = sum(1 for kw in METAPHYSICAL_KEYWORDS if kw in combined_text)
            
            if military_matches >= 2 or any(term in combined_text for term in ["flir", "aaro", "fravor", "nimitz", "declassified radar"]):
                stream_category = StreamCategory.OFFICIAL_MILITARY
                verification_status = VerificationStatus.OFFICIAL_RECORD
                confidence = min(0.70 + (military_matches * 0.05), 0.98)
            elif metaphysical_matches >= 2 or any(term in combined_text for term in ["law of one", "ra material", "channeling", "pleiadian"]):
                stream_category = StreamCategory.METAPHYSICAL_CANALIZATION
                verification_status = VerificationStatus.METAPHYSICAL_TRANSMISSION
                confidence = min(0.75 + (metaphysical_matches * 0.04), 0.95)
            else:
                stream_category = StreamCategory.UNRESOLVED_FOLKLORE
                verification_status = VerificationStatus.UNCONFIRMED_FOLKLORE
                confidence = 0.65

        # 3. Entity Extraction
        entities = self._extract_entities(request, text)
        
        # 4. Generate Tags
        tags = self._generate_tags(request, stream_category, is_hoax, entities)

        # 5. Summary Generation
        summary = self._generate_summary(request, text, stream_category, is_hoax, debunk_reason)

        return {
            "stream_category": stream_category,
            "verification_status": verification_status,
            "confidence_score": round(confidence, 2),
            "summary": summary,
            "entities": entities,
            "tags": tags,
            "is_hoax": is_hoax,
            "debunk_reason": debunk_reason,
            "debunk_citation": debunk_citation,
        }

    def _extract_entities(self, request: IngestRequest, text: str) -> ExtractedEntities:
        people = []
        locations = []
        dates = []
        craft_types = []
        organizations = []

        # Known people
        known_people = ["David Fravor", "Alex Dietrich", "David Grusch", "Ryan Graves", 
                        "Barbara Marciniak", "Carla Rueckert", "Don Elkins", "Jim McCarty", 
                        "J. Allen Hynek", "Jacques Vallee", "Luis Elizondo", "Sean Kirkpatrick"]
        for p in known_people:
            if re.search(r'\b' + re.escape(p) + r'\b', text, re.IGNORECASE):
                people.append(p)
        if request.author and request.author not in people:
            people.append(request.author)

        # Locations
        known_locs = ["San Diego", "Baja California", "Rendlesham Forest", "Roswell", 
                      "Belgium", "Phoenix", "Pleiades", "Orion", "Sirius", "Skinwalker Ranch", 
                      "Albuquerque", "Washington D.C."]
        for loc in known_locs:
            if re.search(r'\b' + re.escape(loc) + r'\b', text, re.IGNORECASE):
                locations.append(loc)

        # Craft types
        known_craft = ["Tic-Tac", "Triangle", "Black Triangle", "Disk", "Saucer", "Sphere", 
                       "Transmedium vehicle", "Orb", "Cylinder", "Light Body"]
        for craft in known_craft:
            if re.search(r'\b' + re.escape(craft) + r'\b', text, re.IGNORECASE):
                craft_types.append(craft)

        # Organizations
        known_orgs = ["DoD", "Pentagon", "AARO", "US Navy", "USAF", "NORAD", 
                      "Project Blue Book", "GEIPAN", "L/L Research"]
        for org in known_orgs:
            if re.search(r'\b' + re.escape(org) + r'\b', text, re.IGNORECASE):
                organizations.append(org)

        # Extract 4-digit years (1900-2099)
        found_years = re.findall(r'\b(19\d{2}|20\d{2})\b', text)
        dates = list(dict.fromkeys(found_years))[:4]
        if request.publication_date and request.publication_date not in dates:
            dates.insert(0, request.publication_date)

        return ExtractedEntities(
            people=list(dict.fromkeys(people)),
            locations=list(dict.fromkeys(locations)),
            dates=dates,
            craft_types=list(dict.fromkeys(craft_types)),
            organizations=list(dict.fromkeys(organizations))
        )

    def _generate_tags(self, request: IngestRequest, stream: StreamCategory, is_hoax: bool, entities: ExtractedEntities) -> List[str]:
        tags = set()
        if request.custom_tags:
            for t in request.custom_tags:
                tags.add(t if t.startswith("#") else f"#{t}")

        # Stream-specific tags
        if stream == StreamCategory.OFFICIAL_MILITARY:
            tags.add("#Declassified")
            tags.add("#MilitaryTelemetry")
        elif stream == StreamCategory.METAPHYSICAL_CANALIZATION:
            tags.add("#Canalization")
            tags.add("#CosmicConsciousness")
        elif stream == StreamCategory.UNRESOLVED_FOLKLORE:
            tags.add("#HistoricalMystery")
            tags.add("#Folklore")
        elif stream == StreamCategory.PROVEN_HOAX:
            tags.add("#DebunkedHoax")
            tags.add("#ForensicRefutation")

        for c in entities.craft_types:
            tags.add(f"#{c.replace(' ', '')}")
        for d in entities.dates:
            tags.add(f"#{d}s" if d.endswith("0") else f"#{d}")

        return sorted(list(tags))[:8]

    def _generate_summary(self, request: IngestRequest, text: str, stream: StreamCategory, is_hoax: bool, debunk_reason: Optional[str]) -> str:
        clean_first_para = text.strip().split("\n")[0][:250]
        if is_hoax:
            return f"[FLAGGED HOAX]: This source presents material associated with documented fabrications. Forensic evaluation notes: {debunk_reason} Original excerpt: \"{clean_first_para}...\""
        if stream == StreamCategory.OFFICIAL_MILITARY:
            return f"[OFFICIAL RECORD ANALYSIS]: Ingested document contains military, radar, or government testimonies. Core premise: \"{clean_first_para}...\". Categorized with sensor or sworn witness data integrity."
        if stream == StreamCategory.METAPHYSICAL_CANALIZATION:
            return f"[METAPHYSICAL ARCHIVE]: Document reflects channeled communications, multidimensional philosophy, or non-physical contact modalities. Core theme: \"{clean_first_para}...\"."
        return f"[FOLKLORE DOSSIER]: Unresolved historical sighting or cultural narrative without definitive official sensor correlation or proven forgery: \"{clean_first_para}...\"."

    def _analyze_with_gemini(self, request: IngestRequest, text: str) -> Dict[str, Any]:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
You are the Truth-Filter & Verification Engine of CosmicArchive.
Analyze the following anomalous phenomena or esoteric document and output a strictly valid JSON object matching this schema:
{{
  "stream_category": "OFFICIAL_MILITARY" | "METAPHYSICAL_CANALIZATION" | "UNRESOLVED_FOLKLORE" | "PROVEN_HOAX",
  "verification_status": "OFFICIAL_RECORD" | "METAPHYSICAL_TRANSMISSION" | "UNCONFIRMED_FOLKLORE" | "DEBUNKED_FABRICATION",
  "confidence_score": 0.0 to 1.0,
  "summary": "1-3 sentence analytical summary highlighting verification status and key themes",
  "entities": {{
    "people": ["names of witnesses, officials, contactees"],
    "locations": ["geographic or celestial locations"],
    "dates": ["years or dates mentioned"],
    "craft_types": ["shapes, e.g., Tic-Tac, Triangle, Disk, Light-Orb"],
    "organizations": ["military or civilian bodies, e.g. AARO, US Navy, Blue Book"]
  }},
  "tags": ["#tag1", "#tag2"],
  "is_hoax": true | false,
  "debunk_reason": null | "explanation if hoax",
  "debunk_citation": null | "forensic citation if hoax"
}}

Classification Directives:
- OFFICIAL_MILITARY: Declassified files, radar logs, DoD/AARO reports, military pilots/officers (Fravor, Grusch).
- METAPHYSICAL_CANALIZATION: Channeled literature, telepathic transmissions, Ra Material / Law of One, Pleiadians, spiritual contact.
- UNRESOLVED_FOLKLORE: Historical sightings, regional myths, ancient astronaut lore lacking hard radar data but NOT proven frauds.
- PROVEN_HOAX: Known fabrications (Ummo, Santilli autopsy, San Jose de Valderas, Billy Meier doctored photos). If hoax, you MUST state the exact confession or forensic debunk.

Title: {request.title}
Author: {request.author or 'Unknown'}
Content:
{text[:4000]}
"""
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        data["entities"] = ExtractedEntities(**data["entities"])
        return data

truth_verifier = TruthVerifierPipeline()

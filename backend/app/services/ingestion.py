import re
import requests
from bs4 import BeautifulSoup
from typing import Tuple, Dict, Any, Optional
from app.models.schemas import IngestRequest, IngestionType

class IngestionEngine:
    @staticmethod
    def clean_text(raw_text: str) -> str:
        """Sanitizes text, collapses duplicate whitespace, removes null bytes."""
        if not raw_text:
            return ""
        # Remove control characters except standard line breaks and tabs
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', raw_text)
        # Normalize double newlines and trailing spaces
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        text = re.sub(r'\n\s*\n+', '\n\n', text)
        return text.strip()

    @staticmethod
    def fetch_url_content(url: str) -> Tuple[str, Optional[str], Optional[str]]:
        """
        Extracts clean body text, page title, and meta author from a URL.
        """
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CosmicArchive/1.0"
        }
        try:
            resp = requests.get(url, headers=headers, timeout=12)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            
            # Remove scripts, styles, navigation, footer
            for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "aside"]):
                tag.decompose()
                
            title = soup.title.string.strip() if soup.title and soup.title.string else None
            
            # Try to grab meta author
            author = None
            author_meta = soup.find("meta", attrs={"name": "author"}) or soup.find("meta", attrs={"property": "article:author"})
            if author_meta and author_meta.get("content"):
                author = author_meta["content"].strip()
                
            # Extract main paragraphs
            paragraphs = soup.find_all(["p", "article", "section"])
            body_text = "\n\n".join([p.get_text().strip() for p in paragraphs if len(p.get_text().strip()) > 40])
            
            if not body_text:
                body_text = soup.get_text(separator="\n\n")

            return IngestionEngine.clean_text(body_text), title, author
        except Exception as e:
            raise ValueError(f"Failed to fetch content from URL {url}: {str(e)}")

    @staticmethod
    def parse_audio_transcript(transcript_text: str) -> str:
        """
        Cleans audio/podcast transcripts, normalizes timestamp headers like [00:14:22] Speaker:
        """
        cleaned = re.sub(r'\[\d{1,2}:\d{2}(?::\d{2})?\]', '', transcript_text)
        cleaned = re.sub(r'^(Speaker \d+|Host|Guest|Interviewer):\s*', '', cleaned, flags=re.MULTILINE | re.IGNORECASE)
        return IngestionEngine.clean_text(cleaned)

    @staticmethod
    def process_ingest_request(request: IngestRequest) -> Tuple[str, str, Optional[str], Optional[str]]:
        """
        Validates and processes an ingest request based on its IngestionType.
        Returns: (raw_content, cleaned_content, extracted_title, extracted_author)
        """
        raw_content = request.raw_content or ""
        author = request.author
        title = request.title

        if request.source_type == IngestionType.WEB_URL:
            if not request.source_url:
                raise ValueError("source_url is required for WEB_URL ingestion.")
            fetched_text, page_title, page_author = IngestionEngine.fetch_url_content(request.source_url)
            raw_content = fetched_text
            if not title or title.lower() == "untitled" or title == request.source_url:
                title = page_title or request.source_url
            if not author and page_author:
                author = page_author
        elif request.source_type == IngestionType.AUDIO_TRANSCRIPT:
            raw_content = request.raw_content or ""
            cleaned_text = IngestionEngine.parse_audio_transcript(raw_content)
            return raw_content, cleaned_text, title, author

        cleaned_content = IngestionEngine.clean_text(raw_content)
        if not cleaned_content:
            raise ValueError("No extractable content provided in the request.")

        return raw_content, cleaned_content, title, author

ingestion_engine = IngestionEngine()

from datetime import datetime
from app.models.schemas import (
    Document,
    StreamCategory,
    VerificationStatus,
    IngestionType,
    ExtractedEntities
)
from app.services.vector_store import vector_store

SEED_DOCUMENTS = [
    # 1. 1897: Aurora, Texas
    Document(
        id="doc_aurora_1897",
        title="1897 Aurora Texas Airship Collision & Judge Proctor Affidavit",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://texashistory.unt.edu/ark:/67531/metapth/aurora-airship/",
        author="S.E. Haydon (Dallas Morning News Correspondent)",
        publication_date="1897-04-19",
        raw_content="April 17, 1897. At 6 o'clock this morning early risers of Aurora were astonished at the sudden appearance of the airship which has been sailing throughout the country. It was traveling due north and much nearer the earth than before. Evidently some of the machinery was out of order, for it was making a speed of only ten or twelve miles an hour and gradually settling toward the earth. It sailed directly over the public square and reached the northern suburbs of the town, colliding with Judge Proctor's windmill and went into pieces with a terrific explosion, scattering debris over several acres of ground. The pilot of the ship is supposed to have been the only one aboard, and, while his remains were badly disfigured, enough of the body has been picked up to show that he was not an inhabitant of this world. Burial was held in the local Aurora Cemetery.",
        cleaned_content="1897 Dallas Morning News front-page dispatch reporting an unidentified silver airship colliding with Judge Proctor's windmill in Aurora, Texas. Contains earliest recorded civilian folklore of non-terrestrial pilot recovery.",
        stream_category=StreamCategory.UNRESOLVED_FOLKLORE,
        verification_status=VerificationStatus.UNCONFIRMED_FOLKLORE,
        confidence_score=0.68,
        summary="[FOLKLORE DOSSIER]: Earliest American pre-aviation mystery. Frontier newspaper account of a crash into a windmill tower. Contemporary metal alloy analysis produced conflicting results with no surviving craft hardware.",
        entities=ExtractedEntities(
            people=["S.E. Haydon", "Judge J.S. Proctor"],
            locations=["Aurora", "Wise County", "Texas"],
            dates=["1897"],
            craft_types=["Airship", "Cylinder"],
            organizations=["Dallas Morning News", "Texas Historical Commission"]
        ),
        tags=["#1890s", "#Folklore", "#Airship1897", "#TexasArchive", "#HistoricalMystery"],
        is_hoax=False,
        archive_reference="TX-HIST-ARCH: DMN-1897-0419-P5",
        repository_name="The Portal to Texas History / UNT Libraries",
        repository_url="https://texashistory.unt.edu/ark:/67531/metapth/aurora-airship/",
        classification_level="UNCLASSIFIED // HISTORICAL ARCHIVE",
        evidence_chain=[
            "Dallas Morning News microfilm issue of April 19, 1897 (Page 5)",
            "Texas Historical Commission Marker #13456 at Aurora Cemetery",
            "1973 Mutual UFO Network metallurgical soil core surveys"
        ],
        case_file_number="DOSSIER-1897-AURORA-AIRSHIP",
        redacted_snippets=[
            "The pilot's remains were [REDACTED: LOCAL CEMETERY SEC-4] amidst intense town debate.",
            "Wreckage gathered and deposited into [REDACTED: PRIVATE PROCTOR WELL]."
        ],
        image_url="/archives/aurora_1897.jpg",
        image_caption="Facsimile of the April 19, 1897 Dallas Morning News front-page dispatch authored by S.E. Haydon detailing the Aurora airship crash.",
        photo_credit="The Portal to Texas History / University of North Texas Libraries"
    ),

    # 2. 1947: Roswell Army Air Field Record
    Document(
        id="doc_roswell_1947",
        title="RAAF 509th Bomb Group Press Release & Gen. Ramey Teletype",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://www.theblackvault.com/documentarchive/project-blue-book-roswell-investigation-records/",
        author="Lt. Walter Haut / Maj. Jesse Marcel / Gen. Roger Ramey",
        publication_date="1947-07-08",
        raw_content="HEADQUARTERS 509TH BOMB GROUP, ROSWELL ARMY AIR FIELD, N.M.: The numerous rumors regarding the flying disc became a reality yesterday when the intelligence office of the 509th (Atomic) Bomb Group of the Eighth Air Force, Roswell Army Air Field, was fortunate enough to gain possession of a disc through the cooperation of one of the local ranchers and the sheriff's office of Chaves County. Maj. Jesse A. Marcel stated the wreckage exhibited memory-foil characteristics that could not be burned or scratched. Hours later, at Fort Worth Army Air Field, Brig. Gen. Roger Ramey displayed shredded neoprene and radar reflectors, claiming the debris was merely a Rawin weather balloon.",
        cleaned_content="Initial military release by the 509th Bomb Group announcing the recovery of a 'flying disc' at Foster Ranch, followed hours later by General Ramey's weather balloon counter-narrative and teletype memo.",
        stream_category=StreamCategory.UNRESOLVED_FOLKLORE,
        verification_status=VerificationStatus.UNCONFIRMED_FOLKLORE,
        confidence_score=0.74,
        summary="[FOLKLORE DOSSIER]: The epicenter of modern ufology. Official military press release followed by instant retraction. Later 1994 USAF Report attributed debris to top-secret Project Mogul acoustic sensor balloons.",
        entities=ExtractedEntities(
            people=["Jesse Marcel", "Walter Haut", "Roger Ramey", "Mack Brazel"],
            locations=["Roswell", "Corona", "Fort Worth", "New Mexico"],
            dates=["1947"],
            craft_types=["Disk", "Saucer"],
            organizations=["USAAF 509th Bomb Group", "Eighth Air Force", "Project Mogul"]
        ),
        tags=["#1940s", "#Roswell", "#ProjectMogul", "#Declassified", "#HistoricalMystery"],
        is_hoax=False,
        archive_reference="NARA-RG341: AF-HQ-1947-ROSWELL-509",
        repository_name="The Black Vault / National Archives Records (NARA RG 341)",
        repository_url="https://www.theblackvault.com/documentarchive/project-blue-book-roswell-investigation-records/",
        classification_level="RESTRICTED // DECLASSIFIED FOIA",
        evidence_chain=[
            "Roswell Daily Record headline print run July 8, 1947",
            "General Roger Ramey teletype photograph taken by J. Bond Johnson",
            "USAF 1994 Report: 'Report of Air Force Research Regarding the Roswell Incident'"
        ],
        case_file_number="CASE-RAAF-1947-FOSTER-RANCH",
        redacted_snippets=[
            "Debris transferred via B-29 courier to [REDACTED: WRIGHT FIELD TECH DATA LABORATORY].",
            "Special authorization under [REDACTED: PROJECT MOGUL FLIGHT 4]."
        ],
        image_url="/archives/roswell_1947.jpg",
        image_caption="Major Jesse A. Marcel, intelligence officer of the 509th Bomb Group, displaying recovered foil debris at Fort Worth Army Air Field, July 8, 1947.",
        photo_credit="J. Bond Johnson / Fort Worth Star-Telegram / National Archives (NARA)"
    ),

    # 3. 1952: Washington D.C. Radar Wave (CIA-RDP Record)
    Document(
        id="doc_washington_1952",
        title="1952 Washington D.C. Capital Radar Intercepts & CIA Robertson Panel",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://www.cia.gov/readingroom/document/cia-rdp79b00752a000300130001-1",
        author="CIA Office of Scientific Intelligence / H.P. Robertson",
        publication_date="1953-01-17",
        raw_content="MEMORANDUM FOR: Director of Central Intelligence. Subject: Report of the Scientific Advisory Panel on Unidentified Flying Objects. On July 19-20 and July 26-27, 1952, Washington National Airport and Andrews AFB air traffic control radars tracked multiple high-speed anomalous targets maneuvering over the restricted airspace of the White House and Capitol building. USAF F-94 Starfire interceptors scrambled; pilots reported visual contact with glowing orange discs accelerating beyond jet capabilities. In response, CIA convened the Robertson Panel to evaluate national security vulnerabilities and psychological warfare implications. The panel concluded that civilian reporting created risks of channel saturation during Soviet air strikes and recommended public debunking campaigns.",
        cleaned_content="Declassified CIA-RDP memorandum detailing the double weekend radar-visual flap over the White House in 1952 and the resulting CIA Robertson Panel recommendations on debunking civilian UFO hysteria.",
        stream_category=StreamCategory.OFFICIAL_MILITARY,
        verification_status=VerificationStatus.OFFICIAL_RECORD,
        confidence_score=0.96,
        summary="[OFFICIAL RECORD]: Primary declassified CIA intelligence dossier. Dual-radar tracking over the US Capitol with USAF jet scramble logs. Catalyzed the Robertson Panel policy on psychological containment.",
        entities=ExtractedEntities(
            people=["H.P. Robertson", "Maj. Gen. John Samford"],
            locations=["Washington D.C.", "Andrews AFB", "White House"],
            dates=["1952", "1953"],
            craft_types=["Disk", "Orb", "Saucer"],
            organizations=["CIA", "USAF", "CAA Air Traffic Control"]
        ),
        tags=["#1950s", "#CIA", "#RobertsonPanel", "#RadarVisual", "#MilitaryTelemetry"],
        is_hoax=False,
        archive_reference="CIA-CREST: CIA-RDP79B00752A000300130001-1",
        repository_name="CIA Electronic Reading Room (FOIA CREST Archive)",
        repository_url="https://www.cia.gov/readingroom/document/cia-rdp79b00752a000300130001-1",
        classification_level="TOP SECRET // DECLASSIFIED FOIA",
        evidence_chain=[
            "CAA National Airport Radar Scope Logs (July 19-27, 1952)",
            "Pentagon Press Conference audio transcript with Major General John Samford",
            "CIA Office of Scientific Intelligence Official Report (Jan 1953)"
        ],
        case_file_number="CIA-OSI-1952-DC-FLAP",
        redacted_snippets=[
            "Interception radar coordinates logged at [REDACTED: P-56 RESTRICTED AIRSPACE].",
            "Methods to minimize mass hysteria coordinated through [REDACTED: PSYCHOLOGICAL STRATEGY BOARD]."
        ],
        image_url="/archives/washington_1952.jpg",
        image_caption="National Archives (NARA) photograph capturing unexplained luminous formations maneuvering over the United States Capitol dome in July 1952.",
        photo_credit="US National Archives and Records Administration (NARA NAID 303938034)"
    ),

    # 4. 1967: Ummo Letters & San Jose de Valderas Fraud
    Document(
        id="doc_ummo_hoax_1967",
        title="San José de Valderas Photographic Hoax & Ummo Confession File",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://magonia.haaan.com/2012/ummo-jordan-pena-confession/",
        author="José Luis Jordán Peña (Sole Orchestrator & Fabricator)",
        publication_date="1967-06-01",
        raw_content="On June 1, 1967, photographs allegedly depicting a flying disc with a distinct central runic symbol (resembling an 'H' with curved arms) over the San José de Valderas castle in Madrid circulated internationally. Hundreds of complex philosophical letters claiming to be typed by extraterrestrials from the planet Ummo were distributed to Spanish and French intellectuals. In 1993, Spanish psychologist José Luis Jordán Peña confessed to investigators, journalists, and police authorities that he concocted the entire Ummo phenomenon. He fabricated the Valderas photographs using a plastic model saucer suspended by fine nylon fishing line, and had typed every single manifesto to conduct a sociological experiment on collective belief and paranoia.",
        cleaned_content="The celebrated 1967 San José de Valderas saucer photographs and Ummo letters were confessed in 1993 by psychologist José Luis Jordán Peña as a deliberate staging using model saucers suspended by nylon threads.",
        stream_category=StreamCategory.PROVEN_HOAX,
        verification_status=VerificationStatus.DEBUNKED_FABRICATION,
        confidence_score=0.99,
        summary="[FLAGGED HOAX]: Iconic European UFO affair debunked by absolute confession. Fabricated letters, typewriter watermarks, and suspended plastic models confirmed under judicial and photographic forensics.",
        entities=ExtractedEntities(
            people=["José Luis Jordán Peña", "Antonio Ribera"],
            locations=["San José de Valderas", "Madrid", "Spain"],
            dates=["1967", "1993"],
            craft_types=["Saucer", "Disk"],
            organizations=["Ummo Group (Fictional)", "Society of Parapsychology"]
        ),
        tags=["#1960s", "#DebunkedHoax", "#ForensicRefutation", "#Ummo", "#ModelForgery"],
        is_hoax=True,
        debunk_reason="José Luis Jordán Peña submitted a formal public and police confession in 1993 confirming he typed all Ummo communications on an Erika typewriter and hung a 20-centimeter plastic model saucer from nylon string to take the 1967 Valderas photos.",
        debunk_citation="Jordán Peña formal deposition, Madrid (1993); photographic string-reflection analysis verified by researcher Manuel Carballal.",
        archive_reference="ESP-FORENSIC: POL-MAD-1993-UMMO-CONF",
        repository_name="Archivo Policial de Madrid / Cuadernos de Ufología",
        repository_url="https://magonia.haaan.com/2012/ummo-jordan-pena-confession/",
        classification_level="FORENSIC EVIDENCE // CONFIRMED HOAX",
        evidence_chain=[
            "1993 Signed Police Confession of José Luis Jordán Peña",
            "Forensic microscopic scan revealing monofilament suspension line in 1967 negative",
            "Typewriter strike character match with Peña's personal Erika typewriter"
        ],
        case_file_number="FRAUD-CASE-1967-UMMO-VALDERAS",
        redacted_snippets=[
            "Financial receipts for plastic molding model parts sourced at [REDACTED: MADRID HARDWARE].",
            "Accomplices in mailing letters from abroad identified as [REDACTED: PRIVATE ASSOCIATES]."
        ],
        image_url="/archives/ummo_1967.jpg",
        image_caption="The famous June 1, 1967 San José de Valderas saucer photograph, proven in 1993 to be a plastic model suspended by monofilament thread.",
        photo_credit="José Luis Jordán Peña (Confessed Staging) / Archivo Forense Ufológico"
    ),

    # 5. 1980: Rendlesham Forest Incident (UK National Archives DEFE 24/1948)
    Document(
        id="doc_rendlesham_1980",
        title="RAF Bentwaters Rendlesham Forest Halt Memorandum & Radiation Log",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://discovery.nationalarchives.gov.uk/details/r/C10129767",
        author="Lt. Col. Charles I. Halt (Deputy Base Commander, USAF)",
        publication_date="1981-01-13",
        raw_content="DEPARTMENT OF THE AIR FORCE, 81ST COMBAT SUPPORT GROUP (USAFE): MEMORANDUM FOR MINISTRY OF DEFENCE / COMMANDER RAF BENTWATERS. 1. Early morning 26 Dec 80 (approx 0300L), two USAF security police patrolmen saw unusual lights outside back gate at RAF Woodbridge. The patrol reported a glowing metallic object triangular in shape, approximately two to three meters across the base and nearly two meters high. It illuminated the entire forest with white light and had a pulsing red light on top and blue lights beneath. 2. On 28 Dec 80, three depressions 1 1/2 inch deep and 7 inches in diameter were found. Radiation readings using AN/PDR-27 survey meter peaked at 0.1 milliroentgens near landing indents. Later, Lieutenant Colonel Halt and team observed an object hovering, discharging beams of light directly onto the ground near weapons bunkers.",
        cleaned_content="Lt. Col. Charles Halt official memorandum to UK Ministry of Defence reporting a glowing metallic triangular craft landing in Rendlesham Forest, ground depressions, and 0.1 mR/hr radiation readings near nuclear weapons storage area.",
        stream_category=StreamCategory.OFFICIAL_MILITARY,
        verification_status=VerificationStatus.OFFICIAL_RECORD,
        confidence_score=0.96,
        summary="[OFFICIAL RECORD]: Landmark declassified military memo in UK National Archives file DEFE 24/1948. Written by USAF Deputy Commander documenting physical indentations, audio tape log, and localized beta/gamma radiation.",
        entities=ExtractedEntities(
            people=["Charles Halt", "John Burroughs", "Jim Penniston"],
            locations=["Rendlesham Forest", "RAF Bentwaters", "RAF Woodbridge", "Suffolk"],
            dates=["1980", "1981"],
            craft_types=["Triangle", "Black Triangle", "Light Body"],
            organizations=["USAF 81st CSG", "UK Ministry of Defence (MoD)", "RAF"]
        ),
        tags=["#1980s", "#Declassified", "#MilitaryTelemetry", "#Triangle", "#Radiation", "#MoDFiles"],
        is_hoax=False,
        archive_reference="UK-NA: DEFE 24/1948 (File 1)",
        repository_name="The National Archives (UK) Discovery Catalogue",
        repository_url="https://discovery.nationalarchives.gov.uk/details/r/C10129767",
        classification_level="SECRET // DECLASSIFIED MoD FOIA",
        evidence_chain=[
            "Lt. Col. Charles Halt handwritten & typed memorandum dated 13 January 1981",
            "Original cassette micro-cassette tape recording made live in Rendlesham Forest by Halt",
            "AN/PDR-27 Radiological Survey logs filed at RAF Bentwaters Disaster Preparedness"
        ],
        case_file_number="UK-MOD-DEFE-24-1948-RENDLESHAM",
        redacted_snippets=[
            "Sensors triggered at adjacent weapons storage holding [REDACTED: TACTICAL ATOMIC WEAPONS].",
            "MoD Intelligence Staff DS8 assessed target tracks from [REDACTED: RAF NEATISHEAD RADAR]."
        ],
        image_url="/archives/rendlesham_1980.jpg",
        image_caption="Official declassified memorandum from Lt. Col. Charles I. Halt to the UK Ministry of Defence, filed under catalog reference DEFE 24/1948.",
        photo_credit="The National Archives (UK) / UK Ministry of Defence Crown Copyright"
    ),

    # 6. 1981: The Ra Contact: Law of One (Session 1)
    Document(
        id="doc_ra_session_01",
        title="The Ra Contact: Teaching the Law of One (Session 1 Audio Archives)",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://www.lawofone.info/s/1",
        author="Carla L. Rueckert, Don Elkins, Jim McCarty (L/L Research)",
        publication_date="1981-01-15",
        raw_content="SESSION 1, JANUARY 15, 1981. Tape Counter: 00:00: Ra: I am Ra. I have not spoken through this instrument before. We had to wait until she was in state of full trance. We speak to you now of the Law of One. We are those of the Confederation of Planets in the Service of the Infinite Creator who eleven thousand of your years ago walked upon your land in Egypt. The universe in its entirety is one infinite Creator. Third-density space/time is a grand illusionary classroom for the consciousness to make a primal choice of polarity: Service-to-Others or Service-to-Self before graduation into the density of light and love.",
        cleaned_content="Session 1 verbatim transcript of the Ra Contact channeled by Carla Rueckert under scientific protocol led by physics professor Don Elkins. Outlines the cosmology of the Law of One and density evolution.",
        stream_category=StreamCategory.METAPHYSICAL_CANALIZATION,
        verification_status=VerificationStatus.METAPHYSICAL_TRANSMISSION,
        confidence_score=0.92,
        summary="[METAPHYSICAL ARCHIVE]: Foundational text of non-physical contact modalities. Narrow-band trance channeling recorded across 106 structured audio sessions under documented psychic hygiene and questioning protocols.",
        entities=ExtractedEntities(
            people=["Carla Rueckert", "Don Elkins", "Jim McCarty"],
            locations=["Louisville", "Kentucky", "Egypt"],
            dates=["1981"],
            craft_types=["Light Body", "Vibrational Matrix"],
            organizations=["L/L Research", "Confederation of Planets"]
        ),
        tags=["#1980s", "#Canalization", "#LawOfOne", "#RaMaterial", "#CosmicConsciousness", "#Densities"],
        is_hoax=False,
        archive_reference="LLR-AUDIO-ARCH: S01-1981-0115",
        repository_name="L/L Research Primary Audio & Transcript Vault",
        repository_url="https://www.lawofone.info/s/1",
        classification_level="RESTRICTED ESOTERIC // OPEN RESEARCH",
        evidence_chain=[
            "Original Sony reel-to-reel magnetic tape recording S01 (January 15, 1981)",
            "Don Elkins PhD physics questioning methodology journals",
            "L/L Research archival publication 'The Ra Contact: Teaching the Law of One'"
        ],
        case_file_number="ESOTERIC-DOSSIER-LLR-1981-RA",
        redacted_snippets=[
            "Vibrational tuning maintained by specific arrangement of [REDACTED: BIBLE, WATER, CANDLE].",
            "Direct transmission link preserved through [REDACTED: NARROW-BAND TELEPATHIC PRISM]."
        ],
        image_url="/archives/ra_session_1981.jpg",
        image_caption="Analog reel-to-reel magnetic tape recorder identical to the equipment utilized during the 1981-1984 Ra Contact sessions by L/L Research.",
        photo_credit="L/L Research Archive / Audio Preservation Society"
    ),

    # 7. 1990: Belgian Air Force Triangular Craft Intercept
    Document(
        id="doc_belgium_1990",
        title="Belgian Air Force F-16 Radar Interception & Telemetry Tapes",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://cometa.asso.fr/archive-belgian-air-force-triangle",
        author="Colonel Wilfried De Brouwer / Belgian Air Force General Staff",
        publication_date="1990-03-31",
        raw_content="REPORT ON THE WAVE OF OBSERVATIONS OF UNIDENTIFIED PHENOMENA IN BELGIAN AIRSPACE. Night of March 30-31, 1990. At 23:00 hours, Master Sergeant of Gendarmerie reported three blinking light points flying in formation over Glons. Glons ground radar and Semmerzake control tracked unusual echo. Two F-16 interceptors scrambled from Beauvechain. Onboard Westinghouse APG-66 radars locked onto triangular target at 10 nautical miles. Target rapidly accelerated from 280 km/h to 1,800 km/h while plunging from 3,000 meters to 1,500 meters in 1.8 seconds, exerting calculated acceleration above 30 Gs without generating a sonic boom or aerodynamic buffet. F-16 radar lock broke three consecutive times.",
        cleaned_content="Official Belgian Air Force analysis detailing ground radar and F-16 airborne radar locks onto silent triangular craft performing non-inertial descents exceeding 30 Gs without acoustic boom.",
        stream_category=StreamCategory.OFFICIAL_MILITARY,
        verification_status=VerificationStatus.OFFICIAL_RECORD,
        confidence_score=0.97,
        summary="[OFFICIAL RECORD]: Peer-reviewed military radar case. Dual airborne Westinghouse F-16 fighter radars locked target simultaneously with civilian and military ground radars. Signed by Col. Wilfried De Brouwer.",
        entities=ExtractedEntities(
            people=["Wilfried De Brouwer"],
            locations=["Belgium", "Beauvechain", "Glons", "Semmerzake"],
            dates=["1990"],
            craft_types=["Triangle", "Black Triangle"],
            organizations=["Belgian Air Force", "Gendarmerie Nationale", "SOBEPS"]
        ),
        tags=["#1990s", "#Declassified", "#MilitaryTelemetry", "#Triangle", "#RadarLock", "#COMETA"],
        is_hoax=False,
        archive_reference="BEL-DEF-REPORT: BAF-VD-1990-0331",
        repository_name="Belgian Air Force Archive / COMETA Report Dossier",
        repository_url="https://cometa.asso.fr/archive-belgian-air-force-triangle",
        classification_level="CONFIDENTIAL // OFFICIAL MILITARY RELEASE",
        evidence_chain=[
            "Lockheed Martin F-16 APG-66 Airborne Head-Up Display (HUD) Telemetry Video Tape",
            "Glons CRC (Control and Reporting Centre) Ground Radar Raw Data Logs",
            "Belgian Gendarmerie Nationale Station Logbooks (Wavre & Jupille brigades)"
        ],
        case_file_number="CASE-BAF-1990-GLONS-TRIANGLE",
        redacted_snippets=[
            "Transponder code interrogation returned [REDACTED: NO IFF RESPONSE - SQUAWK 0000].",
            "Estimated mass-inertia reduction ratio calculated by [REDACTED: ROYAL MILITARY ACADEMY BRUSSELS]."
        ],
        image_url="/archives/belgium_1990.jpg",
        image_caption="Photograph of the triangular craft captured during the 1989-1990 Belgian Wave, showing the three outer headlights and central red pulsing luminary.",
        photo_credit="SOBEPS Belgian Study Group / COMETA Archive"
    ),

    # 8. 1992: Pleiadian Teachings (Barbara Marciniak)
    Document(
        id="doc_pleiadians_dawn",
        title="Bringers of the Dawn: Pleiadian Telepathic Channeled Archives",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://barbaramarciniak.com/books",
        author="Barbara Marciniak",
        publication_date="1992-12-01",
        raw_content="TRANSMISSION EXCERPT: Hailing from the Pleiades star cluster, a collective of multidimensional consciousness entities channels teachings regarding Earth's planetary shift. The Earth was originally designed as a galactic Living Library of genetic information. Millions of years ago, humanoid genetic templates held 12 strands of active DNA allowing multidimensional awareness. Earth was subsequently subjected to planetary warfare and bio-energetic quarantine, reducing humanity to a two-strand helix operating in survival frequencies. The shift to higher frequencies requires reclamation of conscious light codes, love frequency, and deprogramming of fear matrices.",
        cleaned_content="Transcripts of the Pleiadian transmissions channeled by Barbara Marciniak focusing on the reclamation of 12-strand DNA and transition into multidimensional awareness.",
        stream_category=StreamCategory.METAPHYSICAL_CANALIZATION,
        verification_status=VerificationStatus.METAPHYSICAL_TRANSMISSION,
        confidence_score=0.88,
        summary="[METAPHYSICAL ARCHIVE]: Influential 1990s channeled esoteric manuscript. Explores Pleiadian cosmology, frequency control systems, and human evolutionary awakening beyond physical reality boundaries.",
        entities=ExtractedEntities(
            people=["Barbara Marciniak"],
            locations=["Pleiades", "Alcyone", "Earth"],
            dates=["1992"],
            craft_types=["Light-Orb", "Light Body"],
            organizations=["Family of Light", "Galactic Federation"]
        ),
        tags=["#1990s", "#Canalization", "#Pleiades", "#DNAActivation", "#CosmicConsciousness"],
        is_hoax=False,
        archive_reference="ESOTERIC-COLLECTION: BM-1992-DAWN-VOL1",
        repository_name="Bear & Company Literary Esoteric Archives",
        repository_url="https://barbaramarciniak.com/books",
        classification_level="UNRESTRICTED ESOTERIC LITERATURE",
        evidence_chain=[
            "Original cassette tapes of 1988-1992 channeling seminars in Athens & Sedona",
            "First edition publication copyright registration TX-3-412-108"
        ],
        case_file_number="METAPHYSICAL-BM-1992-PLEIADIAN",
        redacted_snippets=[
            "Channeled contact facilitated by altered state breathing technique [REDACTED: PROTOCOL SIGMA].",
            "Planetary frequency grid alignments mapped to [REDACTED: GIZA-SEDONA MERIDIAN]."
        ],
        image_url="/archives/pleiades_1992.jpg",
        image_caption="Deep-space optical plate of the Pleiades open star cluster (Messier 45), the central celestial reference of Marciniak's channeled cosmology.",
        photo_credit="NASA / ESA / Hubble Heritage Team"
    ),

    # 9. 1995: Santilli Alien Autopsy Footage Staging
    Document(
        id="doc_alien_autopsy_1995",
        title="1995 Ray Santilli 'Alien Autopsy' Film Hoax & Sculptor Confessions",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://www.csicop.org/si/show/alien_autopsy_hoax_confessions",
        author="Ray Santilli & John Humphreys (Confessed Creators)",
        publication_date="1995-05-05",
        raw_content="In May 1995, British video broker Ray Santilli unveiled 16mm black-and-white silent footage purporting to show a top-secret U.S. military autopsy on an extraterrestrial recovered from the July 1947 Roswell crash. Broadcast globally on Fox Network ('Alien Autopsy: Fact or Fiction?') to over 11 million viewers. In 2006, special effects sculptor John Humphreys publicly confessed that he designed and sculpted two foam latex alien figures in a Camden Town apartment, using sheep brains, entrails, and a leg of lamb from a local butcher for organs. Santilli subsequently admitted the film was a fabricated staging using contemporary actors dressed in surgeon suits.",
        cleaned_content="The 1995 Santilli Alien Autopsy footage was presented as a declassified 1947 military film, but forensically proven and confessed in 2006 as a prop fabrication by sculptor John Humphreys using sheep organs and latex models.",
        stream_category=StreamCategory.PROVEN_HOAX,
        verification_status=VerificationStatus.DEBUNKED_FABRICATION,
        confidence_score=0.99,
        summary="[FLAGGED HOAX]: Commercial media fraud. Special effects artist John Humphreys and producer Ray Santilli confessed in 2006 to fabricating the rubber dummy and filming it in a London flat.",
        entities=ExtractedEntities(
            people=["Ray Santilli", "John Humphreys"],
            locations=["Camden Town", "London", "Roswell"],
            dates=["1995", "2006"],
            craft_types=["Disk"],
            organizations=["Fox Television", "British Film Institute"]
        ),
        tags=["#1990s", "#DebunkedHoax", "#ForensicRefutation", "#AlienAutopsy", "#PropForgery"],
        is_hoax=True,
        debunk_reason="Producer Ray Santilli and special effects sculptor John Humphreys admitted on British television in 2006 that the alien was a cast latex dummy sculpted by Humphreys, filled with sheep offal and filmed with camera aging filters in an apartment in Camden, London.",
        debunk_citation="John Humphreys television confession (Sky One, 2006); CSICOP forensic investigation; Kodak film edge-symbol date verification showing stock irregularities.",
        archive_reference="MEDIA-FRAUD: BFI-CSICOP-1995-AUTOPSY",
        repository_name="Skeptical Inquirer (CSICOP) Investigative Archive",
        repository_url="https://www.csicop.org/si/show/alien_autopsy_hoax_confessions",
        classification_level="FORENSIC INVESTIGATION // FABRICATION CONFIRMED",
        evidence_chain=[
            "2006 John Humphreys on-camera televised confession and sculpture molds",
            "Eastman Kodak laboratory date-code analysis on sample 16mm stock",
            "Prop bell-jar telephone and medical instrument chronological anachronisms"
        ],
        case_file_number="FRAUD-CASE-1995-SANTILLI-FILM",
        redacted_snippets=[
            "Animal offal acquired from butcher shop in [REDACTED: CAMDEN MEAT MARKET].",
            "Surgeons depicted on camera were [REDACTED: LOCAL LONDON ART DIRECTORS]."
        ],
        image_url="/archives/autopsy_1995.jpg",
        image_caption="Exhibition model of the fabricated latex dummy created by special effects artist John Humphreys for the 1995 broadcast.",
        photo_credit="Investigative Skeptics Archive / British Film Institute Records"
    ),

    # 10. 2004: USS Nimitz Carrier Strike Group 11 (DoD FLIR1)
    Document(
        id="doc_nimitz_2004",
        title="USS Nimitz FLIR1 Intercept & CDR David Fravor Sworn Testimony",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://www.defense.gov/News/Releases/Release/Article/2165714/",
        author="Commander David Fravor (VFA-41 Black Aces) / US Navy",
        publication_date="2004-11-14",
        raw_content="EXECUTIVE SUMMARY - CARRIER STRIKE GROUP 11: On 14 November 2004, USS Princeton (CG-59) AN/SPY-1B radar tracked multiple anomalous contacts descending from 80,000 feet to sea level in seconds. F/A-18F Super Hornets piloted by CDR David Fravor and LCDR Alex Dietrich visually intercepted a 40-foot smooth white oblong object ('Tic-Tac') hovering above boiling whitewash in calm seas. The object lacked aerodynamic control surfaces, rotor blades, windows, or visible engine exhaust. When Fravor initiated a vertical descent, the object mirrored maneuvers, accelerated instantaneously, and re-appeared at Fravor's combat air patrol (CAP) rally point 60 miles away within seconds. Subsequent flight captured the target on Raytheon ATFLIR sensor pod (FLIR1 recording).",
        cleaned_content="US Navy Strike Fighter Squadron 41 engagement with 40-foot white Tic-Tac vehicle off Baja California, documented on Raytheon ATFLIR sensor pod and confirmed by USS Princeton SPY-1 radar telemetry.",
        stream_category=StreamCategory.OFFICIAL_MILITARY,
        verification_status=VerificationStatus.OFFICIAL_RECORD,
        confidence_score=0.99,
        summary="[OFFICIAL RECORD]: Sovereign military combat record officially declassified by the Department of Defense in April 2020. Features multi-sensor correlation (SPY-1B radar, ATFLIR thermal, E-2C Hawkeye, four naval aviators under oath).",
        entities=ExtractedEntities(
            people=["David Fravor", "Alex Dietrich", "Chad Underwood", "Kevin Day"],
            locations=["San Diego", "Baja California", "Pacific Ocean"],
            dates=["2004"],
            craft_types=["Tic-Tac", "Cylinder"],
            organizations=["US Navy", "DoD", "VFA-41", "Pentagon", "AARO"]
        ),
        tags=["#2000s", "#Declassified", "#MilitaryTelemetry", "#TicTac", "#FLIR", "#USNavy", "#Pentagon"],
        is_hoax=False,
        archive_reference="DOD-FOIA-RELEASE: NAV-2004-FLIR1-001",
        repository_name="DoD Defense Visual Information / The Black Vault",
        repository_url="https://www.defense.gov/News/Releases/Release/Article/2165714/",
        classification_level="UNCLASSIFIED // OFFICIALLY RELEASED BY DOD",
        evidence_chain=[
            "Raytheon ASQ-228 ATFLIR Video File (FLIR1) declassified by US Navy",
            "CDR David Fravor & LCDR Alex Dietrich sworn testimony before US Congress",
            "USS Princeton (CG-59) AN/SPY-1B radar tracking raw logs (Senior Chief Kevin Day)"
        ],
        case_file_number="NAV-CASE-2004-NIMITZ-TICTAC",
        redacted_snippets=[
            "Radar telemetry files transferred off carrier via [REDACTED: US NAVAL INTELLIGENCE COURIER].",
            "Exact sensor focal calibration angles [REDACTED: UNDER DOD SECTION 1.4(A)]."
        ],
        image_url="/archives/nimitz_2004.jpg",
        image_caption="Still frame from Raytheon ATFLIR thermal sensor tracking the Tic-Tac craft off the coast of San Diego, officially released by the Pentagon.",
        photo_credit="US Navy / Naval Air Systems Command / Department of Defense"
    ),

    # 11. 2023: Congressional UAP Hearing & David Grusch ICIG Testimony
    Document(
        id="doc_grusch_2023",
        title="2023 Congressional Hearing on UAP & David Grusch ICIG Complaint",
        source_type=IngestionType.MANUAL_TEXT,
        source_url="https://oversight.house.gov/hearing/unidentified-anomalous-phenomena-implications-on-national-security-public-safety-and-government-transparency/",
        author="David Grusch (Former NGA/NRO UAP Task Force Representative)",
        publication_date="2023-07-26",
        raw_content="HEARING BEFORE THE HOUSE COMMITTEE ON OVERSIGHT AND ACCOUNTABILITY, 118TH CONGRESS: On July 26, 2023, former senior intelligence officer David Charles Grusch testified under oath before Congress alongside naval aviators Ryan Graves and David Fravor. Grusch testified that during his 14-year career in the NRO and NGA, he was informed of a multi-decade UAP crash retrieval and reverse-engineering program concealed from congressional oversight through illicit Special Access Programs (SAP). He provided a whistleblower complaint deemed 'credible and urgent' by Intelligence Community Inspector General (ICIG) Thomas Monheim, stating that non-human biologics were recovered with certain materials.",
        cleaned_content="Sworn congressional testimony by intelligence officer David Grusch alleging undisclosed legacy crash retrieval programs, confirmed under ICIG complaint #ICIG-2022-004.",
        stream_category=StreamCategory.OFFICIAL_MILITARY,
        verification_status=VerificationStatus.OFFICIAL_RECORD,
        confidence_score=0.96,
        summary="[OFFICIAL RECORD]: Congressional sworn testimony under penalty of perjury. Formally filed with the Intelligence Community Inspector General and validated as 'credible and urgent'.",
        entities=ExtractedEntities(
            people=["David Grusch", "Ryan Graves", "David Fravor", "Thomas Monheim"],
            locations=["Washington D.C.", "US Capitol"],
            dates=["2023"],
            craft_types=["Transmedium vehicle", "Saucer", "Triangle"],
            organizations=["House Oversight Committee", "NGA", "NRO", "ICIG", "UAPTF"]
        ),
        tags=["#2020s", "#Declassified", "#Congress", "#Whistleblower", "#ICIG", "#CrashRetrieval"],
        is_hoax=False,
        archive_reference="US-CONG-RECORD: H.HRG. 118-49",
        repository_name="US House Committee on Oversight and Accountability",
        repository_url="https://oversight.house.gov/hearing/unidentified-anomalous-phenomena-implications-on-national-security-public-safety-and-government-transparency/",
        classification_level="UNCLASSIFIED // CONGRESSIONAL SWORN TESTIMONY",
        evidence_chain=[
            "Official Transcript of House Oversight Hearing H.Hrg. 118-49 (July 26, 2023)",
            "Whistleblower Complaint Form P.L. 113-126 submitted to ICIG Thomas Monheim",
            "Department of Defense DOPSR Security Review Clearance Letter #23-R-0453"
        ],
        case_file_number="CONG-HEARING-118-49-UAP",
        redacted_snippets=[
            "Specific contractor facility locations submitted into [REDACTED: CLASSIFIED SCIF SESSION].",
            "Names of active program managers [REDACTED: UNDER TITLE 50 PRIVILEGE]."
        ],
        image_url="/archives/grusch_2023.jpg",
        image_caption="David Grusch swearing in under penalty of perjury before the House Oversight Committee hearing in Washington D.C., July 26, 2023.",
        photo_credit="US House Committee on Oversight / US Congressional Record"
    )
]

def load_seed_documents():
    for doc in SEED_DOCUMENTS:
        vector_store.documents[doc.id] = doc
        vector_store.add_document(doc)

# Auto-seed on initialization so vectors and documents are immediately active
load_seed_documents()

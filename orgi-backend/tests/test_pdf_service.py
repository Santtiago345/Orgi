import pytest
import tempfile
from pathlib import Path
from decimal import Decimal
from datetime import datetime

BANK_PATTERNS = [
    (__import__("re").compile(r'bancolombia', __import__("re").I), "BANCOLOMBIA"),
    (__import__("re").compile(r'davivienda', __import__("re").I), "DAVIVIENDA"),
    (__import__("re").compile(r'banco de bogotá|bogota', __import__("re").I), "BOGOTA"),
    (__import__("re").compile(r'bbva', __import__("re").I), "BBVA"),
    (__import__("re").compile(r'nequi', __import__("re").I), "NEQUI"),
    (__import__("re").compile(r'scotiabank|colpatria', __import__("re").I), "SCOTIABANK"),
]

def _create_pdf(text: str) -> bytes:
    content = f"BT /F1 12 Tf 100 700 Td ({text}) Tj ET"
    encoded = content.encode("latin-1")
    objects = [
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj",
        f"4 0 obj\n<< /Length {len(encoded)} >>\nstream\n{content}\nendstream\nendobj".encode("latin-1"),
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    ]
    header = b"%PDF-1.4\n"
    result = bytearray(header)
    offsets = []
    for obj in objects:
        offsets.append(len(result))
        result.extend(obj)
        result.extend(b"\n")
    xref_offset = len(result)
    result.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode())
    for off in offsets:
        result.extend(f"{off:010d} 00000 n \n".encode())
    result.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF".encode())
    return bytes(result)

@pytest.fixture
def tmp_pdf():
    files = []

    def _make(text: str) -> str:
        pdf_bytes = _create_pdf(text)
        tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
        tmp.write(pdf_bytes)
        tmp.close()
        files.append(tmp.name)
        return tmp.name

    yield _make
    for f in files:
        Path(f).unlink(missing_ok=True)

def test_detect_bank_bancolombia(db_session, tmp_pdf, test_user):
    from app.services.pdf_service import PDFProcessor
    filepath = tmp_pdf("Estado de Cuenta Bancolombia")
    proc = PDFProcessor(filepath, test_user.id, db_session)
    assert proc.detect_bank() == "BANCOLOMBIA"

def test_detect_bank_davivienda(db_session, tmp_pdf, test_user):
    from app.services.pdf_service import PDFProcessor
    filepath = tmp_pdf("Extracto Davivienda")
    proc = PDFProcessor(filepath, test_user.id, db_session)
    assert proc.detect_bank() == "DAVIVIENDA"

def test_detect_bank_bbva(db_session, tmp_pdf, test_user):
    from app.services.pdf_service import PDFProcessor
    filepath = tmp_pdf("BBVA Colombia Reporte")
    proc = PDFProcessor(filepath, test_user.id, db_session)
    assert proc.detect_bank() == "BBVA"

def test_detect_bank_nequi(db_session, tmp_pdf, test_user):
    from app.services.pdf_service import PDFProcessor
    filepath = tmp_pdf("Movimientos Nequi")
    proc = PDFProcessor(filepath, test_user.id, db_session)
    assert proc.detect_bank() == "NEQUI"

def test_detect_bank_scotiabank(db_session, tmp_pdf, test_user):
    from app.services.pdf_service import PDFProcessor
    filepath = tmp_pdf("Scotiabank Colpatria")
    proc = PDFProcessor(filepath, test_user.id, db_session)
    assert proc.detect_bank() == "SCOTIABANK"

def test_detect_bank_bogota(db_session, tmp_pdf, test_user):
    from app.services.pdf_service import PDFProcessor
    filepath = tmp_pdf("Banco de Bogota extracto")
    proc = PDFProcessor(filepath, test_user.id, db_session)
    assert proc.detect_bank() == "BOGOTA"

def test_detect_bank_generico(db_session, tmp_pdf, test_user):
    from app.services.pdf_service import PDFProcessor
    filepath = tmp_pdf("Unknown Bank Statement")
    proc = PDFProcessor(filepath, test_user.id, db_session)
    assert proc.detect_bank() == "GENERICO"

def test_bank_patterns_direct():
    for pattern, expected in BANK_PATTERNS:
        assert pattern.search(f"some text {expected.lower()} more text"), f"Pattern for {expected} should match its own name"
    assert BANK_PATTERNS[0][0].search("BANCOLOMBIA"), "Case insensitive match"
    assert BANK_PATTERNS[2][0].search("bogota"), "Alternate spelling"

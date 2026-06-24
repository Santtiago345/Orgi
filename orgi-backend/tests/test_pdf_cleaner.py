from decimal import Decimal
from datetime import datetime
from app.utils.pdf_cleaner import clean_amount_cop, clean_date, suggest_category, is_duplicate

class MockTransaction:
    def __init__(self, fecha, cantidad, descripcion, referencia=None):
        self.fecha = fecha
        self.cantidad = cantidad
        self.descripcion = descripcion
        self.referencia = referencia

def test_clean_amount_cop_with_dots():
    assert clean_amount_cop("1.234.567,89") == Decimal("1234567.89")

def test_clean_amount_cop_without_cents():
    assert clean_amount_cop("500.000") == Decimal("500000")

def test_clean_amount_cop_with_symbol():
    assert clean_amount_cop("$1.000,00") == Decimal("1000.00")

def test_clean_amount_cop_empty():
    assert clean_amount_cop("") == Decimal("0.00")

def test_clean_date_ddmmyyyy():
    result = clean_date("24/06/2026")
    assert result == datetime(2026, 6, 24)

def test_clean_date_with_month_name():
    result = clean_date("24-Jun-2026")
    assert result == datetime(2026, 6, 24)

def test_clean_date_iso():
    result = clean_date("2026-06-24")
    assert result == datetime(2026, 6, 24)

def test_clean_date_invalid():
    assert clean_date("not-a-date") is None

def test_suggest_category_supermercado():
    cat, conf = suggest_category("SUPERMERCADO ÉXITO")
    assert cat == "Alimentación"
    assert conf >= 0.8

def test_suggest_category_uber():
    cat, conf = suggest_category("UBER TRIP")
    assert cat == "Transporte"

def test_suggest_category_unknown():
    cat, conf = suggest_category("XYZ UNKNOWN PURCHASE")
    assert cat == "Otros gastos"
    assert conf < 0.5

def test_is_duplicate_same_amount_same_date():
    existing = [MockTransaction(datetime(2026, 6, 24), Decimal("45000"), "Compra test", "REF001")]
    assert is_duplicate(datetime(2026, 6, 24), Decimal("45000"), "REF001", "Compra test", existing) is True

def test_is_duplicate_different_amount():
    existing = [MockTransaction(datetime(2026, 6, 24), Decimal("45000"), "Compra test", "REF001")]
    assert is_duplicate(datetime(2026, 6, 24), Decimal("50000"), "REF002", "Otra compra", existing) is False

import re
from decimal import Decimal, InvalidOperation
from datetime import datetime
from typing import Optional, Tuple

MONTH_NAMES = {
    "ene": 1, "feb": 2, "mar": 3, "abr": 4, "may": 5, "jun": 6,
    "jul": 7, "ago": 8, "sep": 9, "oct": 10, "nov": 11, "dic": 12,
}

CATEGORY_KEYWORDS = {
    "Alimentación": ["supermercado", "éxito", "jumbo", "carulla", "olimpica", "ara", "d1", "tienda", "mercado", "restaurante", "comida", "panadería"],
    "Transporte": ["transmilenio", "uber", "didi", "cabify", "gasolina", "parqueadero", "taxi", "bus", "metro", "soat", "peaje"],
    "Vivienda": ["arriendo", "arrendamiento", "administración", "condominio"],
    "Salud": ["farmacia", "droguería", "clínica", "médico", "eps", "medicina", "hospital", "salud", "optic"],
    "Entretenimiento": ["netflix", "spotify", "cinema", "cine", "prime video", "disney", "hbo", "youtube", "juego", "concierto"],
    "Servicios públicos": ["servicios", "epm", "codensa", "acueducto", "gas", "energía", "agua", "alcantarillado", "aseo"],
    "Comunicaciones": ["claro", "movistar", "tigo", "wom", "internet", "telefonía", "datos", "recarga"],
    "Educación": ["colegio", "universidad", "curso", "matrícula", "cursos", "educación", "libro"],
    "Ropa": ["zara", "falabella", "éxito ropa", "calzado", "vestido", "jeans", "camisa"],
}

def clean_amount_cop(text: str) -> Decimal:
    cleaned = re.sub(r'[\$COP\s]', '', text, flags=re.IGNORECASE)
    cleaned = cleaned.strip()
    if not cleaned:
        return Decimal("0.00")
    if ',' in cleaned and '.' in cleaned:
        if cleaned.rfind(',') > cleaned.rfind('.'):
            cleaned = cleaned.replace('.', '').replace(',', '.')
        else:
            cleaned = cleaned.replace(',', '')
    elif ',' in cleaned:
        cleaned = cleaned.replace(',', '.')
    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return Decimal("0.00")

def clean_date(text: str) -> Optional[datetime]:
    patterns = [
        (r'(\d{2})/(\d{2})/(\d{4})', lambda m: datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))),
        (r'(\d{2})-(\d{2})-(\d{4})', lambda m: datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))),
        (r'(\d{4})-(\d{2})-(\d{2})', lambda m: datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)))),
        (r'(\d{2})-([A-Za-z]{3})-(\d{4})', lambda m: _parse_date_with_month_name(m)),
    ]
    for pattern, handler in patterns:
        match = re.search(pattern, text)
        if match:
            try:
                return handler(match)
            except (ValueError, IndexError):
                continue
    return None

def _parse_date_with_month_name(match) -> datetime:
    day = int(match.group(1))
    month_str = match.group(2).lower()[:3]
    year = int(match.group(3))
    month = MONTH_NAMES.get(month_str)
    if month:
        return datetime(year, month, day)
    raise ValueError(f"Unknown month: {month_str}")

def suggest_category(description: str) -> Tuple[str, float]:
    desc_lower = description.lower()
    matches = []
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in desc_lower:
                matches.append((category, 0.8))
                break
    if matches:
        best = max(matches, key=lambda x: x[1])
        return best
    return ("Otros gastos", 0.1)

def is_duplicate(new_fecha: datetime, new_cantidad: Decimal, new_referencia: Optional[str], new_descripcion: str, existing_transactions: list) -> bool:
    for tx in existing_transactions:
        if new_referencia and tx.referencia == new_referencia:
            return True
        if tx.cantidad == new_cantidad and tx.descripcion and tx.descripcion[:50] == new_descripcion[:50]:
            if tx.fecha and new_fecha:
                diff = abs((tx.fecha - new_fecha).days)
                if diff <= 1:
                    return True
    return False

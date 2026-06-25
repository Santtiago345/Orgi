import re
from typing import List
from datetime import datetime
from decimal import Decimal
import pandas as pd
from app.services.parsers.types import TransactionRaw
from app.services.parsers.base_parser import BaseParser
from app.utils.pdf_cleaner import clean_amount_cop, clean_date, suggest_category

class GenericParser(BaseParser):
    def parse(self, text: str, tables: List[pd.DataFrame]) -> List[TransactionRaw]:
        transactions = []
        seen = set()
        date_pattern = re.compile(r'\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4}|\d{2}-[A-Za-z]{3}-\d{4}')
        amount_pattern = re.compile(r'\$?\s*[\d,\.]+')

        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            date_match = date_pattern.search(line)
            if not date_match:
                continue
            fecha = clean_date(date_match.group())
            if not fecha:
                continue
            amounts = amount_pattern.findall(line)
            if not amounts:
                continue
            monto = clean_amount_cop(amounts[-1])
            if monto == 0:
                continue
            desc = line.replace(date_match.group(), "").strip()
            for amt in amounts:
                desc = desc.replace(amt, "").strip()
            desc = re.sub(r'\$', '', desc).strip()
            if not desc or desc in seen:
                continue
            seen.add(desc)
            cat, conf = suggest_category(desc)
            transactions.append(TransactionRaw(
                fecha=fecha,
                descripcion=desc,
                cantidad=abs(monto),
                tipo="gasto",
                referencia=None,
                categoria_sugerida=cat,
                confianza=min(conf, 0.3),
            ))

        return transactions

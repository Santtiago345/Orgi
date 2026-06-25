import re
from typing import List
from decimal import Decimal
import pandas as pd
from app.services.parsers.types import TransactionRaw
from app.services.parsers.base_parser import BaseParser
from app.utils.pdf_cleaner import clean_amount_cop, clean_date, suggest_category

class DaviviendaParser(BaseParser):
    def parse(self, text: str, tables: List[pd.DataFrame]) -> List[TransactionRaw]:
        transactions = []
        for table in tables:
            if table.empty:
                continue
            headers = [str(h).lower() for h in table.columns]
            if any("fecha" in h for h in headers) and any("valor" in h for h in headers):
                for _, row in table.iterrows():
                    fecha_str = str(row.iloc[0])
                    desc = str(row.iloc[1]) if len(row) > 1 else ""
                    fecha = clean_date(fecha_str)
                    if not fecha:
                        continue
                    valor_str = str(row.iloc[2]) if len(row) > 2 else ""
                    monto = clean_amount_cop(valor_str) if valor_str else Decimal("0")
                    if monto == 0:
                        continue
                    tipo = "gasto"
                    if len(row) > 3:
                        tipo_str = str(row.iloc[3]).lower()
                        if "crédito" in tipo_str or "credito" in tipo_str or "ingreso" in tipo_str:
                            tipo = "ingreso"
                    cat, conf = suggest_category(desc)
                    transactions.append(TransactionRaw(
                        fecha=fecha,
                        descripcion=desc,
                        cantidad=abs(monto),
                        tipo=tipo,
                        referencia=None,
                        categoria_sugerida=cat,
                        confianza=conf,
                    ))
        return transactions

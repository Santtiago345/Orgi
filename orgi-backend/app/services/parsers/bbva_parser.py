from typing import List
import pandas as pd
from app.services.parsers.types import TransactionRaw
from app.services.parsers.davivienda_parser import DaviviendaParser

class BbvaParser(DaviviendaParser):
    def parse(self, text: str, tables: List[pd.DataFrame]) -> List[TransactionRaw]:
        return super().parse(text, tables)

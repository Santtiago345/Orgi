from abc import ABC, abstractmethod
from typing import List
import pandas as pd
from app.services.parsers.types import TransactionRaw

class BaseParser(ABC):
    @abstractmethod
    def parse(self, text: str, tables: List[pd.DataFrame]) -> List[TransactionRaw]:
        pass

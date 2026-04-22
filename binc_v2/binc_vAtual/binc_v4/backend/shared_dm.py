"""
Singleton compartilhado do DataManager.
Todos os routers devem importar get_dm() daqui para garantir
que usem a mesma instância e sempre leiam os dados mais recentes do disco.
"""
import os
import sys

# Garante que o diretorio do backend esta no path
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from data_manager import DataManager

_instance: DataManager = None

def get_dm() -> DataManager:
    """Retorna a instância singleton do DataManager, recarregando dados do disco."""
    global _instance
    if _instance is None:
        _instance = DataManager()
    else:
        # Sempre recarrega do disco para refletir mudanças feitas por outros routers
        _instance.reload()
    return _instance

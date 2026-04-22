"""
Binc v4 - Data Manager
Porta a classe DataManager do sistema original sem dependências PyQt5.
"""

import os
import sys
import json
import uuid
from datetime import datetime
from collections import defaultdict

# ─── PATHS ────────────────────────────────────────────────────────────────────
if getattr(sys, "frozen", False):
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # se rodando dentro de backend/, sobe um nível para pasta do projeto
    parent = os.path.dirname(BASE_DIR)
    if os.path.exists(os.path.join(parent, "autopecas_data.json")):
        BASE_DIR = parent

DATA_FILE   = os.path.join(BASE_DIR, "autopecas_data.json")
TROCAS_FILE = os.path.join(BASE_DIR, "trocas.json")
CAIXA_FILE  = os.path.join(BASE_DIR, "caixa.json")
NPS_FILE    = os.path.join(BASE_DIR, "nps.json")
FALTAS_FILE = os.path.join(BASE_DIR, "faltas.json")

CATEGORIES = ["Filtros","Freios","Oleos","Motor","Eletrica","Suspensao",
               "Arrefecimento","Transmissao","Carroceria","Acessorios","Outros"]
UNITS = ["UN","JG","LT","KG","MT","CX","PC","FR","KIT","PAR"]
PAYMENTS = ["Dinheiro","Cartao de Credito","Cartao de Debito",
            "PIX","Boleto","Transferencia","Fiado / A Prazo"]

# PIN de ativação
_PIN_CODE = "8602"

# ═══════════════════════════════════════════════════════════════════════════════
_MACHINE_CONFIG_FILE = os.path.join(BASE_DIR, "machine_config.json")

def is_activated() -> bool:
    try:
        if os.path.exists(_MACHINE_CONFIG_FILE):
            with open(_MACHINE_CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f).get("activated", False)
    except Exception:
        pass
    return False

def activate_machine() -> bool:
    try:
        import platform
        with open(_MACHINE_CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "activated": True,
                "activated_at": datetime.now().isoformat(),
                "machine": platform.node(),
            }, f, ensure_ascii=False, indent=2)
        return True
    except Exception:
        return False

def verify_pin(pin: str) -> bool:
    return pin == _PIN_CODE


# ═══════════════════════════════════════════════════════════════════════════════
class DataManager:
    def __init__(self):
        self.data = {}
        self.load()

    def reload(self):
        """Recarrega os dados do disco. Chamado antes de qualquer leitura para garantir dados frescos."""
        self.load()

    def load(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
                for k, v in self._defaults().items():
                    if k not in self.data:
                        self.data[k] = v
                self._ensure_builtin_users()
            except Exception:
                self.data = self._defaults()
                self._add_samples()
        else:
            self.data = self._defaults()
            self._add_samples()
            self.save()

    def _defaults(self):
        return {
            "products": [], "customers": [], "sales": [],
            "users": [],
            "settings": {
                "accent_color": "#f97316",
                "nota_fiscal": {
                    "nome_loja": "BINC",
                    "slogan": "Sistema de Gestão e Vendas",
                    "endereco": "R. São João da Cruz, 22 - Anchieta, Rio de Janeiro - RJ",
                    "telefone": "(21) 96728-6491",
                    "cnpj": "",
                    "rodape": "Obrigado pela preferência!"
                },
                "meu_whatsapp": "5521967286491",
                "google_review_link": "https://search.google.com/local/writereview?cid=12626966634361758320"
            },
            "empresa": {
                "razao_social": "LOBÃO PNEUS LTDA",
                "nome_fantasia": "Lobão Pneus",
                "cnpj": "",
                "ie": "",
                "im": "",
                "endereco": "R. São João da Cruz, 22",
                "bairro": "Anchieta",
                "municipio": "Rio de Janeiro",
                "uf": "RJ",
                "cep": "21655-750",
                "telefone": "(21) 96728-6491",
                "email": "",
                "regime": "1",
                "cnae": "4530-7/03"
            },
            "nfce": {
                "serie": "001",
                "proxima_nf": 1,
                "ambiente": "2",
                "csc_id": "000001",
                "csc_token": "AAAA0000000000000000000000000000",
                "cuf": "33",
                "cmun": "3304557"
            }
        }

    def _ensure_builtin_users(self):
        existing = {u["username"] for u in self.data.get("users", [])}
        if "admin" not in existing:
            self.data["users"].insert(0, {
                "id": "admin-fixed", "username": "admin", "password": "admin",
                "role": "admin", "name": "Administrador", "active": True
            })
        if "funcionario" not in existing:
            self.data["users"].append({
                "id": "func-fixed", "username": "funcionario", "password": "123moto",
                "role": "operator", "name": "Funcionário", "active": True
            })

    def _add_samples(self):
        self._ensure_builtin_users()
        self.data["products"] = self._sample_products()
        self.data["customers"] = self._sample_customers()

    def save(self):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)

    def _sample_products(self):
        rows = [
            ("FLT001","Filtro de Óleo","Filtros","Bosch","UN",15,35,50,10),
            ("FLT002","Filtro de Ar","Filtros","Mann","UN",20,45,30,8),
            ("FRE001","Pastilha de Freio Dianteira","Freios","Bosch","JG",45,95,20,5),
            ("FRE002","Disco de Freio Dianteiro","Freios","Brembo","UN",80,165,15,4),
            ("OLE001","Óleo 5W30 Sintético","Oleos","Castrol","LT",28,55,100,20),
            ("OLE002","Óleo 10W40 Semissintético","Oleos","Mobil","LT",22,45,80,15),
            ("VEL001","Vela de Ignição","Motor","NGK","UN",12,25,5,10),
            ("BAT001","Bateria 60Ah","Eletrica","Moura","UN",280,450,10,3),
            ("ALT001","Correia Alternador","Motor","Dayco","UN",35,72,18,5),
            ("SUS001","Amortecedor Dianteiro","Suspensao","Monroe","UN",120,220,8,2),
        ]
        return [{
            "id": str(uuid.uuid4()), "code": r[0], "name": r[1],
            "category": r[2], "brand": r[3], "unit": r[4],
            "cost_price": float(r[5]), "sale_price": float(r[6]),
            "stock": r[7], "min_stock": r[8], "description": ""
        } for r in rows]

    def _sample_customers(self):
        return [
            {"id": str(uuid.uuid4()), "name": "João Carlos Silva",
             "cpf_cnpj": "123.456.789-00", "phone": "(21) 98765-4321",
             "email": "joao@email.com", "address": "Rua das Flores, 100",
             "veiculo": "Honda Civic 2020", "placa": "ABC-1234"},
            {"id": str(uuid.uuid4()), "name": "Maria Santos Oliveira",
             "cpf_cnpj": "987.654.321-00", "phone": "(21) 91234-5678",
             "email": "maria@email.com", "address": "Av. Brasil, 200",
             "veiculo": "Toyota Corolla", "placa": "DEF-5678"},
        ]

    # ─── PRODUCTS ─────────────────────────────────────────────────────────────
    def generate_product_code(self, name: str) -> str:
        """Gera código único baseado no nome. Ex: 'Filtro de Ar' → 'FLTA001'"""
        import re
        CONSONANTS = set('BCDFGHJKLMNPQRSTVWXYZ')
        SKIP_WORDS = {'DE', 'DA', 'DO', 'DAS', 'DOS', 'E', 'A', 'O', 'AS', 'OS',
                      'EM', 'NO', 'NA', 'NOS', 'NAS', 'POR', 'PARA', 'COM', 'DO', 'W'}

        words = [w for w in re.split(r'[\s/\-_]+', name.upper()) if re.sub(r'[^A-Z]', '', w) and w not in SKIP_WORDS]
        if not words:
            words = [re.sub(r'[^A-Z]', '', name.upper()) or 'PRD']

        prefix = ''
        for i, word in enumerate(words):
            clean_word = re.sub(r'[^A-Z]', '', word)
            if not clean_word:
                continue
            cons = [c for c in clean_word if c in CONSONANTS]
            if not cons:
                cons = list(clean_word)  # Usa vogais se não há consoantes

            if i == 0:
                # Primeira palavra: até 3 consoantes
                prefix += ''.join(cons[:3])
            else:
                # Demais palavras: 1ª consoante (ou 1ª letra)
                prefix += cons[0]

            if len(prefix) >= 4:
                break

        prefix = (prefix or 'PRD')[:4].upper()

        # Encontra o próximo número disponível
        existing = {p.get('code', '') for p in self.data['products']}
        n = 1
        while True:
            code = f"{prefix}{n:03d}"
            if code not in existing:
                return code
            n += 1

    def get_products(self): return self.data["products"]
    def add_product(self, p):
        p["id"] = str(uuid.uuid4())
        # Auto-gera código se não fornecido
        if not p.get("code", "").strip():
            p["code"] = self.generate_product_code(p.get("name", "PRD"))
        self.data["products"].append(p); self.save()
        return p
    def update_product(self, pid, upd):
        for i, p in enumerate(self.data["products"]):
            if p["id"] == pid:
                upd["id"] = pid
                self.data["products"][i] = upd; break
        self.save()
    def delete_product(self, pid):
        self.data["products"] = [p for p in self.data["products"] if p["id"] != pid]
        self.save()
    def get_product_by_id(self, pid):
        return next((p for p in self.data["products"] if p["id"] == pid), None)

    # ─── CUSTOMERS ────────────────────────────────────────────────────────────
    def get_customers(self): return self.data["customers"]
    def add_customer(self, c):
        c["id"] = str(uuid.uuid4())
        self.data["customers"].append(c); self.save()
        return c
    def update_customer(self, cid, upd):
        for i, c in enumerate(self.data["customers"]):
            if c["id"] == cid:
                upd["id"] = cid
                self.data["customers"][i] = upd; break
        self.save()
    def delete_customer(self, cid):
        self.data["customers"] = [c for c in self.data["customers"] if c["id"] != cid]
        self.save()
    def get_customer_by_id(self, cid):
        return next((c for c in self.data["customers"] if c["id"] == cid), None)

    # ─── SALES ────────────────────────────────────────────────────────────────
    def get_sales(self): return self.data["sales"]
    def add_sale(self, sale):
        sale["id"] = str(uuid.uuid4())
        sale["date"] = datetime.now().isoformat()
        sale.setdefault("status", "concluida")
        for item in sale.get("items", []):
            for p in self.data["products"]:
                if p["id"] == item.get("product_id"):
                    p["stock"] = max(0, p["stock"] - item["quantity"]); break
        self.data["sales"].append(sale); self.save()
        return sale

    def cancel_sale(self, sale_id):
        for s in self.data["sales"]:
            if s["id"] == sale_id:
                if s.get("status") == "cancelada":
                    return False, "Esta venda já está cancelada."
                for item in s.get("items", []):
                    for p in self.data["products"]:
                        if p["id"] == item.get("product_id"):
                            p["stock"] += item["quantity"]; break
                s["status"] = "cancelada"
                s["cancelled_at"] = datetime.now().isoformat()
                self.save()
                return True, "Venda cancelada com sucesso!"
        return False, "Venda não encontrada."

    def cancel_sale_item(self, sale_id: str, item_index: int, send_to_trocas: bool = True, quantity: float = None):
        """Cancela um item específico de uma venda (total ou parcialmente), ajustando o total."""
        for s in self.data["sales"]:
            if s["id"] != sale_id:
                continue
            if s.get("status") == "cancelada":
                return False, "A venda inteira já está cancelada."
            items = s.get("items", [])
            if item_index < 0 or item_index >= len(items):
                return False, "Item não encontrado."
            item = items[item_index]
            if item.get("cancelled"):
                return False, "Este item já foi cancelado."

            # Quantidade a cancelar (padrão = tudo)
            max_qty = item["quantity"]
            cancel_qty = max_qty
            if quantity is not None:
                cancel_qty = max(1, min(float(quantity), max_qty))

            partial = cancel_qty < max_qty

            # Restituir estoque
            for p in self.data["products"]:
                if p["id"] == item.get("product_id"):
                    p["stock"] += cancel_qty
                    break

            if partial:
                # Cancelamento parcial: divide o item em dois
                remaining_qty = max_qty - cancel_qty
                # Adiciona novo item com a quantidade restante
                new_item = dict(item)
                new_item["quantity"] = remaining_qty
                items.insert(item_index + 1, new_item)
                # Marca o original com a quantidade cancelada
                items[item_index] = dict(item)
                items[item_index]["quantity"] = cancel_qty
                items[item_index]["cancelled"] = True
                items[item_index]["cancelled_at"] = datetime.now().isoformat()
                items[item_index]["cancelled_qty"] = cancel_qty
            else:
                # Cancelamento total do item
                items[item_index]["cancelled"] = True
                items[item_index]["cancelled_at"] = datetime.now().isoformat()

            # Recalcular total da venda (somente itens não cancelados)
            new_subtotal = sum(
                it["quantity"] * it["unit_price"] * (1 - it.get("discount", 0) / 100)
                for it in items if not it.get("cancelled")
            )
            disc_pct = s.get("discount_pct", 0)
            new_total = new_subtotal * (1 - disc_pct / 100)
            s["subtotal"] = round(new_subtotal, 2)
            s["total"] = round(new_total, 2)
            s["discount_value"] = round(new_subtotal - new_total, 2)
            s["last_edited"] = datetime.now().isoformat()

            # Se todos os itens foram cancelados, cancela a venda toda
            if all(it.get("cancelled") for it in items):
                s["status"] = "cancelada"
                s["cancelled_at"] = datetime.now().isoformat()

            # Criar troca se solicitado
            if send_to_trocas:
                self.add_troca({
                    "product_id": item.get("product_id", ""),
                    "product_name": item.get("name", "Produto"),
                    "product_code": item.get("code", ""),
                    "quantity": cancel_qty,
                    "motivo": "Cancelamento de item",
                    "sale_id": sale_id,
                    "customer_name": s.get("customer_name", ""),
                    "unit_price": item.get("unit_price", 0),
                })
            self.save()
            return True, "Item cancelado e estoque restituído!"
        return False, "Venda não encontrada."

    def update_sale(self, sale_id: str, updates: dict):
        """Atualiza campos editáveis de uma venda (pagamento, observações, cliente)."""
        for s in self.data["sales"]:
            if s["id"] == sale_id:
                for k in ["payment_method", "observations", "customer_id", "customer_name", "cash_received"]:
                    if k in updates:
                        s[k] = updates[k]
                s["last_edited"] = datetime.now().isoformat()
                self.save()
                return True
        return False

    def delete_sale(self, sale_id):
        self.data["sales"] = [s for s in self.data["sales"] if s["id"] != sale_id]
        self.save()

    def get_sale_by_id(self, sale_id):
        return next((s for s in self.data["sales"] if s["id"] == sale_id), None)

    # ─── DASHBOARD ────────────────────────────────────────────────────────────
    def get_dashboard_data(self):
        from datetime import timedelta
        now = datetime.now()
        today_str = now.strftime("%Y-%m-%d")
        month_start = now.replace(day=1).strftime("%Y-%m-%d")

        sales = self.data["sales"]
        active_sales = [s for s in sales if s.get("status") != "cancelada"]

        today_sales = sum(
            s.get("total", 0) for s in active_sales
            if s.get("date", "").startswith(today_str)
        )
        month_sales = sum(
            s.get("total", 0) for s in active_sales
            if s.get("date", "") >= month_start
        )

        # Chart 30 days
        chart_data = []
        for i in range(29, -1, -1):
            day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            total = sum(
                s.get("total", 0) for s in active_sales
                if s.get("date", "").startswith(day)
            )
            chart_data.append({"date": day, "total": total})

        # Status counts
        status_concluida = sum(1 for s in sales if s.get("status") == "concluida")
        status_cancelada = sum(1 for s in sales if s.get("status") == "cancelada")

        # Low stock alerts
        low_stock = sum(
            1 for p in self.data["products"]
            if p.get("stock", 0) <= p.get("min_stock", 0)
        )

        # Pending returns
        trocas = self._load_trocas()
        pending_returns = sum(1 for t in trocas if t.get("status") == "pendente")

        # Recent sales (last 10)
        recent = sorted(sales, key=lambda s: s.get("date", ""), reverse=True)[:10]

        return {
            "today_sales": today_sales,
            "month_sales": month_sales,
            "chart_data": chart_data,
            "status_concluida": status_concluida,
            "status_cancelada": status_cancelada,
            "low_stock_alerts": low_stock,
            "pending_returns": pending_returns,
            "recent_sales": recent,
            "total_products": len(self.data["products"]),
            "total_customers": len(self.data["customers"]),
        }

    # ─── TROCAS ───────────────────────────────────────────────────────────────
    def _load_trocas(self):
        if os.path.exists(TROCAS_FILE):
            try:
                with open(TROCAS_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return []

    def _save_trocas(self, data):
        with open(TROCAS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def get_trocas(self): return self._load_trocas()

    def add_troca(self, troca):
        troca["id"] = str(uuid.uuid4())
        troca["date"] = datetime.now().isoformat()
        troca.setdefault("status", "pendente")
        data = self._load_trocas()
        data.append(troca)
        self._save_trocas(data)
        return troca

    def update_troca(self, tid, status):
        data = self._load_trocas()
        for t in data:
            if t["id"] == tid:
                old_status = t.get("status")
                t["status"] = status
                t["updated_at"] = datetime.now().isoformat()
                if status == "devolvido_estoque" and old_status != "devolvido_estoque":
                    for p in self.data["products"]:
                        if p["id"] == t.get("product_id"):
                            p["stock"] += t.get("quantity", 0); break
                    self.save()
                elif old_status == "devolvido_estoque" and status != "devolvido_estoque":
                    for p in self.data["products"]:
                        if p["id"] == t.get("product_id"):
                            p["stock"] -= t.get("quantity", 0); break
                    self.save()
                break
        self._save_trocas(data)

    def delete_troca(self, tid):
        data = [t for t in self._load_trocas() if t["id"] != tid]
        self._save_trocas(data)

    # ─── USERS ────────────────────────────────────────────────────────────────
    def get_users(self): return self.data.get("users", [])
    def authenticate(self, username, password):
        u = next((u for u in self.get_users()
                  if u.get("username", "").lower() == username.lower()), None)
        return u if (u and u.get("password") == password and u.get("active", True)) else None

    def add_user(self, user):
        existing = next((u for u in self.get_users()
                         if u.get("username", "").lower() == user["username"].lower()), None)
        if existing:
            return False, "Login já existe."
        user["id"] = str(uuid.uuid4())
        user.setdefault("active", True)
        self.data["users"].append(user)
        self.save()
        return True, "Usuário criado!"

    def update_user(self, uid, upd):
        for i, u in enumerate(self.data["users"]):
            if u["id"] == uid:
                upd["id"] = uid
                self.data["users"][i] = upd; break
        self.save()

    def delete_user(self, uid):
        if uid in ("admin-fixed", "func-fixed"):
            return False, "Não é possível excluir usuários padrão."
        self.data["users"] = [u for u in self.data["users"] if u["id"] != uid]
        self.save()
        return True, "Usuário excluído."

    def toggle_user_active(self, uid):
        for u in self.data["users"]:
            if u["id"] == uid:
                u["active"] = not u.get("active", True); break
        self.save()

    # ─── SETTINGS / EMPRESA ───────────────────────────────────────────────────
    def get_settings(self):
        s = self.data.get("settings", {})
        s.setdefault("accent_color", "#f97316")
        s.setdefault("meu_whatsapp", "")
        return s

    def save_settings(self, s):
        self.data["settings"] = s; self.save()

    def get_empresa(self):
        return self.data.get("empresa", self._defaults()["empresa"])

    def save_empresa(self, e):
        self.data["empresa"] = e; self.save()

    def get_nfce(self):
        return self.data.get("nfce", self._defaults()["nfce"])

    def save_nfce(self, n):
        self.data["nfce"] = n; self.save()

    def next_nf_number(self):
        nfce = self.get_nfce()
        num = int(nfce.get("proxima_nf", 1))
        nfce["proxima_nf"] = num + 1
        self.save_nfce(nfce)
        return num

    def get_nota_fiscal_cfg(self):
        nf = self.get_settings().get("nota_fiscal", {})
        nf.setdefault("nome_loja", "BINC")
        nf.setdefault("slogan", "Sistema de Gestão e Vendas")
        nf.setdefault("endereco", "")
        nf.setdefault("telefone", "")
        nf.setdefault("cnpj", "")
        nf.setdefault("rodape", "Obrigado pela preferência!")
        return nf

    # ─── CAIXA ────────────────────────────────────────────────────────────────
    def _load_caixa(self):
        if os.path.exists(CAIXA_FILE):
            try:
                with open(CAIXA_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"aberto": False, "historico": []}

    def _save_caixa(self, data):
        with open(CAIXA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def get_caixa(self): return self._load_caixa()

    def abrir_caixa(self, valor_inicial: float, operador: str):
        cx = self._load_caixa()
        if cx.get("aberto"):
            return False, "Caixa já está aberto."
        cx["aberto"] = True
        cx["abertura"] = {
            "valor_inicial": valor_inicial,
            "operador": operador,
            "data": datetime.now().isoformat(),
            "movimentacoes": []
        }
        self._save_caixa(cx)
        return True, "Caixa aberto!"

    def fechar_caixa(self, valor_contado: float, operador: str):
        cx = self._load_caixa()
        if not cx.get("aberto"):
            return False, "Caixa não está aberto.", {}
        ab = cx.get("abertura", {})
        vi = ab.get("valor_inicial", 0)
        dt_abertura = ab.get("data", "")
        vendas_periodo = [
            s for s in self.data["sales"]
            if s.get("date", "") >= dt_abertura and s.get("status") != "cancelada"
        ]
        total_vendas = sum(s.get("total", 0) for s in vendas_periodo)
        movs = ab.get("movimentacoes", [])
        total_sangria = sum(m["valor"] for m in movs if m["tipo"] == "sangria")
        total_suprimento = sum(m["valor"] for m in movs if m["tipo"] == "suprimento")
        esperado = vi + total_vendas + total_suprimento - total_sangria
        diferenca = valor_contado - esperado
        por_pagamento = defaultdict(float)
        for s in vendas_periodo:
            por_pagamento[s.get("payment_method", "Outros")] += s.get("total", 0)
        resumo = {
            "valor_inicial": vi, "total_vendas": total_vendas,
            "total_sangria": total_sangria, "total_suprimento": total_suprimento,
            "esperado": esperado, "contado": valor_contado, "diferenca": diferenca,
            "n_vendas": len(vendas_periodo), "por_pagamento": dict(por_pagamento),
            "operador_abertura": ab.get("operador", ""),
            "operador_fechamento": operador,
            "data_abertura": dt_abertura,
            "data_fechamento": datetime.now().isoformat(),
            "movimentacoes": movs
        }
        cx["historico"].append(resumo)
        cx["aberto"] = False
        cx["abertura"] = {}
        self._save_caixa(cx)
        return True, "Caixa fechado!", resumo

    # ─── REPORTS ──────────────────────────────────────────────────────────────
    def get_report_summary(self, start_date: str = None, end_date: str = None):
        sales = self.data["sales"]
        if start_date:
            sales = [s for s in sales if s.get("date", "") >= start_date]
        if end_date:
            sales = [s for s in sales if s.get("date", "") <= end_date + "T23:59:59"]
        active = [s for s in sales if s.get("status") != "cancelada"]

        total_revenue = sum(s.get("total", 0) for s in active)
        total_cost = 0
        for s in active:
            for it in s.get("items", []):
                p = self.get_product_by_id(it.get("product_id", ""))
                if p:
                    total_cost += p.get("cost_price", 0) * it.get("quantity", 0)
        gross_margin = total_revenue - total_cost

        by_payment = defaultdict(float)
        by_category = defaultdict(float)
        product_sales = defaultdict(lambda: {"qty": 0, "revenue": 0, "name": ""})

        for s in active:
            by_payment[s.get("payment_method", "Outros")] += s.get("total", 0)
            for it in s.get("items", []):
                p = self.get_product_by_id(it.get("product_id", ""))
                cat = p.get("category", "Outros") if p else "Outros"
                by_category[cat] += it.get("quantity", 0) * it.get("unit_price", 0)
                pid = it.get("product_id", "")
                product_sales[pid]["qty"] += it.get("quantity", 0)
                product_sales[pid]["revenue"] += it.get("quantity", 0) * it.get("unit_price", 0)
                product_sales[pid]["name"] = it.get("name", "")

        top_products = sorted(
            [{"id": k, **v} for k, v in product_sales.items()],
            key=lambda x: x["revenue"], reverse=True
        )[:10]

        return {
            "total_revenue": total_revenue,
            "total_cost": total_cost,
            "gross_margin": gross_margin,
            "total_sales": len(active),
            "cancelled_sales": len(sales) - len(active),
            "by_payment": dict(by_payment),
            "by_category": dict(by_category),
            "top_products": top_products,
        }

    # ─── FALTAS ───────────────────────────────────────────────────────────────
    def _load_faltas(self):
        if os.path.exists(FALTAS_FILE):
            try:
                with open(FALTAS_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return []

    def _save_faltas(self, data):
        with open(FALTAS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def get_faltas(self): return self._load_faltas()

    def add_falta(self, falta):
        falta["id"] = str(uuid.uuid4())
        falta["date"] = datetime.now().isoformat()
        falta.setdefault("status", "pendente")
        data = self._load_faltas()
        data.append(falta)
        self._save_faltas(data)
        return falta

    def update_falta(self, fid: str, updates: dict):
        data = self._load_faltas()
        for i, f in enumerate(data):
            if f["id"] == fid:
                updates["id"] = fid
                updates["date"] = f.get("date", "")
                data[i] = {**f, **updates}
                break
        self._save_faltas(data)

    def delete_falta(self, fid: str):
        data = [f for f in self._load_faltas() if f["id"] != fid]
        self._save_faltas(data)

    def falta_to_stock(self, fid: str, product_data: dict):
        """Move uma falta para o estoque criando/atualizando o produto."""
        faltas = self._load_faltas()
        falta = next((f for f in faltas if f["id"] == fid), None)
        if not falta:
            return None
        # Criar produto
        product = self.add_product(product_data)
        # Remover da lista de faltas
        self.delete_falta(fid)
        return product

    # ─── BINC IA ──────────────────────────────────────────────────────────────
    def get_ia_context(self) -> dict:
        """Retorna contexto detalhado dos dados para a IA."""
        dash = self.get_dashboard_data()
        products = self.data["products"]
        customers = self.data["customers"]
        sales = self.data["sales"]
        active_sales = [s for s in sales if s.get("status") != "cancelada"]
        low_stock = [p for p in products if p.get("stock", 0) <= p.get("min_stock", 0)]

        # Customer spending analytics
        customer_spending = defaultdict(lambda: {"total": 0, "count": 0, "payments": defaultdict(float)})
        for s in active_sales:
            cid = s.get("customer_id") or "avulso"
            customer_spending[cid]["total"] += s.get("total", 0)
            customer_spending[cid]["count"] += 1
            pm = s.get("payment_method", "Outros")
            customer_spending[cid]["payments"][pm] += s.get("total", 0)

        # Payment method global
        by_payment = defaultdict(float)
        for s in active_sales:
            by_payment[s.get("payment_method", "Outros")] += s.get("total", 0)

        # Build top customers with names
        top_customers = []
        for c in customers:
            cdata = customer_spending.get(c["id"], {})
            if cdata:
                fav_payment = max(cdata["payments"], key=cdata["payments"].get) if cdata["payments"] else "N/A"
                top_customers.append({
                    "name": c["name"],
                    "phone": c.get("phone", ""),
                    "veiculo": c.get("veiculo", ""),
                    "total": cdata["total"],
                    "count": cdata["count"],
                    "fav_payment": fav_payment,
                })
        top_customers.sort(key=lambda x: x["total"], reverse=True)

        return {
            "today_sales": dash["today_sales"],
            "month_sales": dash["month_sales"],
            "total_products": len(products),
            "all_products": [{"name": p["name"], "stock": p["stock"], "min_stock": p["min_stock"],
                              "sale_price": p["sale_price"], "category": p.get("category", "")} for p in products],
            "total_customers": len(customers),
            "all_customers": [{"name": c["name"], "phone": c.get("phone", ""),
                               "veiculo": c.get("veiculo", ""), "placa": c.get("placa", "")} for c in customers],
            "low_stock_count": len(low_stock),
            "low_stock_products": [{"name": p["name"], "stock": p["stock"], "min_stock": p["min_stock"]} for p in low_stock],
            "pending_returns": dash["pending_returns"],
            "status_concluida": dash["status_concluida"],
            "status_cancelada": dash["status_cancelada"],
            "by_payment": dict(by_payment),
            "top_customers": top_customers[:10],
            "total_active_sales": len(active_sales),
        }

    def answer_ia_query(self, message: str) -> str:
        """Respostas detalhadas baseadas nos dados reais do sistema."""
        msg = message.lower()
        ctx = self.get_ia_context()

        # VENDAS
        if any(k in msg for k in ["venda", "vendid", "hoje", "faturamento", "mês", "mes"]):
            report = self.get_report_summary()
            top = report["top_products"][:3] if report["top_products"] else []
            top_str = ", ".join([f"**{p['name']}** ({p['qty']}x)"
                                  for p in top]) or "nenhum ainda"
            pay_str = ", ".join([f"**{k}**: R$ {v:,.2f}" for k, v in
                                  sorted(ctx["by_payment"].items(), key=lambda x: -x[1])[:3]]) or "nenhum"
            return (
                f"📊 **Resumo de Vendas:**\n"
                f"• Hoje: **R$ {ctx['today_sales']:,.2f}**\n"
                f"• Mês atual: **R$ {ctx['month_sales']:,.2f}**\n"
                f"• Concluídas: {ctx['status_concluida']} | Canceladas: {ctx['status_cancelada']}\n"
                f"• Pagamentos mais usados: {pay_str}\n"
                f"• Top produtos vendidos: {top_str}\n"
                f"• Margem bruta: **R$ {report['gross_margin']:,.2f}**"
            )

        # CLIENTES
        if any(k in msg for k in ["cliente", "comprador", "quem compra"]):
            customers = ctx["all_customers"]
            top_c = ctx["top_customers"]
            names = ", ".join([c["name"] for c in customers[:10]])
            if len(customers) > 10:
                names += f" e mais {len(customers)-10}..."
            details = []
            for c in top_c[:5]:
                details.append(
                    f"**{c['name']}** — gastou **R$ {c['total']:,.2f}** "
                    f"em {c['count']} compra(s), prefere **{c['fav_payment']}**"
                    + (f", veículo: {c['veiculo']}" if c['veiculo'] else "")
                )
            detail_str = "\n".join([f"• {d}" for d in details]) if details else "• Nenhuma compra registrada ainda"
            return (
                f"👥 **{ctx['total_customers']} cliente(s) cadastrado(s):**\n"
                f"{names}\n\n"
                f"**Top compradores:**\n{detail_str}"
            )

        # ESTOQUE / PRODUTOS
        if any(k in msg for k in ["produto", "estoque", "inventário", "inventario"]):
            products = ctx["all_products"]
            low = ctx["low_stock_products"]
            prod_list = "\n".join([f"• **{p['name']}** — {p['stock']} {p.get('unit','un')} (mín: {p['min_stock']}) — R$ {p['sale_price']:.2f}"
                                    for p in products[:15]])
            if len(products) > 15:
                prod_list += f"\n• ...e mais {len(products)-15} produto(s)"
            low_str = "\n".join([f"• ⚠️ **{p['name']}**: {p['stock']}/{p['min_stock']}"
                                  for p in low]) if low else "• ✅ Todos com estoque adequado"
            return (
                f"📦 **{ctx['total_products']} produto(s) cadastrado(s):**\n"
                f"{prod_list}\n\n"
                f"**Alertas de estoque baixo:**\n{low_str}"
            )

        # TROCAS
        if any(k in msg for k in ["troca", "devoluç", "devolver", "pendente", "retorno"]):
            trocas = self._load_trocas()
            pendentes = [t for t in trocas if t.get("status") == "pendente"]
            resolvidos = [t for t in trocas if t.get("status") != "pendente"]
            pend_str = "\n".join([f"• **{t.get('product_name','')}** x{t.get('quantity',1)} — {t.get('motivo','')} — {t.get('customer_name','')}"
                                   for t in pendentes[:5]]) or "• Nenhuma troca pendente!"
            return (
                f"🔄 **Trocas & Devoluções:**\n"
                f"• Total: {len(trocas)} | Pendentes: **{len(pendentes)}** | Resolvidas: {len(resolvidos)}\n\n"
                f"**Pendentes:**\n{pend_str}"
            )

        # LUCRO / MARGEM
        if any(k in msg for k in ["lucro", "margem", "resultado", "rentabilidade"]):
            report = self.get_report_summary()
            margin_pct = (report['gross_margin'] / report['total_revenue'] * 100) if report['total_revenue'] else 0
            pay_str = "\n".join([f"• {k}: **R$ {v:,.2f}**" for k, v in
                                  sorted(report["by_payment"].items(), key=lambda x: -x[1])])
            cat_str = "\n".join([f"• {k}: **R$ {v:,.2f}**" for k, v in
                                  sorted(report["by_category"].items(), key=lambda x: -x[1])[:5]])
            return (
                f"💰 **Análise Financeira:**\n"
                f"• Receita total: **R$ {report['total_revenue']:,.2f}**\n"
                f"• Custo estimado: **R$ {report['total_cost']:,.2f}**\n"
                f"• Margem bruta: **R$ {report['gross_margin']:,.2f}** ({margin_pct:.1f}%)\n"
                f"• Vendas concluídas: {report['total_sales']}\n\n"
                f"**Por forma de pagamento:**\n{pay_str or '• Nenhuma ainda'}\n\n"
                f"**Por categoria:**\n{cat_str or '• Nenhuma ainda'}"
            )

        # TOP PRODUTOS
        if any(k in msg for k in ["top", "mais vend", "melhor produto", "popular"]):
            report = self.get_report_summary()
            if report["top_products"]:
                lines = []
                for i, p in enumerate(report["top_products"][:10], 1):
                    lines.append(f"{i}. **{p['name']}** — {p['qty']} unid. — R$ {p['revenue']:,.2f}")
                return (
                    f"🏆 **Top {len(lines)} Produtos Mais Vendidos:**\n"
                    + "\n".join(lines)
                )
            return "🏆 Ainda não há vendas registradas para calcular o ranking."

        # PAGAMENTO
        if any(k in msg for k in ["pagamento", "pix", "dinheiro", "cartão", "cartao", "forma"]):
            by_pay = ctx["by_payment"]
            total = sum(by_pay.values())
            if not by_pay:
                return "💳 Nenhuma venda registrada para analisar formas de pagamento."
            lines = []
            for pm, val in sorted(by_pay.items(), key=lambda x: -x[1]):
                pct = val / total * 100 if total else 0
                lines.append(f"• **{pm}**: R$ {val:,.2f} ({pct:.1f}%)")
            fav = max(by_pay, key=by_pay.get)
            return f"💳 **Vendas por forma de pagamento:**\n" + "\n".join(lines) + f"\n\n✨ Forma mais popular: **{fav}**"

        # DEFAULT
        ctx_simple = ctx
        return (
            f"Olá! Sou a BincIA. Aqui está um resumo rápido:\n"
            f"• 💰 Vendas hoje: **R$ {ctx['today_sales']:,.2f}** | Mês: **R$ {ctx['month_sales']:,.2f}**\n"
            f"• 📦 {ctx['total_products']} produto(s) | ⚠️ {ctx['low_stock_count']} com estoque baixo\n"
            f"• 👥 {ctx['total_customers']} cliente(s) cadastrado(s)\n"
            f"• 🔄 {ctx['pending_returns']} troca(s) pendente(s)\n\n"
            f"Pergunte sobre: **vendas**, **clientes**, **produtos**, **estoque**, **trocas**, **lucro**, **pagamentos** ou **top produtos**!"
        )

    def get_ia_suggestions(self) -> list:
        ctx = self.get_ia_context()
        suggestions = [
            "📊 Resumo completo das vendas",
            "👥 Quem são meus clientes e quanto gastaram?",
            "📦 Liste todos os produtos e estoque",
            "💳 Quais formas de pagamento mais usam?",
            "💰 Qual a margem de lucro?",
            "🏆 Top 10 produtos mais vendidos",
        ]
        if ctx["pending_returns"]:
            suggestions.insert(0, f"🔄 Tenho {ctx['pending_returns']} troca(s) pendente(s)")
        if ctx["low_stock_count"]:
            suggestions.insert(1, f"⚠️ {ctx['low_stock_count']} produto(s) com estoque baixo")
        return suggestions[:6]

"""
Binc CMS v2 — Pure Python UI · White/Light Theme
100% PyQt5 native widgets, zero HTML files.
Compartilha o mesmo autopecas_data.json do sistema original.
"""

import sys, os, json, uuid, hashlib, re
from datetime import datetime, date
from collections import Counter

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QGridLayout, QFormLayout, QStackedWidget, QPushButton, QLabel,
    QLineEdit, QTextEdit, QComboBox, QSpinBox, QDoubleSpinBox,
    QTableWidget, QTableWidgetItem, QHeaderView, QFrame, QScrollArea,
    QSizePolicy, QAbstractItemView, QDialog, QDialogButtonBox,
    QMessageBox, QFileDialog, QSplitter, QListWidget, QListWidgetItem,
    QStatusBar, QToolButton, QGroupBox, QCheckBox, QTabWidget,
    QProgressBar, QAction, QShortcut, QGraphicsDropShadowEffect
)
from PyQt5.QtCore import Qt, QTimer, QSize, QThread, pyqtSignal, QRect
from PyQt5.QtGui import (
    QFont, QColor, QPalette, QIcon, QPixmap, QPainter, QPen, QBrush,
    QLinearGradient, QFontDatabase, QKeySequence, QPainterPath
)

# ─── Caminhos ─────────────────────────────────────────────────────
V2_DIR   = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(V2_DIR)
DATA_FILE = os.path.join(BASE_DIR, "autopecas_data.json")
MACHINE_CONFIG = os.path.join(BASE_DIR, "machine_config.json")
_PIN_CODE = "8602"

def fmtR(v):
    try: return f"R$ {float(v):,.2f}".replace(",","X").replace(".",",").replace("X",".")
    except: return "R$ 0,00"

# ═══════════════════════════════════════════════════════════════════
#  THEME
# ═══════════════════════════════════════════════════════════════════
ORANGE  = "#FF6B35"
ORANGE_L = "#FFF4EE"
ORANGE_D = "#E8520A"
BG      = "#F8FAFC"
CARD    = "#FFFFFF"
BORDER  = "#E2E8F0"
TEXT    = "#0F172A"
TEXT2   = "#64748B"
TEXT3   = "#94A3B8"
SUCCESS = "#10B981"
ERROR   = "#EF4444"
WARN    = "#F59E0B"
INFO    = "#3B82F6"
SIDEBAR = "#FFFFFF"
INPUT_BG= "#F1F5F9"

QSS = f"""
* {{ font-family: 'Segoe UI', 'Inter', Arial, sans-serif; color: {TEXT}; }}
QMainWindow, QDialog {{ background: {BG}; }}
QWidget#root_bg {{ background: {BG}; }}

/* ── Sidebar ── */
QWidget#sidebar {{
    background: {SIDEBAR};
    border-right: 1px solid {BORDER};
}}
QLabel#logo_title {{
    font-size: 17px; font-weight: 800; color: {TEXT};
    letter-spacing: 0.5px;
}}
QLabel#logo_sub {{
    font-size: 10px; color: {TEXT3}; letter-spacing: 2px;
    text-transform: uppercase;
}}

/* ── Nav buttons ── */
QPushButton#nav_btn {{
    background: transparent; border: none;
    border-radius: 10px; padding: 9px 14px;
    text-align: left; font-size: 13px; font-weight: 500;
    color: {TEXT2};
}}
QPushButton#nav_btn:hover {{
    background: {ORANGE_L}; color: {ORANGE};
}}
QPushButton#nav_btn_active {{
    background: qlineargradient(x1:0,y1:0,x2:1,y2:0,stop:0 {ORANGE},stop:1 {ORANGE_D});
    color: white; border: none; border-radius: 10px;
    padding: 9px 14px; text-align: left;
    font-size: 13px; font-weight: 700;
}}

/* ── Section label ── */
QLabel#section_label {{
    font-size: 10px; font-weight: 700; color: {TEXT3};
    letter-spacing: 2px; text-transform: uppercase;
    padding: 10px 14px 2px;
}}

/* ── Content panels ── */
QWidget#content_bg {{ background: {BG}; }}

/* ── Cards ── */
QFrame#card {{
    background: {CARD}; border: 1px solid {BORDER};
    border-radius: 14px;
}}
QFrame#card_accent {{
    background: qlineargradient(x1:0,y1:0,x2:1,y2:1,stop:0 {ORANGE},stop:1 {ORANGE_D});
    border-radius: 14px;
}}

/* ── Metrics ── */
QLabel#metric_val {{
    font-size: 26px; font-weight: 800; color: {TEXT};
}}
QLabel#metric_label {{
    font-size: 12px; color: {TEXT2}; font-weight: 500;
}}
QLabel#metric_sub {{
    font-size: 11px; color: {TEXT3};
}}

/* ── Tables ── */
QTableWidget {{
    background: {CARD}; border: none;
    gridline-color: {BORDER};
    selection-background-color: {ORANGE_L};
    selection-color: {TEXT};
    font-size: 13px;
}}
QTableWidget::item {{ padding: 8px 12px; border-bottom: 1px solid {BORDER}; }}
QTableWidget::item:selected {{ background: {ORANGE_L}; color: {TEXT}; }}
QHeaderView::section {{
    background: {BG}; color: {TEXT2};
    font-size: 11px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    padding: 10px 12px; border: none;
    border-bottom: 2px solid {BORDER};
}}

/* ── Line Edits ── */
QLineEdit, QTextEdit, QComboBox, QSpinBox, QDoubleSpinBox {{
    background: {INPUT_BG}; border: 1.5px solid {BORDER};
    border-radius: 10px; padding: 8px 12px;
    font-size: 13px; color: {TEXT};
}}
QLineEdit:focus, QTextEdit:focus, QComboBox:focus,
QSpinBox:focus, QDoubleSpinBox:focus {{
    border-color: {ORANGE};
    background: {CARD};
}}
QSpinBox::up-button, QSpinBox::down-button, QDoubleSpinBox::up-button, QDoubleSpinBox::down-button {{
    width: 0px; border: none; background: transparent;
}}
QComboBox::drop-down {{ border: none; width: 24px; }}
QComboBox QAbstractItemView {{
    background: {CARD}; border: 1px solid {BORDER};
    selection-background-color: {ORANGE_L};
}}

/* ── Buttons ── */
QPushButton#btn_primary {{
    background: qlineargradient(x1:0,y1:0,x2:1,y2:0,stop:0 {ORANGE},stop:1 {ORANGE_D});
    color: white; border: none; border-radius: 10px;
    padding: 10px 22px; font-size: 13px; font-weight: 700;
}}
QPushButton#btn_primary:hover {{ background: {ORANGE_D}; }}
QPushButton#btn_primary:pressed {{ background: #c44208; }}

QPushButton#btn_secondary {{
    background: {CARD}; color: {TEXT2}; border: 1.5px solid {BORDER};
    border-radius: 10px; padding: 9px 20px;
    font-size: 13px; font-weight: 600;
}}
QPushButton#btn_secondary:hover {{ background: {BG}; border-color: {TEXT3}; }}

QPushButton#btn_danger {{
    background: #FFF1F1; color: {ERROR}; border: 1.5px solid #FCA5A5;
    border-radius: 10px; padding: 9px 20px;
    font-size: 13px; font-weight: 600;
}}
QPushButton#btn_danger:hover {{ background: #FEE2E2; }}

QPushButton#btn_success {{
    background: #ECFDF5; color: {SUCCESS}; border: 1.5px solid #6EE7B7;
    border-radius: 10px; padding: 9px 20px;
    font-size: 13px; font-weight: 600;
}}
QPushButton#btn_success:hover {{ background: #D1FAE5; }}

QPushButton#btn_icon {{
    background: {BG}; border: 1.5px solid {BORDER};
    border-radius: 8px; padding: 6px;
    color: {TEXT2};
}}
QPushButton#btn_icon:hover {{ border-color: {ORANGE}; color: {ORANGE}; background: {ORANGE_L}; }}

/* ── Scroll ── */
QScrollBar:vertical {{
    background: transparent; width: 6px; margin: 0;
}}
QScrollBar::handle:vertical {{
    background: {BORDER}; border-radius: 3px; min-height: 20px;
}}
QScrollBar::handle:vertical:hover {{ background: {TEXT3}; }}
QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{ height: 0; }}

QScrollArea {{ border: none; background: transparent; }}

/* ── Status bar ── */
QStatusBar {{ background: {CARD}; border-top: 1px solid {BORDER}; color: {TEXT2}; font-size: 12px; }}

/* ── Search bar ── */
QLineEdit#search_bar {{
    background: {INPUT_BG}; border: 1.5px solid {BORDER};
    border-radius: 22px; padding: 8px 16px 8px 36px;
    font-size: 13px;
}}
QLineEdit#search_bar:focus {{ border-color: {ORANGE}; background: {CARD}; }}

/* ── Dividers ── */
QFrame#divider {{ background: {BORDER}; max-height: 1px; }}

/* ── Dialog ── */
QDialog {{ background: {CARD}; }}
QLabel#dlg_title {{ font-size:18px; font-weight:800; color:{TEXT}; }}

/* ── Badges ── */
QLabel#badge_green {{ background:#ECFDF5; color:{SUCCESS}; border-radius:10px; padding:2px 10px; font-size:11px; font-weight:700; }}
QLabel#badge_red {{ background:#FEF2F2; color:{ERROR}; border-radius:10px; padding:2px 10px; font-size:11px; font-weight:700; }}
QLabel#badge_yellow {{ background:#FFFBEB; color:{WARN}; border-radius:10px; padding:2px 10px; font-size:11px; font-weight:700; }}
QLabel#badge_blue {{ background:#EFF6FF; color:{INFO}; border-radius:10px; padding:2px 10px; font-size:11px; font-weight:700; }}
QLabel#badge_orange {{ background:{ORANGE_L}; color:{ORANGE}; border-radius:10px; padding:2px 10px; font-size:11px; font-weight:700; }}

/* ── Icon action buttons ── */
QPushButton#btn_icon_edit {{
    background: #EFF6FF; border: 1.5px solid #BFDBFE;
    border-radius: 8px; color: {INFO}; font-size: 13px;
    min-width: 28px; max-width: 28px; min-height: 28px; max-height: 28px;
    padding: 0px; margin: 0px;
}}
QPushButton#btn_icon_edit:hover {{ background: #DBEAFE; border-color: {INFO}; }}

QPushButton#btn_icon_del {{
    background: #FEF2F2; border: 1.5px solid #FCA5A5;
    border-radius: 8px; color: {ERROR}; font-size: 13px;
    min-width: 28px; max-width: 28px; min-height: 28px; max-height: 28px;
    padding: 0px; margin: 0px;
}}
QPushButton#btn_icon_del:hover {{ background: #FEE2E2; border-color: {ERROR}; }}

QPushButton#btn_icon_warn {{
    background: #FFFBEB; border: 1.5px solid #FCD34D;
    border-radius: 8px; color: {WARN}; font-size: 13px;
    min-width: 28px; max-width: 28px; min-height: 28px; max-height: 28px;
    padding: 0px; margin: 0px;
}}
QPushButton#btn_icon_warn:hover {{ background: #FEF3C7; border-color: {WARN}; }}
"""

# ═══════════════════════════════════════════════════════════════════
#  DATA MANAGER
# ═══════════════════════════════════════════════════════════════════
class DataManager:
    def __init__(self):
        self._data = {}
        self._load()

    def _load(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    self._data = json.load(f)
            except: self._data = {}
        self._data.setdefault("products", [])
        self._data.setdefault("sales", [])
        self._data.setdefault("customers", [])
        self._data.setdefault("users", [{"id":"admin-fixed","name":"Administrador","username":"admin","password":"admin","role":"admin","active":True}])
        self._data.setdefault("settings", {})
        self._data.setdefault("trocas", [])
        self._data.setdefault("faltas", [])
        self._save()

    def _save(self):
        try:
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(self._data, f, ensure_ascii=False, indent=2)
        except: pass

    # Products
    def get_products(self): return self._data.get("products", [])
    def add_product(self, p):
        p["id"] = str(uuid.uuid4())[:12]
        p["added_at"] = datetime.now().isoformat()
        self._data["products"].append(p); self._save()
    def update_product(self, pid, data):
        for i, p in enumerate(self._data["products"]):
            if p["id"] == pid: self._data["products"][i] = data; self._save(); return
    def delete_product(self, pid):
        self._data["products"] = [p for p in self._data["products"] if p["id"] != pid]
        self._save()
    def get_product_by_id(self, pid):
        return next((p for p in self.get_products() if p["id"] == pid), None)

    # Sales
    def get_sales(self): return self._data.get("sales", [])
    def add_sale(self, s):
        s.setdefault("id", str(uuid.uuid4())[:12])
        s.setdefault("date", datetime.now().isoformat())
        self._data["sales"].append(s); self._save(); return s["id"]
    def save_sales(self, sales): self._data["sales"] = sales; self._save()
    def cancel_sale(self, sid):
        for s in self._data["sales"]:
            if s["id"] == sid: s["status"] = "cancelada"; self._save(); return True
        return False

    # Customers
    def get_customers(self): return self._data.get("customers", [])
    def add_customer(self, c):
        c["id"] = str(uuid.uuid4())[:12]
        c["added_at"] = datetime.now().isoformat()
        self._data["customers"].append(c); self._save()
    def update_customer(self, cid, data):
        for i, c in enumerate(self._data["customers"]):
            if c["id"] == cid: self._data["customers"][i] = data; self._save(); return
    def delete_customer(self, cid):
        self._data["customers"] = [c for c in self._data["customers"] if c["id"] != cid]
        self._save()

    # Users
    def get_users(self): return self._data.get("users", [])
    def authenticate(self, username, password):
        pwh = hashlib.sha256(password.encode()).hexdigest()
        for u in self.get_users():
            if (u.get("username") == username and u.get("active", True) and
                (u.get("password") == password or u.get("password_hash") == pwh)):
                return u
        return None
    def add_user(self, data):
        if any(u["username"] == data.get("username") for u in self.get_users()):
            return False, "Usuário já existe"
        data["id"] = str(uuid.uuid4())[:12]; data["active"] = True
        self._data["users"].append(data); self._save(); return True, "OK"
    def update_user(self, uid, data):
        for i, u in enumerate(self._data["users"]):
            if u["id"] == uid: self._data["users"][i] = data; self._save(); return
    def delete_user(self, uid):
        self._data["users"] = [u for u in self._data["users"] if u["id"] != uid]
        self._save()

    # Settings
    def get_settings(self): return self._data.get("settings", {})
    def save_settings(self, s): self._data["settings"] = s; self._save()

    # Trocas
    def get_trocas(self):
        return self._data.get("trocas", [])
    def save_trocas(self, trocas):
        self._data["trocas"] = trocas
        self._save()
    def add_troca(self, t):
        t.setdefault("id", str(uuid.uuid4())[:12])
        t.setdefault("date", datetime.now().isoformat())
        self._data["trocas"].append(t); self._save()

    # Faltas
    def get_faltas(self):
        return self._data.get("faltas", [])
    def save_faltas(self, f):
        self._data["faltas"] = f
        self._save()


def _is_activated():
    try:
        if os.path.exists(MACHINE_CONFIG):
            with open(MACHINE_CONFIG, "r", encoding="utf-8") as f:
                return json.load(f).get("activated", False)
    except: pass
    return False

def _activate_machine():
    try:
        import platform
        with open(MACHINE_CONFIG, "w", encoding="utf-8") as f:
            json.dump({"activated": True, "at": datetime.now().isoformat(),
                       "machine": platform.node()}, f, indent=2)
        return True
    except: return False


# ═══════════════════════════════════════════════════════════════════
#  REUSABLE COMPONENTS
# ═══════════════════════════════════════════════════════════════════
def make_card(parent=None):
    f = QFrame(parent); f.setObjectName("card")
    return f

def make_label(text, size=13, bold=False, color=None):
    lbl = QLabel(text)
    font = lbl.font(); font.setPointSize(size)
    if bold: font.setWeight(QFont.Bold)
    lbl.setFont(font)
    if color: lbl.setStyleSheet(f"color:{color}")
    return lbl

def make_btn(text, style="primary"):
    btn = QPushButton(text)
    btn.setObjectName(f"btn_{style}")
    btn.setCursor(Qt.PointingHandCursor)
    return btn

def make_divider():
    d = QFrame(); d.setObjectName("divider")
    d.setFrameShape(QFrame.HLine)
    d.setMaximumHeight(1)
    return d

def icon_char(char, color=TEXT, size=18):
    """Simple text-as-icon label."""
    lbl = QLabel(char)
    lbl.setStyleSheet(f"color:{color}; font-size:{size}px;")
    lbl.setAlignment(Qt.AlignCenter)
    return lbl


# ═══════════════════════════════════════════════════════════════
#  BASE MODALS & CUSTOM DIALOGS
# ═══════════════════════════════════════════════════════════════
class DraggableDialog(QDialog):
    """Base para dialogs que podem ser arrastados com o mouse."""
    def mousePressEvent(self, e):
        if e.button() == Qt.LeftButton:
            self._drag_pos = e.globalPos() - self.pos()
            e.accept()
    def mouseMoveEvent(self, e):
        if e.buttons() == Qt.LeftButton and hasattr(self, '_drag_pos'):
            self.move(e.globalPos() - self._drag_pos)
            e.accept()

class ModernFormDialog(DraggableDialog):
    """Base para modais branco moderno e clean, com sombra e bordas arredondadas."""
    def __init__(self, parent=None, min_width=400):
        super().__init__(parent)
        self.setModal(True)
        self.setWindowFlags(Qt.Dialog | Qt.FramelessWindowHint)
        self.setAttribute(Qt.WA_TranslucentBackground, True)
        self.setMinimumWidth(min_width)

        self._outer = QVBoxLayout(self)
        self._outer.setContentsMargins(16, 16, 16, 16)
        
        self.container = QFrame()
        self.container.setObjectName("binc_modal_container")
        self.container.setStyleSheet(
            f"QFrame#binc_modal_container {{background:{CARD};border-radius:20px;border:1px solid {BORDER};"
            f"padding:0px;}}"
        )
        
        self.main_lay = QVBoxLayout(self.container)
        self.main_lay.setContentsMargins(24, 20, 24, 20)
        self.main_lay.setSpacing(14)
        
        self._outer.addWidget(self.container)
        
    def add_title_bar(self, title):
        top_row = QHBoxLayout()
        tlbl = QLabel(title)
        tlbl.setStyleSheet(f"font-size:18px;font-weight:800;color:{TEXT};background:transparent;border:none;")
        top_row.addWidget(tlbl)
        top_row.addStretch()
        btn_close = QPushButton("✕")
        btn_close.setStyleSheet(f"background:transparent; border:none; font-size:16px; color:{TEXT3}; font-weight:bold;")
        btn_close.setCursor(Qt.PointingHandCursor)
        btn_close.clicked.connect(self.reject)
        top_row.addWidget(btn_close)
        self.main_lay.addLayout(top_row)
        self.main_lay.addSpacing(8)

class ConfirmDialog(DraggableDialog):
    """Modern frameless confirmation dialog with soft shadow."""
    def __init__(self, parent, title, message, icon="⚠️", danger=False, confirm_text=None):
        super().__init__(parent)
        self.setModal(True)
        self.setWindowFlags(Qt.Dialog | Qt.FramelessWindowHint)
        self.setAttribute(Qt.WA_TranslucentBackground, True)
        self.setFixedWidth(420)
        self._build(title, message, icon, danger, confirm_text)

    def _build(self, title, message, icon, danger, confirm_text):
        outer = QVBoxLayout(self)
        outer.setContentsMargins(16, 16, 16, 16)

        container = QFrame()
        container.setStyleSheet(
            f"QFrame{{background:{CARD};border-radius:20px;border:1px solid {BORDER};"
            f"padding:0px;}}")
        shadow = QGraphicsDropShadowEffect()
        shadow.setBlurRadius(40); shadow.setXOffset(0); shadow.setYOffset(8)
        shadow.setColor(QColor(0, 0, 0, 60))
        container.setGraphicsEffect(shadow)

        lay = QVBoxLayout(container)
        lay.setContentsMargins(32, 36, 32, 28); lay.setSpacing(0)

        # Icon badge
        ic_bg = QWidget()
        ic_bg.setFixedSize(72, 72)
        base_color = "#FEF2F2" if danger else "#FFFBEB"
        ic_bg.setStyleSheet(
            f"background:{base_color};border-radius:36px;border:none;")
        ic_l = QVBoxLayout(ic_bg); ic_l.setContentsMargins(0, 0, 0, 0)
        ic_lbl = QLabel(icon); ic_lbl.setAlignment(Qt.AlignCenter)
        ic_lbl.setStyleSheet("font-size:32px;background:transparent;border:none;")
        ic_l.addWidget(ic_lbl)
        ic_row = QHBoxLayout()
        ic_row.addStretch(); ic_row.addWidget(ic_bg); ic_row.addStretch()
        lay.addLayout(ic_row)
        lay.addSpacing(18)

        tlbl = QLabel(title); tlbl.setAlignment(Qt.AlignCenter)
        tlbl.setStyleSheet(
            f"font-size:19px;font-weight:800;color:{TEXT};"
            f"background:transparent;border:none;")
        lay.addWidget(tlbl)
        lay.addSpacing(8)

        mlbl = QLabel(message); mlbl.setWordWrap(True); mlbl.setAlignment(Qt.AlignCenter)
        mlbl.setStyleSheet(
            f"font-size:13px;color:{TEXT2};background:transparent;"
            f"border:none;line-height:1.6;")
        lay.addWidget(mlbl)
        lay.addSpacing(26)

        btn_row = QHBoxLayout(); btn_row.setSpacing(12)
        btn_cancel = QPushButton("Cancelar")
        btn_cancel.setObjectName("btn_secondary")
        btn_cancel.setFixedHeight(46); btn_cancel.setCursor(Qt.PointingHandCursor)
        btn_cancel.clicked.connect(self.reject)

        ok_txt = confirm_text or ("Excluir" if danger else "Confirmar")
        ok_obj = "btn_danger" if danger else "btn_primary"
        btn_ok = QPushButton(ok_txt)
        btn_ok.setObjectName(ok_obj)
        btn_ok.setFixedHeight(46); btn_ok.setCursor(Qt.PointingHandCursor)
        btn_ok.clicked.connect(self.accept)

        btn_row.addWidget(btn_cancel, 1); btn_row.addWidget(btn_ok, 1)
        lay.addLayout(btn_row)
        outer.addWidget(container)

    @staticmethod
    def ask(parent, title, message, icon="⚠️", danger=False, confirm_text=None):
        dlg = ConfirmDialog(parent, title, message, icon, danger, confirm_text)
        return dlg.exec_() == QDialog.Accepted


class AlertDialog(DraggableDialog):
    """Modern frameless single-button info/success dialog."""
    def __init__(self, parent, title, message, icon="ℹ️"):
        super().__init__(parent)
        self.setModal(True)
        self.setWindowFlags(Qt.Dialog | Qt.FramelessWindowHint)
        self.setAttribute(Qt.WA_TranslucentBackground, True)
        self.setFixedWidth(380)
        self._build(title, message, icon)

    def _build(self, title, message, icon):
        outer = QVBoxLayout(self); outer.setContentsMargins(16, 16, 16, 16)
        container = QFrame()
        container.setStyleSheet(
            f"QFrame{{background:{CARD};border-radius:20px;border:1px solid {BORDER};"
            f"padding:0px;}}")
        shadow = QGraphicsDropShadowEffect()
        shadow.setBlurRadius(40); shadow.setXOffset(0); shadow.setYOffset(8)
        shadow.setColor(QColor(0, 0, 0, 60))
        container.setGraphicsEffect(shadow)

        lay = QVBoxLayout(container)
        lay.setContentsMargins(28, 32, 28, 24); lay.setSpacing(10)

        ic_lbl = QLabel(icon); ic_lbl.setAlignment(Qt.AlignCenter)
        ic_lbl.setStyleSheet("font-size:40px;background:transparent;border:none;")
        lay.addWidget(ic_lbl)

        tlbl = QLabel(title); tlbl.setAlignment(Qt.AlignCenter)
        tlbl.setStyleSheet(
            f"font-size:18px;font-weight:800;color:{TEXT};"
            f"background:transparent;border:none;")
        lay.addWidget(tlbl)

        mlbl = QLabel(message); mlbl.setWordWrap(True); mlbl.setAlignment(Qt.AlignCenter)
        mlbl.setStyleSheet(
            f"font-size:13px;color:{TEXT2};background:transparent;border:none;")
        lay.addWidget(mlbl)
        lay.addSpacing(14)

        btn_ok = QPushButton("OK"); btn_ok.setObjectName("btn_primary")
        btn_ok.setFixedHeight(44); btn_ok.setCursor(Qt.PointingHandCursor)
        btn_ok.clicked.connect(self.accept)
        brow = QHBoxLayout(); brow.addStretch(1); brow.addWidget(btn_ok, 2); brow.addStretch(1)
        lay.addLayout(brow)
        outer.addWidget(container)

    @staticmethod
    def show_info(parent, title, message, icon="ℹ️"):
        AlertDialog(parent, title, message, icon).exec_()


class MetricCard(QFrame):
    def __init__(self, title, value="R$ 0,00", icon="💰", sub="", color=ORANGE, parent=None):
        super().__init__(parent)
        self.setObjectName("card")
        self.setMinimumHeight(110)
        lay = QVBoxLayout(self)
        lay.setContentsMargins(20, 18, 20, 18)
        lay.setSpacing(6)

        top = QHBoxLayout()
        icon_lbl = QLabel(icon)
        icon_lbl.setStyleSheet(f"font-size:22px;")
        top.addWidget(icon_lbl)
        top.addStretch()
        if sub:
            sub_lbl = QLabel(sub)
            sub_lbl.setObjectName("metric_sub")
            top.addWidget(sub_lbl)
        lay.addLayout(top)

        self.val_lbl = QLabel(value)
        self.val_lbl.setObjectName("metric_val")
        self.val_lbl.setStyleSheet(f"font-size:24px;font-weight:800;color:{color};")
        lay.addWidget(self.val_lbl)

        title_lbl = QLabel(title)
        title_lbl.setObjectName("metric_label")
        lay.addWidget(title_lbl)

    def set_value(self, v): self.val_lbl.setText(v)


class SearchBar(QLineEdit):
    def __init__(self, placeholder="Buscar...", parent=None):
        super().__init__(parent)
        self.setObjectName("search_bar")
        self.setPlaceholderText(placeholder)
        self.setMinimumHeight(38)


class SectionHeader(QWidget):
    def __init__(self, title, subtitle="", parent=None):
        super().__init__(parent)
        lay = QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 8)
        lay.setSpacing(2)
        t = make_label(title, size=20, bold=True)
        lay.addWidget(t)
        if subtitle:
            s = make_label(subtitle, size=12, color=TEXT3)
            lay.addWidget(s)


class BarChart(QWidget):
    """Simple painted bar chart."""
    def __init__(self, data=None, labels=None, parent=None):
        super().__init__(parent)
        self.data = data or []
        self.labels = labels or []
        self.setMinimumHeight(160)

    def set_data(self, data, labels):
        self.data = data; self.labels = labels
        self.update()

    def paintEvent(self, e):
        if not self.data: return
        p = QPainter(self); p.setRenderHint(QPainter.Antialiasing)
        w = self.width(); h = self.height()
        n = len(self.data); max_v = max(self.data) if self.data else 1
        if max_v == 0: max_v = 1
        bar_w = max(12, (w - n * 8) // n)
        spacing = (w - n * bar_w) // (n + 1)
        label_h = 18
        chart_h = h - label_h - 10

        for i, v in enumerate(self.data):
            bh = int(v / max_v * chart_h) if max_v > 0 else 0
            x = spacing + i * (bar_w + spacing)
            y = h - label_h - bh

            # Gradient bar
            grad = QLinearGradient(x, y, x, y + bh)
            grad.setColorAt(0, QColor(ORANGE))
            grad.setColorAt(1, QColor(ORANGE_D))
            path = QPainterPath()
            r = min(4, bar_w // 2)
            path.addRoundedRect(x, y, bar_w, bh, r, r)
            p.fillPath(path, QBrush(grad))

            # Label
            if i < len(self.labels):
                p.setPen(QColor(TEXT3))
                p.setFont(QFont("Segoe UI", 8))
                p.drawText(QRect(int(x), h - label_h, bar_w, label_h),
                           Qt.AlignCenter, str(self.labels[i]))


# ═══════════════════════════════════════════════════════════════════
#  LOGIN WINDOW
# ═══════════════════════════════════════════════════════════════════
class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.dm = DataManager()
        self._needs_pin = not _is_activated()
        self.setWindowTitle("Binc CMS v2 — Login")
        self.setFixedSize(440, 540)
        self.setWindowFlags(Qt.FramelessWindowHint)
        self.setStyleSheet(f"QWidget{{ background:{CARD}; }} " + QSS)
        self._dp = None; self._mw = None
        self._build()

    def _build(self):
        lay = QVBoxLayout(self)
        lay.setContentsMargins(48, 44, 48, 44)
        lay.setSpacing(0)

        # Logo area
        logo_row = QHBoxLayout()
        logo_box = QLabel("B")
        logo_box.setFixedSize(44, 44)
        logo_box.setAlignment(Qt.AlignCenter)
        logo_box.setStyleSheet(f"""background:qlineargradient(x1:0,y1:0,x2:1,y2:1,stop:0 {ORANGE},stop:1 {ORANGE_D});
            border-radius:12px; color:white; font-size:22px; font-weight:800;""")
        logo_row.addWidget(logo_box)
        txt_col = QVBoxLayout()
        txt_col.setSpacing(0)
        t1 = QLabel("Binc CMS")
        t1.setStyleSheet(f"font-size:18px;font-weight:800;color:{TEXT};")
        t2 = QLabel("v2 · SISTEMA DE GESTÃO")
        t2.setStyleSheet(f"font-size:10px;color:{TEXT3};letter-spacing:1.5px;")
        txt_col.addWidget(t1); txt_col.addWidget(t2)
        logo_row.addLayout(txt_col); logo_row.addStretch()
        lay.addLayout(logo_row)
        lay.addSpacing(36)

        h = QLabel("Entrar na conta")
        h.setStyleSheet(f"font-size:22px;font-weight:800;color:{TEXT};")
        lay.addWidget(h)
        s = QLabel("Acesse sua conta para continuar")
        s.setStyleSheet(f"font-size:13px;color:{TEXT2};margin-bottom:20px;")
        lay.addWidget(s)
        lay.addSpacing(20)

        # PIN field
        if self._needs_pin:
            pin_lbl = QLabel("PIN de Ativação")
            pin_lbl.setStyleSheet(f"font-size:11px;font-weight:700;color:{TEXT2};letter-spacing:0.8px;")
            lay.addWidget(pin_lbl)
            lay.addSpacing(4)
            self.pin_e = QLineEdit(); self.pin_e.setEchoMode(QLineEdit.Password)
            self.pin_e.setPlaceholderText("PIN de 4 dígitos")
            self.pin_e.setFixedHeight(44)
            lay.addWidget(self.pin_e)
            lay.addSpacing(12)

        # User
        u_lbl = QLabel("Usuário")
        u_lbl.setStyleSheet(f"font-size:11px;font-weight:700;color:{TEXT2};letter-spacing:0.8px;")
        lay.addWidget(u_lbl)
        lay.addSpacing(4)
        self.ue = QLineEdit(); self.ue.setPlaceholderText("Digite seu usuário")
        self.ue.setFixedHeight(44)
        lay.addWidget(self.ue)
        lay.addSpacing(12)

        # Password
        p_lbl = QLabel("Senha")
        p_lbl.setStyleSheet(f"font-size:11px;font-weight:700;color:{TEXT2};letter-spacing:0.8px;")
        lay.addWidget(p_lbl)
        lay.addSpacing(4)
        self.pe = QLineEdit(); self.pe.setEchoMode(QLineEdit.Password)
        self.pe.setPlaceholderText("Digite sua senha")
        self.pe.setFixedHeight(44)
        self.pe.returnPressed.connect(self._do_login)
        lay.addWidget(self.pe)
        lay.addSpacing(8)

        # Error
        self.err = QLabel("")
        self.err.setStyleSheet(f"color:{ERROR};font-size:12px;font-weight:600;")
        self.err.setAlignment(Qt.AlignCenter)
        lay.addWidget(self.err)
        lay.addSpacing(6)

        # Button
        btn = QPushButton("Entrar no Sistema")
        btn.setObjectName("btn_primary")
        btn.setFixedHeight(46)
        btn.setCursor(Qt.PointingHandCursor)
        btn.clicked.connect(self._do_login)
        btn.setStyleSheet(f"""QPushButton{{background:qlineargradient(x1:0,y1:0,x2:1,y2:0,
            stop:0 {ORANGE},stop:1 {ORANGE_D});color:white;border:none;
            border-radius:12px;font-size:14px;font-weight:700;}}
            QPushButton:hover{{opacity:0.9;background:{ORANGE_D};}}""")
        lay.addWidget(btn)
        lay.addStretch()

        # Close drag
        close_row = QHBoxLayout()
        close_row.addStretch()
        cl = QPushButton("✕ Fechar")
        cl.setStyleSheet(f"color:{TEXT3};background:none;border:none;font-size:12px;cursor:pointer;")
        cl.setCursor(Qt.PointingHandCursor)
        cl.clicked.connect(QApplication.quit)
        close_row.addWidget(cl)
        lay.addLayout(close_row)

    def _do_login(self):
        u = self.ue.text().strip(); p = self.pe.text()
        if not u or not p:
            self.err.setText("Preencha usuário e senha."); return
        if self._needs_pin:
            pin = self.pin_e.text().strip() if hasattr(self,'pin_e') else ""
            if pin != _PIN_CODE:
                self.err.setText("PIN incorreto."); return
        user = self.dm.authenticate(u, p)
        if user:
            if self._needs_pin: _activate_machine()
            self._mw = MainWindow(self.dm, user); self._mw.show()
            scr = QApplication.instance().primaryScreen().geometry()
            self._mw.move((scr.width()-self._mw.width())//2, (scr.height()-self._mw.height())//2)
            self.close()
        else:
            self.err.setText("Usuário ou senha incorretos.")

    def mousePressEvent(self, e):
        if e.button()==Qt.LeftButton: self._dp=e.globalPos()-self.pos()
    def mouseMoveEvent(self, e):
        if e.buttons()==Qt.LeftButton and self._dp: self.move(e.globalPos()-self._dp)


# ═══════════════════════════════════════════════════════════════════
#  MAIN WINDOW
# ═══════════════════════════════════════════════════════════════════
class MainWindow(QMainWindow):
    def __init__(self, dm, user):
        super().__init__()
        self.dm = dm; self.user = user
        self.is_admin = (user.get("role") == "admin")
        self.setWindowTitle(f"Binc CMS v2 — {user.get('name','')}")
        self.resize(1340, 820); self.setMinimumSize(1100, 680)
        self._build()

    def _build(self):
        root = QWidget(); root.setObjectName("root_bg")
        self.setCentralWidget(root)
        ml = QHBoxLayout(root); ml.setContentsMargins(0,0,0,0); ml.setSpacing(0)

        # ── Sidebar ──────────────────────────────────────────────
        self.sidebar = QWidget(); self.sidebar.setObjectName("sidebar")
        self.sidebar.setFixedWidth(240)
        sl = QVBoxLayout(self.sidebar); sl.setContentsMargins(12,16,12,12); sl.setSpacing(2)

        # Logo
        logo_row = QHBoxLayout(); logo_row.setContentsMargins(8,4,8,12)
        logo_box = QLabel("B")
        logo_box.setFixedSize(36, 36); logo_box.setAlignment(Qt.AlignCenter)
        logo_box.setStyleSheet(f"""background:qlineargradient(x1:0,y1:0,x2:1,y2:1,
            stop:0 {ORANGE},stop:1 {ORANGE_D});border-radius:10px;
            color:white;font-size:18px;font-weight:800;""")
        logo_row.addWidget(logo_box)
        txt_c = QVBoxLayout(); txt_c.setSpacing(0)
        t1 = QLabel("Binc CMS"); t1.setObjectName("logo_title"); txt_c.addWidget(t1)
        t2 = QLabel("GESTÃO v2"); t2.setObjectName("logo_sub"); txt_c.addWidget(t2)
        logo_row.addLayout(txt_c); logo_row.addStretch()
        sl.addLayout(logo_row)
        sl.addWidget(make_divider())
        sl.addSpacing(6)

        # Nav items
        self._stack = QStackedWidget()
        self._tabs = []  # (label, widget)
        self._btns = []

        def add_tab(label, widget, admin_only=False, icon=""):
            if admin_only and not self.is_admin: return
            idx = self._stack.count()
            self._stack.addWidget(widget)
            self._tabs.append((label, widget))
            btn = QPushButton(f"  {icon}  {label}" if icon else f"  {label}")
            btn.setObjectName("nav_btn"); btn.setProperty("idx", idx)
            btn.setMinimumHeight(40); btn.setCheckable(False)
            btn.setCursor(Qt.PointingHandCursor)
            btn.clicked.connect(lambda _, i=idx: self._go(i))
            sl.addWidget(btn); self._btns.append((btn, idx))

        def section(text):
            lbl = QLabel(text); lbl.setObjectName("section_label")
            sl.addWidget(lbl)

        # Create tabs
        self.t_dash = DashboardTab(self.dm)
        self.t_venda = SalesTab(self.dm, self.user)
        self.t_prod = ProductsTab(self.dm, self.user)
        self.t_hist = HistoryTab(self.dm, self.user)
        self.t_cust = CustomersTab(self.dm)
        self.t_trocas = TrocasTab(self.dm)
        self.t_faltas = FaltasTab(self.dm)
        self.t_rep = ReportsTab(self.dm)
        self.t_users = UsersTab(self.dm) if self.is_admin else None
        self.t_ia = BincIATab(self.dm)

        add_tab("Dashboard", self.t_dash, icon="📊")
        add_tab("Nova Venda", self.t_venda, icon="🛒")
        add_tab("Produtos", self.t_prod, icon="📦")
        add_tab("Histórico", self.t_hist, icon="📋")
        add_tab("Clientes", self.t_cust, icon="👥")
        section("Suporte & Gestão")
        add_tab("Trocas / Avarias", self.t_trocas, icon="🔄")
        add_tab("Lista de Faltas", self.t_faltas, icon="📝")
        add_tab("Relatórios", self.t_rep, icon="📈")
        if self.t_users:
            add_tab("Usuários", self.t_users, admin_only=True, icon="👤")
        section("Inteligência")
        add_tab("Binc IA", self.t_ia, icon="🤖")

        sl.addStretch()
        sl.addWidget(make_divider())

        # Bottom actions
        usr_lbl = QLabel(f"  {self.user.get('name','')}")
        usr_lbl.setStyleSheet(f"font-size:13px;font-weight:600;color:{TEXT};padding:6px 0;")
        role_lbl = QLabel(f"  {'Administrador' if self.is_admin else 'Operador'}")
        role_lbl.setStyleSheet(f"font-size:11px;color:{TEXT3};")
        sl.addWidget(usr_lbl); sl.addWidget(role_lbl)
        sl.addSpacing(6)

        btn_cfg = QPushButton("  ⚙️  Configurações")
        btn_cfg.setObjectName("nav_btn"); btn_cfg.setMinimumHeight(40)
        btn_cfg.setCursor(Qt.PointingHandCursor)
        btn_cfg.clicked.connect(self._open_settings)
        sl.addWidget(btn_cfg)

        btn_out = QPushButton("  🚪  Sair do Sistema")
        btn_out.setObjectName("nav_btn"); btn_out.setMinimumHeight(40)
        btn_out.setCursor(Qt.PointingHandCursor)
        btn_out.clicked.connect(self._logout)
        btn_out.setStyleSheet(f"QPushButton#nav_btn{{color:{ERROR};}} QPushButton#nav_btn:hover{{background:#FEF2F2;color:{ERROR};}}")
        sl.addWidget(btn_out)

        ml.addWidget(self.sidebar)
        ml.addWidget(self._stack, 1)

        # Status bar
        sb = QStatusBar(); self.setStatusBar(sb)
        sb.showMessage(f"  Binc CMS v2  \u00b7  {self.user.get('name','')}  \u00b7  {DATA_FILE}  \u00b7  {datetime.now().strftime('%d/%m/%Y %H:%M')}")

        # Shortcuts
        QShortcut(QKeySequence("F11"), self, self.toggleFullScreen)
        QShortcut(QKeySequence("Esc"), self, self.showNormal)

        # Start on dashboard
        self._go(0)

    def _go(self, idx):
        self._stack.setCurrentIndex(idx)
        for btn, i in self._btns:
            if i == idx:
                btn.setObjectName("nav_btn_active")
            else:
                btn.setObjectName("nav_btn")
            btn.style().unpolish(btn); btn.style().polish(btn)
        # Refresh active
        w = self._stack.currentWidget()
        if hasattr(w, "refresh"): QTimer.singleShot(80, w.refresh)

    def toggleFullScreen(self):
        if self.isFullScreen(): self.showNormal()
        else: self.showFullScreen()

    def _open_settings(self):
        dlg = SettingsDialog(self, self.dm)
        dlg.exec_()

    def _logout(self):
        if ConfirmDialog.ask(self, "Sair do Sistema",
                             "Tem certeza que deseja sair?", "🚪"):
            self.close()
            win = LoginWindow(); win.show()
            scr = QApplication.instance().primaryScreen().geometry()
            win.move((scr.width()-win.width())//2,(scr.height()-win.height())//2)


# ═══════════════════════════════════════════════════════════════════
#  DASHBOARD TAB
# ═══════════════════════════════════════════════════════════════════
class DashboardTab(QWidget):
    def __init__(self, dm, parent=None):
        super().__init__(parent); self.dm = dm; self._build()

    def _build(self):
        sl = QVBoxLayout(self); sl.setContentsMargins(0,0,0,0)
        scroll = QScrollArea(); scroll.setWidgetResizable(True)
        inner = QWidget(); lay = QVBoxLayout(inner)
        lay.setContentsMargins(28,24,28,24); lay.setSpacing(20)

        # Header
        hdr = QHBoxLayout()
        hdr.addWidget(SectionHeader("Visão Geral", "Dashboard resumido do negócio"))
        hdr.addStretch()
        hdr.setSpacing(10)
        lay.addLayout(hdr)

        # Metric cards (3 cols)
        grid = QGridLayout(); grid.setSpacing(16)
        self.mc_revenue = MetricCard("Faturamento (Mês)", "R$ 0,00", "💰", "Este mês", ORANGE)
        self.mc_today   = MetricCard("Vendas de Hoje",    "R$ 0,00", "🛒", "Hoje",     INFO)
        self.mc_stock   = MetricCard("Estoque Crítico",   "0 itens", "⚠️", "Atenção",  ERROR)
        grid.addWidget(self.mc_revenue, 0, 0)
        grid.addWidget(self.mc_today,   0, 1)
        grid.addWidget(self.mc_stock,   0, 2)
        lay.addLayout(grid)

        # Chart + quick actions row
        row2 = QHBoxLayout(); row2.setSpacing(16)

        # Chart card
        chart_card = make_card()
        cl = QVBoxLayout(chart_card); cl.setContentsMargins(20,18,20,18); cl.setSpacing(10)
        cl.addWidget(make_label("Volume de Vendas — 7 Dias", 14, bold=True))
        cl.addWidget(make_label("Distribuição diária (excluindo cancelamentos)", 11, color=TEXT3))
        self.chart = BarChart(); self.chart.setMinimumHeight(140)
        cl.addWidget(self.chart, 1)
        row2.addWidget(chart_card, 3)

        # Quick actions card
        qa_card = make_card(); qa_card.setMinimumWidth(220)
        ql = QVBoxLayout(qa_card); ql.setContentsMargins(20,18,20,18); ql.setSpacing(10)
        ql.addWidget(make_label("Ações Rápidas", 13, bold=True))
        actions = [("📥 Buscar Produto", None), ("🛒 Nova Venda", None),
                   ("📋 Ver Histórico", None), ("📝 Lista de Faltas", None)]
        for txt, _ in actions:
            b = QPushButton(txt); b.setObjectName("btn_secondary")
            b.setFixedHeight(36); b.setCursor(Qt.PointingHandCursor)
            ql.addWidget(b)
        ql.addStretch()
        row2.addWidget(qa_card, 2)
        lay.addLayout(row2)

        # Recent sales table
        sales_card = make_card()
        scl = QVBoxLayout(sales_card); scl.setContentsMargins(0,0,0,0); scl.setSpacing(0)
        th = QWidget(); thl = QHBoxLayout(th)
        thl.setContentsMargins(20,16,20,12)
        thl.addWidget(make_label("Vendas Recentes", 14, bold=True))
        thl.addStretch()
        scl.addWidget(th); scl.addWidget(make_divider())

        self.tbl = QTableWidget(0, 6)
        self.tbl.setHorizontalHeaderLabels(["ID","Data/Hora","Cliente","Itens","Status","Valor"])
        self.tbl.horizontalHeader().setSectionResizeMode(2, QHeaderView.Stretch)
        self.tbl.horizontalHeader().setSectionResizeMode(1, QHeaderView.ResizeToContents)
        self.tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.tbl.verticalHeader().setVisible(False)
        self.tbl.setShowGrid(False)
        self.tbl.setAlternatingRowColors(False)
        self.tbl.setSelectionBehavior(QAbstractItemView.SelectRows)
        scl.addWidget(self.tbl, 1)
        lay.addWidget(sales_card)

        scroll.setWidget(inner)
        sl.addWidget(scroll)

    def refresh(self):
        today = date.today().isoformat(); this_month = today[:7]
        sales = self.dm.get_sales()
        ok_sales = [s for s in sales if s.get("status","") != "cancelada"]
        rev_month = sum(s.get("total",0) for s in ok_sales if s.get("date","")[:7] == this_month)
        rev_today = sum(s.get("total",0) for s in ok_sales if s.get("date","")[:10] == today)
        criticos = [p for p in self.dm.get_products() if p.get("stock",0) <= p.get("min_stock",2)]

        self.mc_revenue.set_value(fmtR(rev_month))
        self.mc_today.set_value(fmtR(rev_today))
        self.mc_stock.set_value(f"{len(criticos)} itens")

        # Chart (7 days)
        from datetime import timedelta as td
        vals = []; labels = []
        for i in range(6, -1, -1):
            d = (date.today() - td(days=i)).isoformat()
            day_sales = [s for s in ok_sales if s.get("date","")[:10] == d]
            vals.append(sum(s.get("total",0) for s in day_sales))
            labels.append(d[-5:].replace("-","/"))
        self.chart.set_data(vals, labels)

        # Recent sales table
        recent = sorted(sales, key=lambda x: x.get("date",""), reverse=True)[:10]
        self.tbl.setRowCount(len(recent)); self.tbl.verticalHeader().setDefaultSectionSize(40)
        for r, s in enumerate(recent):
            items = [
                s.get("id","")[:8],
                s.get("date","")[:16].replace("T"," "),
                s.get("customer_name","Consumidor Final"),
                str(len(s.get("items",[]))) + " prod.",
                s.get("status","concluida"),
                fmtR(s.get("total",0)),
            ]
            for c, v in enumerate(items):
                it = QTableWidgetItem(v)
                if c == 0: it.setForeground(QColor(ORANGE))
                if c == 4:
                    it.setForeground(QColor(SUCCESS if v=="concluida" else ERROR))
                if c == 5:
                    it.setForeground(QColor(ORANGE))
                    it.setTextAlignment(Qt.AlignRight | Qt.AlignVCenter)
                self.tbl.setItem(r, c, it)


# ═══════════════════════════════════════════════════════════════════
#  PRODUCTS TAB
# ═══════════════════════════════════════════════════════════════════
class ProductsTab(QWidget):
    def __init__(self, dm, user=None, parent=None):
        super().__init__(parent); self.dm = dm; self.user = user or {}
        self.is_admin = self.user.get("role") == "admin"
        self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(28,24,28,24); lay.setSpacing(16)

        # Header
        hdr = QHBoxLayout()
        hdr.addWidget(SectionHeader("Produtos", "Catálogo e controle de estoque"))
        hdr.addStretch()
        btn_add = make_btn("+ Novo Produto", "primary")
        btn_add.clicked.connect(self._add)
        btn_add.setFixedHeight(38)
        hdr.addWidget(btn_add)
        lay.addLayout(hdr)

        # Toolbar
        bar = QHBoxLayout(); bar.setSpacing(10)
        self.search = SearchBar("Buscar produto, código, categoria...")
        self.search.textChanged.connect(self._filter)
        bar.addWidget(self.search, 1)
        self.cat_filter = QComboBox(); self.cat_filter.setFixedHeight(38)
        self.cat_filter.addItem("Todas as categorias")
        self.cat_filter.currentTextChanged.connect(self._filter)
        bar.addWidget(self.cat_filter)
        lay.addLayout(bar)

        # Table
        card = make_card(); cl = QVBoxLayout(card); cl.setContentsMargins(0,0,0,0)
        self.tbl = QTableWidget(0, 7)
        self.tbl.setHorizontalHeaderLabels(["Código","Nome","Categoria","Estoque","Mínimo","Preço Venda","Ações"])
        self.tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.tbl.verticalHeader().setVisible(False)
        self.tbl.setShowGrid(False); self.tbl.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.tbl.verticalHeader().setDefaultSectionSize(44)
        
        self.tbl.setColumnWidth(0, 120)
        self.tbl.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.tbl.setColumnWidth(2, 170)
        self.tbl.setColumnWidth(3, 96)
        self.tbl.setColumnWidth(4, 96)
        self.tbl.setColumnWidth(5, 120)
        
        self.tbl.horizontalHeader().setSectionResizeMode(6, QHeaderView.Fixed)
        self.tbl.setColumnWidth(6, 110)
        cl.addWidget(self.tbl)
        lay.addWidget(card, 1)

    def _populate_cats(self):
        cats = sorted(set(p.get("category","") for p in self.dm.get_products() if p.get("category")))
        self.cat_filter.blockSignals(True)
        self.cat_filter.clear()
        self.cat_filter.addItem("Todas as categorias")
        for c in cats: self.cat_filter.addItem(c)
        self.cat_filter.blockSignals(False)

    def refresh(self):
        self._populate_cats(); self._filter()

    def _filter(self):
        txt = self.search.text().lower()
        cat = self.cat_filter.currentText()
        prods = self.dm.get_products()
        if txt: prods = [p for p in prods if txt in p.get("name","").lower() or txt in p.get("code","").lower() or txt in p.get("category","").lower()]
        if cat and cat != "Todas as categorias": prods = [p for p in prods if p.get("category","") == cat]
        self.tbl.setRowCount(len(prods))
        for r, p in enumerate(prods):
            stk = p.get("stock", 0); mn = p.get("min_stock", 2)
            data = [p.get("code",""), p.get("name",""), p.get("category",""),
                    str(stk), str(mn), fmtR(p.get("sale_price",0)), ""]
            for c, v in enumerate(data):
                if c == 6: continue
                it = QTableWidgetItem(v)
                if c == 3 and stk <= mn: it.setForeground(QColor(ERROR))
                if c in [3, 4]: it.setTextAlignment(Qt.AlignCenter)
                if c == 5: 
                    it.setForeground(QColor(ORANGE))
                    it.setTextAlignment(Qt.AlignCenter)
                self.tbl.setItem(r, c, it)
            # Actions — icon buttons
            w = QWidget(); wl = QHBoxLayout(w); wl.setContentsMargins(0,0,0,0); wl.setSpacing(6); wl.setAlignment(Qt.AlignCenter)
            pid = p["id"]
            be = QPushButton("✏️"); be.setObjectName("btn_icon_edit"); be.setFixedSize(28,28)
            be.setToolTip("Editar produto"); be.setCursor(Qt.PointingHandCursor)
            be.clicked.connect(lambda _, i=pid: self._edit(i))
            bd = QPushButton("🗑"); bd.setObjectName("btn_icon_del"); bd.setFixedSize(28,28)
            bd.setToolTip("Excluir produto"); bd.setCursor(Qt.PointingHandCursor)
            bd.clicked.connect(lambda _, i=pid: self._delete(i))
            wl.addWidget(be); wl.addWidget(bd)
            self.tbl.setCellWidget(r, 6, w)

    def _add(self):
        dlg = ProductDialog(self, self.dm)
        if dlg.exec_() == QDialog.Accepted: self.refresh()

    def _edit(self, pid):
        p = self.dm.get_product_by_id(pid)
        if not p: return
        dlg = ProductDialog(self, self.dm, p)
        if dlg.exec_() == QDialog.Accepted: self.refresh()

    def _delete(self, pid):
        if ConfirmDialog.ask(self, "Excluir Produto",
                             "Tem certeza? Esta ação não pode ser desfeita.",
                             "🗑️", danger=True):
            self.dm.delete_product(pid); self.refresh()


class ProductDialog(ModernFormDialog):
    def __init__(self, parent, dm, product=None):
        super().__init__(parent, min_width=560)
        self.dm = dm; self.product = product
        self.add_title_bar("Cadastro de Produto" if not product else "Editar Produto")
        self._build()

    def _build(self):
        lay = self.main_lay
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setObjectName("prod_scroll")
        scroll.setStyleSheet("QScrollArea#prod_scroll { background:transparent; border:none; } QScrollArea#prod_scroll > QWidget { background:transparent; }")
        scroll.setMinimumHeight(440)
        
        inner = QWidget()
        inner.setObjectName("prod_inner")
        inner.setStyleSheet("QWidget#prod_inner { background:transparent; }")
        form = QFormLayout(inner)
        form.setSpacing(12)
        
        self.e_code = QLineEdit(self.product.get("code","") if self.product else "")
        self.e_code.setPlaceholderText("Codigo interno ou EAN — leia o codigo de barras aqui")

        self.cb_gtin = QComboBox()
        self.cb_gtin.addItem("Sem busca por API")
        self.cb_gtin.addItem("Buscar por API GTIN")
        btn_gtin = make_btn("Consultar GTIN", "secondary")
        hl_gtin = QHBoxLayout(); hl_gtin.setContentsMargins(0,0,0,0)
        hl_gtin.addWidget(self.cb_gtin, 1)
        hl_gtin.addWidget(btn_gtin)

        self.e_name = QLineEdit(self.product.get("name","") if self.product else "")
        self.e_cat  = QLineEdit(self.product.get("category","") if self.product else "")
        self.e_brand = QLineEdit(self.product.get("brand","") if self.product else "")
        
        self.e_unidade = QComboBox()
        self.e_unidade.addItems(["UN", "PC", "CX", "KG", "LT", "M", "JG"])
        
        self.e_cost = QDoubleSpinBox(); self.e_cost.setRange(0,9999999); self.e_cost.setPrefix("R$ ")
        self.e_cost.setValue(self.product.get("cost_price",0) if self.product else 0)
        
        self.e_sale = QDoubleSpinBox(); self.e_sale.setRange(0,9999999); self.e_sale.setPrefix("R$ ")
        self.e_sale.setValue(self.product.get("sale_price",0) if self.product else 0)
        
        self.e_stock = QSpinBox(); self.e_stock.setRange(0,99999)
        self.e_stock.setValue(self.product.get("stock",0) if self.product else 0)
        
        self.e_min = QSpinBox(); self.e_min.setRange(0,9999)
        self.e_min.setValue(self.product.get("min_stock",2) if self.product else 2)
        
        self.e_desc = QLineEdit(self.product.get("description","") if self.product else "")
        
        self.e_ncm = QLineEdit(self.product.get("ncm","") if self.product else "")
        self.e_ncm.setPlaceholderText("Ex: 87089990 (8 digitos)")
        
        self.e_cfop = QLineEdit(self.product.get("cfop","5102") if self.product else "5102")
        
        self.e_csosn = QComboBox()
        self.e_csosn.addItem("400 - Nao tributada (Simples)")
        self.e_csosn.addItem("102 - Tributada pelo Simples")
        self.e_csosn.addItem("500 - ICMS cobrado ant.")
        
        self.e_origem = QComboBox()
        self.e_origem.addItem("0 - Nacional")
        self.e_origem.addItem("1 - Estrangeira Importacao")
        self.e_origem.addItem("2 - Estrangeira Interno")
        
        self.chk_markup = QCheckBox("Preco Venda = Custo + 30%")
        self.chk_markup.setStyleSheet(f"color:{TEXT2}; font-weight:bold;")
        
        for w in [self.e_code, self.cb_gtin, self.e_name, self.e_cat, self.e_brand, self.e_unidade,
                  self.e_cost, self.e_sale, self.e_stock, self.e_min, self.e_desc, self.e_ncm,
                  self.e_cfop, self.e_csosn, self.e_origem, btn_gtin]:
            if isinstance(w, QWidget): w.setFixedHeight(38)
            
        form.addRow("Codigo *", self.e_code)
        form.addRow("API GTIN", hl_gtin)
        form.addRow("Nome *", self.e_name)
        form.addRow("Categoria", self.e_cat)
        form.addRow("Marca", self.e_brand)
        form.addRow("Unidade", self.e_unidade)
        form.addRow("Custo", self.e_cost)
        form.addRow("Preco Venda *", self.e_sale)
        form.addRow("Estoque", self.e_stock)
        form.addRow("Minimo", self.e_min)
        form.addRow("Descricao", self.e_desc)
        form.addRow("NCM (Fiscal)", self.e_ncm)
        form.addRow("CFOP (Fiscal)", self.e_cfop)
        form.addRow("CSOSN (Fiscal)", self.e_csosn)
        form.addRow("Origem (Fiscal)", self.e_origem)
        form.addRow("Markup", self.chk_markup)
        
        scroll.setWidget(inner)
        lay.addWidget(scroll, 1)
        lay.addWidget(make_divider())
        
        brow = QHBoxLayout(); brow.addStretch()
        bcancel = make_btn("Cancelar","secondary"); bcancel.clicked.connect(self.reject)
        bsave   = make_btn("Salvar Produto","primary"); bsave.clicked.connect(self._save)
        brow.addWidget(bcancel); brow.addWidget(bsave)
        lay.addLayout(brow)

    def _save(self):
        name = self.e_name.text().strip()
        if not name: QMessageBox.warning(self,"Aviso","Nome obrigatório."); return
        code = self.e_code.text().strip()
        data = {
            "code": code,
            "barcode": code,
            "name": name,
            "category": self.e_cat.text().strip(), 
            "brand": self.e_brand.text().strip(),
            "cost_price": self.e_cost.value(), 
            "sale_price": self.e_sale.value(),
            "stock": self.e_stock.value(), 
            "min_stock": self.e_min.value(),
            "description": self.e_desc.text().strip(),
            "ncm": self.e_ncm.text().strip(),
            "cfop": self.e_cfop.text().strip(),
        }
        if self.product:
            data["id"] = self.product["id"]
            data["added_at"] = self.product.get("added_at","")
            self.dm.update_product(self.product["id"], data)
        else:
            self.dm.add_product(data)
        self.accept()


# ═══════════════════════════════════════════════════════════════════
#  SALES TAB (PDV)
# ═══════════════════════════════════════════════════════════════════
class SalesTab(QWidget):
    def __init__(self, dm, user, parent=None):
        super().__init__(parent); self.dm = dm; self.user = user
        self.cart = []; self.discount_pct = 0.0
        self._build()

    def _build(self):
        lay = QHBoxLayout(self); lay.setContentsMargins(0,0,0,0); lay.setSpacing(0)

        # Left: Product search
        left = QWidget(); left.setObjectName("content_bg")
        ll = QVBoxLayout(left); ll.setContentsMargins(28,24,16,24); ll.setSpacing(16)
        ll.addWidget(SectionHeader("Nova Venda", "PDV — Ponto de Venda"))

        # Search area
        srow = QHBoxLayout(); srow.setSpacing(10)
        self.search = SearchBar("🔍  Buscar produto por nome ou código...")
        self.search.returnPressed.connect(self._do_search)
        srow.addWidget(self.search, 1)
        bs = make_btn("Buscar","primary"); bs.setFixedSize(90,38)
        bs.clicked.connect(self._do_search)
        srow.addWidget(bs)
        ll.addLayout(srow)

        # Product list
        self.prod_list = QTableWidget(0, 5)
        self.prod_list.setHorizontalHeaderLabels(["Código","Nome","Estoque","Preço",""])
        self.prod_list.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.prod_list.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.prod_list.verticalHeader().setVisible(False); self.prod_list.setShowGrid(False)
        self.prod_list.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.prod_list.verticalHeader().setDefaultSectionSize(40)
        ll.addWidget(self.prod_list, 1)
        lay.addWidget(left, 3)

        # Separator
        sep = QFrame(); sep.setFrameShape(QFrame.VLine)
        sep.setStyleSheet(f"background:{BORDER};max-width:1px;")
        lay.addWidget(sep)

        # Right: Cart
        right = QWidget(); right.setObjectName("content_bg")
        right.setFixedWidth(360)
        rl = QVBoxLayout(right); rl.setContentsMargins(16,24,28,24); rl.setSpacing(12)

        rl.addWidget(make_label("Carrinho", 16, bold=True))

        # Customer
        rl.addWidget(make_label("Cliente", 11, color=TEXT2))
        self.cust_combo = QComboBox(); self.cust_combo.setFixedHeight(38)
        self.cust_combo.addItem("Consumidor Final")
        rl.addWidget(self.cust_combo)

        # Cart table
        self.cart_tbl = QTableWidget(0, 4)
        self.cart_tbl.setHorizontalHeaderLabels(["Produto","Qtd","Preço",""])
        self.cart_tbl.horizontalHeader().setSectionResizeMode(0, QHeaderView.Stretch)
        self.cart_tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.cart_tbl.verticalHeader().setVisible(False); self.cart_tbl.setShowGrid(False)
        self.cart_tbl.verticalHeader().setDefaultSectionSize(38)
        rl.addWidget(self.cart_tbl, 1)

        # Discount
        disc_row = QHBoxLayout()
        disc_row.addWidget(make_label("Desconto %:", 12))
        self.disc_spin = QDoubleSpinBox(); self.disc_spin.setRange(0,100); self.disc_spin.setFixedSize(80,34)
        self.disc_spin.setSuffix("%"); self.disc_spin.valueChanged.connect(self._update_total)
        disc_row.addWidget(self.disc_spin); disc_row.addStretch()
        rl.addLayout(disc_row)

        # Payment
        pay_row = QHBoxLayout()
        pay_row.addWidget(make_label("Pagamento:", 12))
        self.pay_combo = QComboBox(); self.pay_combo.setFixedHeight(34)
        for pm in ["Dinheiro","PIX","Cartão Débito","Cartão Crédito","Crediário"]:
            self.pay_combo.addItem(pm)
        pay_row.addWidget(self.pay_combo, 1)
        rl.addLayout(pay_row)

        rl.addWidget(make_divider())

        # Total
        total_row = QHBoxLayout()
        total_row.addWidget(make_label("Total:", 14, bold=True))
        self.lbl_total = make_label("R$ 0,00", 20, bold=True, color=ORANGE)
        total_row.addStretch(); total_row.addWidget(self.lbl_total)
        rl.addLayout(total_row)

        # Buttons
        btn_clear = make_btn("🗑  Limpar","secondary"); btn_clear.setFixedHeight(38)
        btn_clear.clicked.connect(self._clear)
        rl.addWidget(btn_clear)
        btn_fin = make_btn("✅  Finalizar Venda","primary"); btn_fin.setFixedHeight(46)
        btn_fin.clicked.connect(self._finish)
        btn_fin.setStyleSheet(f"QPushButton#btn_primary{{font-size:15px;font-weight:800;}}")
        rl.addWidget(btn_fin)
        lay.addWidget(right)

        # Load products initially
        self._load_all_products()

    def _load_all_products(self):
        prods = self.dm.get_products()[:60]  # Show first 60
        self.prod_list.setRowCount(len(prods))
        for r, p in enumerate(prods):
            for c, v in enumerate([p.get("code",""), p.get("name",""), str(p.get("stock",0)), fmtR(p.get("sale_price",0))]):
                it = QTableWidgetItem(v)
                if c == 3: it.setForeground(QColor(ORANGE))
                self.prod_list.setItem(r, c, it)
            ab = QPushButton("+"); ab.setObjectName("btn_primary"); ab.setFixedSize(32,28)
            pid = p["id"]
            ab.clicked.connect(lambda _, i=pid: self._add_to_cart(i))
            self.prod_list.setCellWidget(r, 4, ab)

    def _do_search(self):
        txt = self.search.text().lower()
        prods = [p for p in self.dm.get_products()
                 if txt in p.get("name","").lower() or txt in p.get("code","").lower()
                 or txt in p.get("barcode","")]
        self.prod_list.setRowCount(len(prods))
        for r, p in enumerate(prods):
            for c, v in enumerate([p.get("code",""), p.get("name",""), str(p.get("stock",0)), fmtR(p.get("sale_price",0))]):
                it = QTableWidgetItem(v); self.prod_list.setItem(r, c, it)
            ab = QPushButton("+"); ab.setObjectName("btn_primary"); ab.setFixedSize(32,28)
            pid = p["id"]
            ab.clicked.connect(lambda _, i=pid: self._add_to_cart(i))
            self.prod_list.setCellWidget(r, 4, ab)

    def _add_to_cart(self, pid):
        p = self.dm.get_product_by_id(pid)
        if not p: return
        if p.get("stock",0) <= 0:
            AlertDialog.show_info(self, "Sem Estoque",
                f"{p['name']} está sem estoque no momento.", "⚠️")
            return
        for item in self.cart:
            if item["product_id"] == pid: item["qty"] += 1; self._update_cart_table(); return
        self.cart.append({"product_id": pid, "name": p["name"], "qty": 1,
                           "unit_price": p.get("sale_price",0)})
        self._update_cart_table()

    def _update_cart_table(self):
        self.cart_tbl.setRowCount(len(self.cart))
        for r, item in enumerate(self.cart):
            self.cart_tbl.setItem(r,0,QTableWidgetItem(item["name"][:22]))
            # Qty spinner
            sp = QSpinBox(); sp.setRange(1,999); sp.setValue(item["qty"])
            sp.setFixedHeight(30)
            idx = r
            sp.valueChanged.connect(lambda v, i=idx: self._qty_changed(i, v))
            self.cart_tbl.setCellWidget(r, 1, sp)
            pv = QTableWidgetItem(fmtR(item["unit_price"]*item["qty"]))
            pv.setForeground(QColor(ORANGE))
            self.cart_tbl.setItem(r,2,pv)
            bd = QPushButton("✕"); bd.setObjectName("btn_icon"); bd.setFixedSize(28,28)
            bd.clicked.connect(lambda _, i=idx: self._remove(i))
            self.cart_tbl.setCellWidget(r, 3, bd)
        self._update_total()

    def _qty_changed(self, idx, v):
        if 0 <= idx < len(self.cart): self.cart[idx]["qty"] = v; self._update_total()

    def _remove(self, idx):
        if 0 <= idx < len(self.cart): del self.cart[idx]; self._update_cart_table()

    def _update_total(self):
        subtotal = sum(i["unit_price"]*i["qty"] for i in self.cart)
        disc = self.disc_spin.value()
        total = subtotal * (1 - disc/100)
        self.lbl_total.setText(fmtR(total))

    def _clear(self):
        self.cart = []; self._update_cart_table()

    def _finish(self):
        if not self.cart:
            AlertDialog.show_info(self, "Carrinho Vazio",
                "Adicione produtos ao carrinho antes de finalizar.", "🛒")
            return
        subtotal = sum(i["unit_price"]*i["qty"] for i in self.cart)
        disc = self.disc_spin.value(); total = subtotal*(1-disc/100)
        sale = {
            "items": [{"product_id":i["product_id"],"name":i["name"],
                        "qty":i["qty"],"unit_price":i["unit_price"]} for i in self.cart],
            "customer_name": self.cust_combo.currentText(),
            "payment": self.pay_combo.currentText(),
            "total": total, "discount_pct": disc,
            "status": "concluida",
        }
        # Update stock
        for item in self.cart:
            p = self.dm.get_product_by_id(item["product_id"])
            if p: p["stock"] = max(0, p.get("stock",0) - item["qty"]); self.dm.update_product(p["id"],p)
        self.dm.add_sale(sale)
        AlertDialog.show_info(self, "Venda Concluída!",
            f"Venda de {fmtR(total)} registrada com sucesso.", "✅")
        self._clear()

    def refresh(self):
        self.cust_combo.clear(); self.cust_combo.addItem("Consumidor Final")
        for c in self.dm.get_customers(): self.cust_combo.addItem(c.get("name",""))


# ═══════════════════════════════════════════════════════════════════
#  HISTORY TAB
# ═══════════════════════════════════════════════════════════════════
class HistoryTab(QWidget):
    def __init__(self, dm, user, parent=None):
        super().__init__(parent); self.dm = dm; self.user = user; self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(28,24,28,24); lay.setSpacing(16)
        hdr = QHBoxLayout()
        hdr.addWidget(SectionHeader("Histórico de Vendas", "Todas as transações registradas"))
        hdr.addStretch()
        lay.addLayout(hdr)

        bar = QHBoxLayout(); bar.setSpacing(10)
        self.search = SearchBar("Buscar cliente ou ID...")
        self.search.textChanged.connect(self.refresh)
        bar.addWidget(self.search, 1)
        self.status_filter = QComboBox(); self.status_filter.setFixedHeight(38)
        self.status_filter.addItems(["Todos","concluida","cancelada"])
        self.status_filter.currentTextChanged.connect(self.refresh)
        bar.addWidget(self.status_filter)
        lay.addLayout(bar)

        card = make_card(); cl = QVBoxLayout(card); cl.setContentsMargins(0,0,0,0)
        self.tbl = QTableWidget(0, 7)
        self.tbl.setHorizontalHeaderLabels(["ID","Data/Hora","Cliente","Itens","Pagamento","Status","Valor"])
        self.tbl.horizontalHeader().setSectionResizeMode(2, QHeaderView.Stretch)
        self.tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.tbl.verticalHeader().setVisible(False); self.tbl.setShowGrid(False)
        self.tbl.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.tbl.verticalHeader().setDefaultSectionSize(42)
        self.tbl.doubleClicked.connect(self._detail)
        cl.addWidget(self.tbl)
        lay.addWidget(card, 1)

    def refresh(self):
        txt = self.search.text().lower()
        status_f = self.status_filter.currentText()
        sales = sorted(self.dm.get_sales(), key=lambda x: x.get("date",""), reverse=True)
        if txt: sales = [s for s in sales if txt in s.get("customer_name","").lower() or txt in s.get("id","")]
        if status_f != "Todos": sales = [s for s in sales if s.get("status","") == status_f]
        self.tbl.setRowCount(len(sales))
        for r, s in enumerate(sales):
            data = [s.get("id","")[:8], s.get("date","")[:16].replace("T"," "),
                    s.get("customer_name","CF"), str(len(s.get("items",[])))+" prod.",
                    s.get("payment","Dinheiro"), s.get("status",""), fmtR(s.get("total",0))]
            for c, v in enumerate(data):
                it = QTableWidgetItem(v)
                if c == 0: it.setForeground(QColor(ORANGE))
                if c == 5: it.setForeground(QColor(SUCCESS if v=="concluida" else ERROR))
                if c == 6: it.setForeground(QColor(ORANGE)); it.setTextAlignment(Qt.AlignRight|Qt.AlignVCenter)
                self.tbl.setItem(r, c, it)
            self.tbl.setProperty(f"sale_{r}", s.get("id",""))

    def _detail(self, idx):
        sales = sorted(self.dm.get_sales(), key=lambda x: x.get("date",""), reverse=True)
        try: sale = sales[idx.row()]
        except: return
        txt = f"Venda: {sale.get('id','')}\nData: {sale.get('date','')[:16]}\nCliente: {sale.get('customer_name','')}\nPagamento: {sale.get('payment','')}\n\nItens:\n"
        for item in sale.get("items",[]):
            txt += f"  • {item.get('name','')} x{item.get('qty',1)} = {fmtR(item.get('unit_price',0)*item.get('qty',1))}\n"
        txt += f"\nTotal: {fmtR(sale.get('total',0))}\nStatus: {sale.get('status','')}"
        QMessageBox.information(self,"Detalhes da Venda", txt)


# ═══════════════════════════════════════════════════════════════════
#  CUSTOMERS TAB
# ═══════════════════════════════════════════════════════════════════
class CustomersTab(QWidget):
    def __init__(self, dm, parent=None):
        super().__init__(parent); self.dm = dm; self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(28,24,28,24); lay.setSpacing(16)
        hdr = QHBoxLayout()
        hdr.addWidget(SectionHeader("Clientes", "Cadastro de clientes"))
        hdr.addStretch()
        btn_add = make_btn("+ Novo Cliente","primary"); btn_add.setFixedHeight(38)
        btn_add.clicked.connect(self._add)
        hdr.addWidget(btn_add); lay.addLayout(hdr)

        self.search = SearchBar("Buscar cliente..."); self.search.textChanged.connect(self.refresh)
        lay.addWidget(self.search)

        card = make_card(); cl = QVBoxLayout(card); cl.setContentsMargins(0,0,0,0)
        self.tbl = QTableWidget(0, 6)
        self.tbl.setHorizontalHeaderLabels(["Nome","Telefone","CPF","E-mail","Cidade","Ações"])
        self.tbl.horizontalHeader().setSectionResizeMode(0, QHeaderView.Stretch)
        self.tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.tbl.verticalHeader().setVisible(False); self.tbl.setShowGrid(False)
        self.tbl.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.tbl.verticalHeader().setDefaultSectionSize(44)
        self.tbl.horizontalHeader().setSectionResizeMode(5, QHeaderView.Fixed)
        self.tbl.setColumnWidth(5, 92)
        cl.addWidget(self.tbl); lay.addWidget(card, 1)

    def refresh(self):
        txt = self.search.text().lower()
        custs = self.dm.get_customers()
        if txt: custs = [c for c in custs if txt in c.get("name","").lower() or txt in c.get("phone","").lower()]
        self.tbl.setRowCount(len(custs))
        for r, c in enumerate(custs):
            for col, v in enumerate([c.get("name",""), c.get("phone",""), c.get("cpf",""),
                                      c.get("email",""), c.get("city",""), ""]):
                if col == 5: continue
                self.tbl.setItem(r, col, QTableWidgetItem(v))
            w = QWidget(); wl = QHBoxLayout(w); wl.setContentsMargins(0,0,0,0); wl.setSpacing(6); wl.setAlignment(Qt.AlignCenter)
            cid = c["id"]
            be = QPushButton("✏️"); be.setObjectName("btn_icon_edit"); be.setFixedSize(28,28)
            be.setToolTip("Editar cliente"); be.setCursor(Qt.PointingHandCursor)
            be.clicked.connect(lambda _, i=cid: self._edit(i))
            bd = QPushButton("🗑"); bd.setObjectName("btn_icon_del"); bd.setFixedSize(28,28)
            bd.setToolTip("Excluir cliente"); bd.setCursor(Qt.PointingHandCursor)
            bd.clicked.connect(lambda _, i=cid: self._del(i))
            wl.addWidget(be); wl.addWidget(bd)
            self.tbl.setCellWidget(r, 5, w)

    def _add(self):
        dlg = CustomerDialog(self, self.dm); dlg.exec_(); self.refresh()

    def _edit(self, cid):
        c = next((x for x in self.dm.get_customers() if x["id"]==cid),None)
        if c: CustomerDialog(self, self.dm, c).exec_(); self.refresh()

    def _del(self, cid):
        if ConfirmDialog.ask(self, "Excluir Cliente",
                             "Tem certeza que deseja excluir este cliente?",
                             "🗑️", danger=True):
            self.dm.delete_customer(cid); self.refresh()


class CustomerDialog(ModernFormDialog):
    def __init__(self, parent, dm, customer=None):
        super().__init__(parent, min_width=460); self.dm = dm; self.cust = customer
        self.add_title_bar("Novo Cliente" if not customer else "Editar Cliente")
        lay = self.main_lay
        form = QFormLayout(); form.setSpacing(10)
        self.e_name  = QLineEdit(customer.get("name","") if customer else ""); self.e_name.setFixedHeight(38)
        self.e_phone = QLineEdit(customer.get("phone","") if customer else ""); self.e_phone.setFixedHeight(38)
        self.e_cpf   = QLineEdit(customer.get("cpf","") if customer else ""); self.e_cpf.setFixedHeight(38)
        self.e_email = QLineEdit(customer.get("email","") if customer else ""); self.e_email.setFixedHeight(38)
        self.e_city  = QLineEdit(customer.get("city","") if customer else ""); self.e_city.setFixedHeight(38)
        form.addRow("Nome *:", self.e_name); form.addRow("Telefone:", self.e_phone)
        form.addRow("CPF:", self.e_cpf); form.addRow("E-mail:", self.e_email)
        form.addRow("Cidade:", self.e_city)
        lay.addLayout(form); lay.addWidget(make_divider())
        brow = QHBoxLayout(); brow.addStretch()
        bc = make_btn("Cancelar","secondary"); bc.clicked.connect(self.reject)
        bs = make_btn("Salvar","primary"); bs.clicked.connect(self._save)
        brow.addWidget(bc); brow.addWidget(bs); lay.addLayout(brow)

    def _save(self):
        name = self.e_name.text().strip()
        if not name: QMessageBox.warning(self,"Aviso","Nome obrigatório."); return
        data = {"name":name,"phone":self.e_phone.text().strip(),"cpf":self.e_cpf.text().strip(),
                "email":self.e_email.text().strip(),"city":self.e_city.text().strip()}
        if self.cust:
            data["id"] = self.cust["id"]; data["added_at"] = self.cust.get("added_at","")
            self.dm.update_customer(self.cust["id"], data)
        else: self.dm.add_customer(data)
        self.accept()


# ═══════════════════════════════════════════════════════════════════
#  TROCAS TAB
# ═══════════════════════════════════════════════════════════════════
class TrocasTab(QWidget):
    def __init__(self, dm, parent=None):
        super().__init__(parent); self.dm = dm; self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(28,24,28,24); lay.setSpacing(16)
        hdr = QHBoxLayout()
        hdr.addWidget(SectionHeader("Trocas & Avarias", "Gestão de devoluções e peças"))
        hdr.addStretch()
        btn_add = make_btn("+ Registrar","primary"); btn_add.setFixedHeight(38)
        btn_add.clicked.connect(self._add)
        hdr.addWidget(btn_add); lay.addLayout(hdr)

        self.search = SearchBar("Buscar produto..."); self.search.textChanged.connect(self.refresh)
        lay.addWidget(self.search)

        card = make_card(); cl = QVBoxLayout(card); cl.setContentsMargins(0,0,0,0)
        self.tbl = QTableWidget(0, 6)
        self.tbl.setHorizontalHeaderLabels(["Data","Produto","Motivo","Qtd","Status","Ações"])
        self.tbl.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.tbl.verticalHeader().setVisible(False); self.tbl.setShowGrid(False)
        self.tbl.verticalHeader().setDefaultSectionSize(44)
        self.tbl.horizontalHeader().setSectionResizeMode(5, QHeaderView.Fixed)
        self.tbl.setColumnWidth(5, 128)
        cl.addWidget(self.tbl); lay.addWidget(card, 1)

    def refresh(self):
        txt = self.search.text().lower()
        trocas = sorted(self.dm.get_trocas(), key=lambda x: x.get("date",""), reverse=True)
        if txt: trocas = [t for t in trocas if txt in t.get("product_name","").lower()]
        self.tbl.setRowCount(len(trocas))
        STATUS_COLORS = {"Aguardando":WARN,"Em Troca":INFO,"Resolvido":SUCCESS,"Descarte":ERROR,"Reposto":INFO}
        for r, t in enumerate(trocas):
            st = t.get("status","Aguardando")
            for c, v in enumerate([t.get("date","")[:10], t.get("product_name",""),
                                    t.get("motive",""), str(t.get("quantity",1)), st, ""]):
                if c == 5: continue
                it = QTableWidgetItem(v)
                if c == 4: it.setForeground(QColor(STATUS_COLORS.get(st, TEXT2)))
                self.tbl.setItem(r, c, it)
            w = QWidget(); wl = QHBoxLayout(w); wl.setContentsMargins(0,0,0,0); wl.setSpacing(6); wl.setAlignment(Qt.AlignCenter)
            tid = t["id"]
            bs = QPushButton("↻"); bs.setObjectName("btn_icon_edit"); bs.setFixedSize(28,28)
            bs.setToolTip("Avançar status"); bs.setCursor(Qt.PointingHandCursor)
            bs.clicked.connect(lambda _, i=tid: self._cycle_status(i))
            bd = QPushButton("✕"); bd.setObjectName("btn_icon_del"); bd.setFixedSize(28,28)
            bd.setToolTip("Remover registro"); bd.setCursor(Qt.PointingHandCursor)
            bd.clicked.connect(lambda _, i=tid: self._del(i))
            wl.addWidget(bs)
            # Descarte button
            if st in ("Aguardando","Em Troca","Resolvido"):
                bdes = QPushButton("🗑"); bdes.setObjectName("btn_icon_warn"); bdes.setFixedSize(28,28)
                bdes.setToolTip("Marcar como Descarte"); bdes.setCursor(Qt.PointingHandCursor)
                bdes.clicked.connect(lambda _, i=tid: self._descarte(i))
                wl.addWidget(bdes)
            wl.addWidget(bd)
            self.tbl.setCellWidget(r, 5, w)

    def _add(self):
        dlg = TrocaDialog(self, self.dm); dlg.exec_(); self.refresh()

    def _cycle_status(self, tid):
        trocas = self.dm.get_trocas(); t = next((x for x in trocas if x["id"]==tid),None)
        if not t: return
        states = ["Aguardando","Em Troca","Resolvido"]
        cur = t.get("status","Aguardando")
        if cur in ("Descarte","Reposto"): return
        nxt = states[(states.index(cur)+1)%len(states)] if cur in states else states[0]
        t["status"] = nxt; self.dm.save_trocas(trocas); self.refresh()

    def _descarte(self, tid):
        if not ConfirmDialog.ask(self, "Marcar como Descarte",
                                 "O valor deste item será removido\nda venda original automaticamente.",
                                 "🗑️", danger=True, confirm_text="Descartar"): return
        trocas = self.dm.get_trocas(); t = next((x for x in trocas if x["id"]==tid),None)
        if not t: return
        t["status"] = "Descarte"; self.dm.save_trocas(trocas)
        sale_id = t.get("sale_id",""); item_value = t.get("item_value",0)
        if sale_id and item_value > 0:
            try:
                sales = self.dm.get_sales()
                sale = next((s for s in sales if s.get("id")==sale_id),None)
                if sale:
                    sale["total"] = max(0, sale.get("total",0) - item_value)
                    if "adjustments" not in sale: sale["adjustments"] = []
                    sale["adjustments"].append({"type":"descarte","value":-item_value,"at":datetime.now().isoformat()})
                    self.dm.save_sales(sales)
            except: pass
        self.refresh()
        AlertDialog.show_info(self, "Descartado!",
            "Produto descartado.\nO valor foi removido da venda original.", "✅")

    def _del(self, tid):
        if ConfirmDialog.ask(self, "Remover Registro",
                             "Deseja remover este registro de troca?",
                             "🗑️", danger=True):
            t = [x for x in self.dm.get_trocas() if x["id"]!=tid]
            self.dm.save_trocas(t); self.refresh()


class TrocaDialog(ModernFormDialog):
    def __init__(self, parent, dm):
        super().__init__(parent, min_width=420); self.dm = dm
        self.add_title_bar("Registrar Troca / Avaria")
        lay = self.main_lay
        form = QFormLayout(); form.setSpacing(10)
        self.e_prod = QLineEdit(); self.e_prod.setFixedHeight(38); self.e_prod.setPlaceholderText("Nome do produto")
        self.e_qty  = QSpinBox(); self.e_qty.setRange(1,999); self.e_qty.setFixedHeight(38)
        self.e_mot  = QComboBox(); self.e_mot.setFixedHeight(38)
        self.e_mot.addItems(["Avaria","Defeito","Troca Direta","Manual"])
        self.e_obs  = QTextEdit(); self.e_obs.setMaximumHeight(70)
        form.addRow("Produto *:", self.e_prod); form.addRow("Quantidade:", self.e_qty)
        form.addRow("Motivo:", self.e_mot); form.addRow("Observações:", self.e_obs)
        lay.addLayout(form); lay.addWidget(make_divider())
        brow = QHBoxLayout(); brow.addStretch()
        bc = make_btn("Cancelar","secondary"); bc.clicked.connect(self.reject)
        bs = make_btn("Registrar","primary"); bs.clicked.connect(self._save)
        brow.addWidget(bc); brow.addWidget(bs); lay.addLayout(brow)

    def _save(self):
        name = self.e_prod.text().strip()
        if not name: QMessageBox.warning(self,"Aviso","Informe o produto."); return
        prods = self.dm.get_products()
        prod = next((p for p in prods if name.lower() in p.get("name","").lower()),None)
        self.dm.add_troca({"product_id":prod["id"] if prod else "","product_name":prod["name"] if prod else name,
                           "quantity":self.e_qty.value(),"motive":self.e_mot.currentText(),
                           "obs":self.e_obs.toPlainText(),"item_value":prod.get("sale_price",0) if prod else 0,
                           "status":"Aguardando"})
        self.accept()


# ═══════════════════════════════════════════════════════════════════
#  FALTAS TAB
# ═══════════════════════════════════════════════════════════════════
class FaltasTab(QWidget):
    def __init__(self, dm, parent=None):
        super().__init__(parent); self.dm = dm; self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(28,24,28,24); lay.setSpacing(16)
        hdr = QHBoxLayout()
        hdr.addWidget(SectionHeader("Lista de Faltas", "Itens em falta no estoque"))
        hdr.addStretch()
        btn_add = make_btn("+ Adicionar","primary"); btn_add.setFixedHeight(38)
        btn_add.clicked.connect(self._add)
        hdr.addWidget(btn_add); lay.addLayout(hdr)

        card = make_card(); cl = QVBoxLayout(card); cl.setContentsMargins(0,0,0,0)
        self.tbl = QTableWidget(0, 4)
        self.tbl.setHorizontalHeaderLabels(["Item","Urgência","Observação","Ações"])
        self.tbl.horizontalHeader().setSectionResizeMode(0, QHeaderView.Stretch)
        self.tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.tbl.verticalHeader().setVisible(False); self.tbl.setShowGrid(False)
        self.tbl.verticalHeader().setDefaultSectionSize(44)
        self.tbl.horizontalHeader().setSectionResizeMode(3, QHeaderView.Fixed)
        self.tbl.setColumnWidth(3, 56)
        cl.addWidget(self.tbl); lay.addWidget(card, 1)

    def refresh(self):
        faltas = self.dm.get_faltas()
        self.tbl.setRowCount(len(faltas))
        URG = {"alta":ERROR,"media":WARN,"baixa":SUCCESS}
        for r, f in enumerate(faltas):
            urg = f.get("urgency","media")
            for c, v in enumerate([f.get("name",""), urg.upper(), f.get("obs",""), ""]):
                if c == 3: continue
                it = QTableWidgetItem(v)
                if c == 1: it.setForeground(QColor(URG.get(urg,TEXT2)))
                self.tbl.setItem(r, c, it)
            w = QWidget(); wl = QHBoxLayout(w); wl.setContentsMargins(6,4,6,4); wl.setSpacing(4)
            fid = f.get("id","")
            bd = QPushButton("✕"); bd.setObjectName("btn_icon_del"); bd.setFixedSize(28,28)
            bd.setToolTip("Remover item"); bd.setCursor(Qt.PointingHandCursor)
            bd.clicked.connect(lambda _, i=fid: self._del(i))
            wl.addWidget(bd)
            self.tbl.setCellWidget(r, 3, w)

    def _add(self):
        dlg = FaltaDialog(self, self.dm); dlg.exec_(); self.refresh()

    def _del(self, fid):
        faltas = [f for f in self.dm.get_faltas() if f.get("id","") != fid]
        self.dm.save_faltas(faltas); self.refresh()


class FaltaDialog(ModernFormDialog):
    def __init__(self, parent, dm):
        super().__init__(parent, min_width=380); self.dm = dm
        self.add_title_bar("Novo Item em Falta")
        lay = self.main_lay
        form = QFormLayout(); form.setSpacing(10)
        self.e_name = QLineEdit(); self.e_name.setFixedHeight(38)
        self.e_urg  = QComboBox(); self.e_urg.setFixedHeight(38)
        self.e_urg.addItems(["alta","media","baixa"])
        self.e_obs  = QLineEdit(); self.e_obs.setFixedHeight(38)
        form.addRow("Item *:", self.e_name); form.addRow("Urgência:", self.e_urg)
        form.addRow("Obs:", self.e_obs); lay.addLayout(form)
        brow = QHBoxLayout(); brow.addStretch()
        bc = make_btn("Cancelar","secondary"); bc.clicked.connect(self.reject)
        bs = make_btn("Adicionar","primary"); bs.clicked.connect(self._save)
        brow.addWidget(bc); brow.addWidget(bs); lay.addLayout(brow)

    def _save(self):
        name = self.e_name.text().strip()
        if not name: QMessageBox.warning(self,"Aviso","Informe o item."); return
        faltas = self.dm.get_faltas()
        faltas.append({"id":str(uuid.uuid4())[:8],"name":name,
                        "urgency":self.e_urg.currentText(),"obs":self.e_obs.text().strip(),
                        "added_at":datetime.now().isoformat()})
        self.dm.save_faltas(faltas); self.accept()


# ═══════════════════════════════════════════════════════════════════
#  REPORTS TAB
# ═══════════════════════════════════════════════════════════════════
class ReportsTab(QWidget):
    def __init__(self, dm, parent=None):
        super().__init__(parent); self.dm = dm; self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(28,24,28,24); lay.setSpacing(20)
        lay.addWidget(SectionHeader("Relatórios", "Análises e exportações"))

        # Summary cards grid
        grid = QGridLayout(); grid.setSpacing(16)

        self.mc_products = MetricCard("Total Produtos",  "0", "📦", "", TEXT)
        self.mc_customers= MetricCard("Total Clientes",  "0", "👥", "", INFO)
        self.mc_revenue  = MetricCard("Fatur. Histórico","R$ 0,00","💰","",ORANGE)
        self.mc_trocas   = MetricCard("Trocas Pend.",    "0","🔄","",WARN)
        grid.addWidget(self.mc_products,  0, 0)
        grid.addWidget(self.mc_customers, 0, 1)
        grid.addWidget(self.mc_revenue,   0, 2)
        grid.addWidget(self.mc_trocas,    0, 3)
        lay.addLayout(grid)

        # Top sellers
        card = make_card(); cl = QVBoxLayout(card); cl.setContentsMargins(20,18,20,18); cl.setSpacing(12)
        cl.addWidget(make_label("Produtos Mais Vendidos — Top 10", 14, bold=True))
        self.top_tbl = QTableWidget(0, 3)
        self.top_tbl.setHorizontalHeaderLabels(["#","Produto","Qtd Vendida"])
        self.top_tbl.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.top_tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.top_tbl.verticalHeader().setVisible(False); self.top_tbl.setShowGrid(False)
        self.top_tbl.setMaximumHeight(340)
        cl.addWidget(self.top_tbl)
        lay.addWidget(card)
        lay.addStretch()

    def refresh(self):
        prods = self.dm.get_products()
        custs = self.dm.get_customers()
        sales = [s for s in self.dm.get_sales() if s.get("status","")!="cancelada"]
        pend = [t for t in self.dm.get_trocas() if t.get("status","") in ("Aguardando","Em Troca")]
        rev = sum(s.get("total",0) for s in sales)
        self.mc_products.set_value(str(len(prods)))
        self.mc_customers.set_value(str(len(custs)))
        self.mc_revenue.set_value(fmtR(rev))
        self.mc_trocas.set_value(str(len(pend)))
        # Top sellers
        counter = Counter()
        for s in sales:
            for item in s.get("items",[]):
                counter[item.get("name","?")] += item.get("qty",0)
        top = counter.most_common(10)
        self.top_tbl.setRowCount(len(top))
        for r, (name, qty) in enumerate(top):
            for c, v in enumerate([f"#{r+1}", name, str(qty)+" un."]):
                it = QTableWidgetItem(v)
                if c == 0: it.setForeground(QColor(ORANGE))
                elif c == 2: it.setForeground(QColor(SUCCESS))
                self.top_tbl.setItem(r, c, it)


# ═══════════════════════════════════════════════════════════════════
#  USERS TAB
# ═══════════════════════════════════════════════════════════════════
class UsersTab(QWidget):
    def __init__(self, dm, parent=None):
        super().__init__(parent); self.dm = dm; self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(28,24,28,24); lay.setSpacing(16)
        hdr = QHBoxLayout()
        hdr.addWidget(SectionHeader("Usuários", "Gerenciamento de acessos"))
        hdr.addStretch()
        btn_add = make_btn("+ Novo Usuário","primary"); btn_add.setFixedHeight(38)
        btn_add.clicked.connect(self._add)
        hdr.addWidget(btn_add); lay.addLayout(hdr)

        card = make_card(); cl = QVBoxLayout(card); cl.setContentsMargins(0,0,0,0)
        self.tbl = QTableWidget(0, 4)
        self.tbl.setHorizontalHeaderLabels(["Nome","Usuário","Perfil","Ações"])
        self.tbl.horizontalHeader().setSectionResizeMode(0, QHeaderView.Stretch)
        self.tbl.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.tbl.verticalHeader().setVisible(False); self.tbl.setShowGrid(False)
        self.tbl.verticalHeader().setDefaultSectionSize(44)
        self.tbl.horizontalHeader().setSectionResizeMode(3, QHeaderView.Fixed)
        self.tbl.setColumnWidth(3, 92)
        cl.addWidget(self.tbl); lay.addWidget(card, 1)

    def refresh(self):
        users = self.dm.get_users()
        self.tbl.setRowCount(len(users))
        for r, u in enumerate(users):
            role = "Administrador" if u.get("role")=="admin" else "Operador"
            for c, v in enumerate([u.get("name",""), u.get("username",""), role, ""]):
                if c == 3: continue
                it = QTableWidgetItem(v)
                if c == 2: it.setForeground(QColor(ORANGE if u.get("role")=="admin" else TEXT2))
                self.tbl.setItem(r, c, it)
            w = QWidget(); wl = QHBoxLayout(w); wl.setContentsMargins(0,0,0,0); wl.setSpacing(6); wl.setAlignment(Qt.AlignCenter)
            uid = u["id"]
            be = QPushButton("✏️"); be.setObjectName("btn_icon_edit"); be.setFixedSize(28,28)
            be.setToolTip("Editar usuário"); be.setCursor(Qt.PointingHandCursor)
            be.clicked.connect(lambda _, i=uid: self._edit(i))
            bd = QPushButton("🗑"); bd.setObjectName("btn_icon_del"); bd.setFixedSize(28,28)
            bd.setToolTip("Excluir usuário"); bd.setCursor(Qt.PointingHandCursor)
            bd.clicked.connect(lambda _, i=uid: self._del(i))
            wl.addWidget(be); wl.addWidget(bd)
            self.tbl.setCellWidget(r, 3, w)

    def _add(self): UserDialog(self, self.dm).exec_(); self.refresh()
    def _edit(self, uid):
        u = next((x for x in self.dm.get_users() if x["id"]==uid),None)
        if u: UserDialog(self, self.dm, u).exec_(); self.refresh()
    def _del(self, uid):
        if uid == "admin-fixed":
            AlertDialog.show_info(self, "Protegido",
                "O administrador principal não pode ser excluído.", "🔒")
            return
        if ConfirmDialog.ask(self, "Excluir Usuário",
                             "Tem certeza que deseja excluir este usuário?",
                             "🗑️", danger=True):
            self.dm.delete_user(uid); self.refresh()


class UserDialog(ModernFormDialog):
    def __init__(self, parent, dm, user=None):
        super().__init__(parent, min_width=400); self.dm = dm; self.usr = user
        self.add_title_bar("Novo Usuário" if not user else "Editar Usuário")
        lay = self.main_lay
        form = QFormLayout(); form.setSpacing(10)
        self.e_name = QLineEdit(user.get("name","") if user else ""); self.e_name.setFixedHeight(38)
        self.e_user = QLineEdit(user.get("username","") if user else ""); self.e_user.setFixedHeight(38)
        self.e_pwd  = QLineEdit(); self.e_pwd.setEchoMode(QLineEdit.Password); self.e_pwd.setFixedHeight(38)
        self.e_pwd.setPlaceholderText("(deixe em branco para manter)" if user else "Senha obrigatória")
        self.e_role = QComboBox(); self.e_role.setFixedHeight(38)
        self.e_role.addItems(["operator","admin"])
        if user: self.e_role.setCurrentText(user.get("role","operator"))
        form.addRow("Nome *:", self.e_name); form.addRow("Usuário *:", self.e_user)
        form.addRow("Senha:", self.e_pwd); form.addRow("Perfil:", self.e_role)
        lay.addLayout(form); lay.addWidget(make_divider())
        brow = QHBoxLayout(); brow.addStretch()
        bc = make_btn("Cancelar","secondary"); bc.clicked.connect(self.reject)
        bs = make_btn("Salvar","primary"); bs.clicked.connect(self._save)
        brow.addWidget(bc); brow.addWidget(bs); lay.addLayout(brow)

    def _save(self):
        name = self.e_name.text().strip(); username = self.e_user.text().strip()
        if not name or not username: QMessageBox.warning(self,"Aviso","Nome e usuário obrigatórios."); return
        pwd = self.e_pwd.text().strip()
        data = {"name":name,"username":username,"role":self.e_role.currentText(),"active":True}
        if pwd: data["password_hash"] = hashlib.sha256(pwd.encode()).hexdigest()
        if self.usr:
            data["id"] = self.usr["id"]
            if not pwd: data["password_hash"] = self.usr.get("password_hash","")
            data["password"] = self.usr.get("password","")
            self.dm.update_user(self.usr["id"], data)
        else:
            if not pwd: QMessageBox.warning(self,"Aviso","Senha obrigatória."); return
            data["password"] = pwd
            ok, msg = self.dm.add_user(data)
            if not ok: QMessageBox.warning(self,"Erro",msg); return
        self.accept()


# ═══════════════════════════════════════════════════════════════════
#  BINC IA TAB
# ═══════════════════════════════════════════════════════════════════
class BincIATab(QWidget):
    def __init__(self, dm, parent=None):
        super().__init__(parent); self.dm = dm; self._build()

    def _build(self):
        lay = QVBoxLayout(self); lay.setContentsMargins(0,0,0,0); lay.setSpacing(0)

        # Header bar
        hdr = QWidget()
        hdr.setStyleSheet(f"background:{CARD};border-bottom:1px solid {BORDER};")
        hl = QHBoxLayout(hdr); hl.setContentsMargins(24,12,24,12)
        logo = QLabel("🤖"); logo.setStyleSheet("font-size:24px;")
        hl.addWidget(logo)
        txt = QVBoxLayout(); txt.setSpacing(0)
        t1 = make_label("Binc IA", 15, bold=True)
        t2 = make_label("● Online — Conectado ao sistema", 11, color=SUCCESS)
        txt.addWidget(t1); txt.addWidget(t2)
        hl.addLayout(txt); hl.addStretch()
        bclear = make_btn("Limpar conversa","secondary"); bclear.setFixedSize(140,34)
        bclear.clicked.connect(self._clear)
        hl.addWidget(bclear)
        lay.addWidget(hdr)

        # Suggestions
        self.chips_w = QWidget()
        self.chips_w.setStyleSheet(f"background:{BG};border-bottom:1px solid {BORDER};")
        cl = QHBoxLayout(self.chips_w); cl.setContentsMargins(20,10,20,10); cl.setSpacing(8)
        for chip_txt, q in [("📊 Resumo","Resumo do negócio"),("💰 Faturamento","Quanto faturei este mês?"),
                             ("⚠️ Estoque crítico","Produtos com estoque crítico"),
                             ("🛒 Últimas vendas","Últimas 5 vendas"),("🏆 Mais vendidos","Produtos mais vendidos"),
                             ("🔄 Trocas","Trocas pendentes"),("👥 Clientes","Quantos clientes cadastrados")]:
            b = QPushButton(chip_txt)
            b.setStyleSheet(f"QPushButton{{background:{ORANGE_L};color:{ORANGE};border:1.5px solid {ORANGE};border-radius:20px;padding:5px 14px;font-size:12px;font-weight:600;}}"
                           f"QPushButton:hover{{background:{ORANGE};color:white;}}")
            b.setCursor(Qt.PointingHandCursor); b.setFixedHeight(30)
            b.clicked.connect(lambda _, qry=q: self._ask(qry))
            cl.addWidget(b)
        cl.addStretch()
        lay.addWidget(self.chips_w)

        # Chat area
        scroll = QScrollArea(); scroll.setWidgetResizable(True)
        scroll.setStyleSheet(f"background:{BG};border:none;")
        self.chat_inner = QWidget()
        self.chat_inner.setStyleSheet(f"background:{BG};")
        self.chat_lay = QVBoxLayout(self.chat_inner)
        self.chat_lay.setContentsMargins(24,20,24,20); self.chat_lay.setSpacing(16)
        self.chat_lay.addStretch()
        scroll.setWidget(self.chat_inner)
        self._scroll = scroll
        lay.addWidget(scroll, 1)

        # Input area
        inp_w = QWidget(); inp_w.setStyleSheet(f"background:{CARD};border-top:1px solid {BORDER};")
        inp_l = QHBoxLayout(inp_w); inp_l.setContentsMargins(20,12,20,12); inp_l.setSpacing(10)
        self.inp = QLineEdit(); self.inp.setPlaceholderText("Pergunte sobre seu negócio...")
        self.inp.setFixedHeight(42)
        self.inp.returnPressed.connect(self._send)
        inp_l.addWidget(self.inp, 1)
        bs = make_btn("Enviar 📨","primary"); bs.setFixedSize(90,42)
        bs.clicked.connect(self._send)
        inp_l.addWidget(bs)
        lay.addWidget(inp_w)

        # Welcome message
        self._add_bot_bubble("👋 Olá! Sou a <b>Binc IA</b>, seu assistente interno.<br>"
                             "Tenho acesso a todos os dados do sistema: produtos, vendas, clientes, "
                             "trocas e muito mais.<br><br>"
                             "Use os chips acima ou escreva sua pergunta livremente! 😊")

    def _add_user_bubble(self, text):
        self.chips_w.hide()
        row = QHBoxLayout(); row.addStretch()
        bubble = QLabel(text); bubble.setWordWrap(True)
        bubble.setMaximumWidth(480)
        bubble.setStyleSheet(f"background:qlineargradient(x1:0,y1:0,x2:1,y2:0,stop:0 {ORANGE},stop:1 {ORANGE_D});"
                            f"color:white;border-radius:18px 18px 4px 18px;padding:12px 18px;"
                            f"font-size:13px;line-height:1.5;")
        row.addWidget(bubble)
        self.chat_lay.insertLayout(self.chat_lay.count()-1, row)
        QTimer.singleShot(100, lambda: self._scroll.verticalScrollBar().setValue(
            self._scroll.verticalScrollBar().maximum()))

    def _add_bot_bubble(self, html):
        row = QHBoxLayout()
        avatar = QLabel("🤖"); avatar.setStyleSheet("font-size:20px;margin-top:4px;")
        avatar.setAlignment(Qt.AlignTop)
        bubble = QLabel(); bubble.setWordWrap(True); bubble.setTextFormat(Qt.RichText)
        bubble.setText(html); bubble.setMaximumWidth(560)
        bubble.setStyleSheet(f"background:{CARD};color:{TEXT};border:1.5px solid {BORDER};"
                            f"border-radius:18px 18px 18px 4px;padding:14px 18px;"
                            f"font-size:13px;line-height:1.5;")
        row.addWidget(avatar); row.addWidget(bubble); row.addStretch()
        self.chat_lay.insertLayout(self.chat_lay.count()-1, row)
        QTimer.singleShot(100, lambda: self._scroll.verticalScrollBar().setValue(
            self._scroll.verticalScrollBar().maximum()))

    def _ask(self, q):
        self.inp.setText(q); self._send()

    def _send(self):
        txt = self.inp.text().strip()
        if not txt: return
        self._add_user_bubble(txt); self.inp.clear()
        QTimer.singleShot(500, lambda: self._answer(txt))

    def _answer(self, txt):
        t = txt.lower()
        response = self._process(t)
        self._add_bot_bubble(response)

    def _process(self, t):
        dm = self.dm
        if any(x in t for x in ["resumo","geral","visão","visao","negócio","negocio","overview"]):
            return self._r_resumo()
        if any(x in t for x in ["faturei","faturamento","receita","mês","mes","quanto vendi"]):
            return self._r_faturamento()
        if "hoje" in t and any(x in t for x in ["vend","fatur","valor","receita"]):
            return self._r_hoje()
        if any(x in t for x in ["última","ultima","últimas","ultimas","recente"]):
            return self._r_ultimas()
        if any(x in t for x in ["mais vendido","top","best","popular","melhor"]):
            return self._r_top()
        if any(x in t for x in ["crítico","critico","baixo","acabando","faltando estoque"]):
            return self._r_critico()
        if any(x in t for x in ["produto","produtos","catalogo","catálogo"]):
            return self._r_produtos()
        if any(x in t for x in ["cliente","clientes"]):
            return self._r_clientes()
        if any(x in t for x in ["troca","avaria","devolução","devolucao","pendente"]):
            return self._r_trocas()
        if any(x in t for x in ["falta","faltando","lista de falta"]):
            return self._r_faltas()
        return ("❓ Não identifiquei sua pergunta. Tente:<br><br>"
                "• <i>Resumo do negócio</i><br>• <i>Faturamento do mês</i><br>"
                "• <i>Produtos mais vendidos</i><br>• <i>Estoque crítico</i><br>"
                "• <i>Últimas vendas</i><br>• <i>Trocas pendentes</i>")

    def _r_resumo(self):
        today = date.today().isoformat(); this_month = today[:7]
        sales = [s for s in self.dm.get_sales() if s.get("status","")!="cancelada"]
        td_rev = sum(s.get("total",0) for s in sales if s.get("date","")[:10]==today)
        mo_rev = sum(s.get("total",0) for s in sales if s.get("date","")[:7]==this_month)
        criticos = sum(1 for p in self.dm.get_products() if p.get("stock",0)<=p.get("min_stock",2))
        pend = sum(1 for t in self.dm.get_trocas() if t.get("status","") in ("Aguardando","Em Troca"))
        return (f"<b>📊 Resumo do Negócio</b><br><br>"
                f"💰 Faturamento hoje: <b style='color:{ORANGE}'>{fmtR(td_rev)}</b><br>"
                f"📆 Faturamento do mês: <b style='color:{ORANGE}'>{fmtR(mo_rev)}</b><br>"
                f"📦 Produtos: <b>{len(self.dm.get_products())}</b><br>"
                f"👥 Clientes: <b>{len(self.dm.get_customers())}</b><br>"
                f"⚠️ Estoque crítico: <b style='color:{ERROR if criticos else SUCCESS}'>{criticos} produto(s)</b><br>"
                f"🔄 Trocas pendentes: <b style='color:{WARN if pend else SUCCESS}'>{pend}</b>")

    def _r_faturamento(self):
        today = date.today().isoformat(); this_month = today[:7]; this_year = today[:4]
        sales = [s for s in self.dm.get_sales() if s.get("status","")!="cancelada"]
        def s(f): return sum(x.get("total",0) for x in sales if x.get("date","").startswith(f))
        return (f"<b>💰 Faturamento</b><br><br>"
                f"Hoje: <b style='color:{SUCCESS}'>{fmtR(s(today))}</b><br>"
                f"Este mês ({this_month[5:]}): <b style='color:{ORANGE}'>{fmtR(s(this_month))}</b><br>"
                f"Este ano ({this_year}): <b>{fmtR(s(this_year))}</b><br>"
                f"Total histórico: <b>{fmtR(s(''))}</b><br><br>"
                f"<small style='color:{TEXT3}'>* Cancelamentos e descontos de descarte aplicados.</small>")

    def _r_hoje(self):
        today = date.today().isoformat()
        sales = [s for s in self.dm.get_sales() if s.get("date","")[:10]==today and s.get("status","")!="cancelada"]
        if not sales: return f"📭 Nenhuma venda registrada hoje ainda. <b>Hora de vender! 💪</b>"
        rows = "".join(f"• {s.get('date','')[-8:-3]} — {s.get('customer_name','CF')} — <b style='color:{ORANGE}'>{fmtR(s.get('total',0))}</b><br>" for s in sales[:5])
        return (f"<b>🛒 Vendas de Hoje ({today})</b><br><br>"
                f"{len(sales)} venda(s) · Total: <b style='color:{ORANGE}'>{fmtR(sum(s.get('total',0) for s in sales))}</b><br><br>{rows}")

    def _r_ultimas(self):
        sales = sorted(self.dm.get_sales(), key=lambda x: x.get("date",""), reverse=True)[:5]
        if not sales: return "📭 Nenhuma venda registrada ainda."
        rows = "".join(f"• {s.get('date','')[:16].replace('T',' ')} — {s.get('customer_name','CF')} — <b style='color:{ORANGE}'>{fmtR(s.get('total',0))}</b> [{s.get('status','')}]<br>" for s in sales)
        return f"<b>📋 Últimas 5 Vendas</b><br><br>{rows}"

    def _r_top(self):
        sales = [s for s in self.dm.get_sales() if s.get("status","")!="cancelada"]
        counter = Counter()
        for s in sales:
            for item in s.get("items",[]): counter[item.get("name","?")] += item.get("qty",0)
        top = counter.most_common(6)
        if not top: return "📭 Sem dados suficientes para ranking."
        rows = "".join(f"<b>#{i+1}</b> {n} — <b style='color:{ORANGE}'>{q} un.</b><br>" for i,(n,q) in enumerate(top))
        return f"<b>🏆 Produtos Mais Vendidos</b><br><br>{rows}"

    def _r_critico(self):
        prods = [p for p in self.dm.get_products() if p.get("stock",0)<=p.get("min_stock",2)]
        if not prods: return f"<b style='color:{SUCCESS}'>✅ Nenhum produto com estoque crítico no momento!</b>"
        rows = "".join(f"• <b>{p.get('name','')[:30]}</b> — Estoque: <b style='color:{ERROR}'>{p.get('stock',0)}</b> (mín: {p.get('min_stock',2)})<br>" for p in prods[:8])
        return f"<b>⚠️ Estoque Crítico — {len(prods)} produto(s)</b><br><br>{rows}<br><small style='color:{WARN}'>⚡ Considere reabastecer!</small>"

    def _r_produtos(self):
        prods = self.dm.get_products()
        val = sum(p.get("stock",0)*p.get("cost_price",0) for p in prods)
        cats = Counter(p.get("category","?") for p in prods)
        top_cats = "".join(f"• {c}: <b>{n}</b><br>" for c,n in cats.most_common(5))
        return (f"<b>📦 Produtos Cadastrados</b><br><br>"
                f"Total: <b style='color:{ORANGE}'>{len(prods)}</b><br>"
                f"Valor em estoque: <b style='color:{ORANGE}'>{fmtR(val)}</b><br><br>"
                f"<b>Por categoria:</b><br>{top_cats}")

    def _r_clientes(self):
        custs = self.dm.get_customers()
        if not custs: return "📭 Nenhum cliente cadastrado ainda."
        return (f"<b>👥 Clientes Cadastrados</b><br><br>"
                f"Total: <b style='color:{ORANGE}'>{len(custs)}</b><br><br>"
                f"Acesse a aba <b>Clientes</b> para ver detalhes.")

    def _r_trocas(self):
        trocas = self.dm.get_trocas()
        pend = [t for t in trocas if t.get("status","") in ("Aguardando","Em Troca")]
        desc = [t for t in trocas if t.get("status","")=="Descarte"]
        return (f"<b>🔄 Trocas & Avarias</b><br><br>"
                f"Total registros: <b>{len(trocas)}</b><br>"
                f"⏳ Pendentes: <b style='color:{WARN}'>{len(pend)}</b><br>"
                f"🗑️ Descartados: <b style='color:{ERROR}'>{len(desc)}</b><br>"
                f"💸 Valor descartado: <b style='color:{ERROR}'>{fmtR(sum(t.get('item_value',0) for t in desc))}</b>")

    def _r_faltas(self):
        faltas = self.dm.get_faltas()
        if not faltas: return f"<b style='color:{SUCCESS}'>✅ Nenhum item na lista de faltas!</b>"
        urg = [f for f in faltas if f.get("urgency","")=="alta"]
        rows = "".join(f"• <b>{f.get('name','')}</b> [{f.get('urgency','').upper()}]<br>" for f in faltas[:6])
        return (f"<b>📝 Lista de Faltas</b><br><br>"
                f"Total: <b>{len(faltas)}</b> · Urgentes: <b style='color:{ERROR}'>{len(urg)}</b><br><br>{rows}")

    def _clear(self):
        # Remove all messages except the last stretch
        while self.chat_lay.count() > 1:
            item = self.chat_lay.takeAt(0)
            if item.layout():
                while item.layout().count():
                    w = item.layout().takeAt(0).widget()
                    if w: w.deleteLater()
            elif item.widget():
                item.widget().deleteLater()
        self.chips_w.show()
        self._add_bot_bubble("🔄 Conversa limpa! Como posso ajudar?")

    def refresh(self): pass


# ═══════════════════════════════════════════════════════════════════
#  SETTINGS DIALOG
# ═══════════════════════════════════════════════════════════════════
class SettingsDialog(ModernFormDialog):
    def __init__(self, parent, dm):
        super().__init__(parent, min_width=480); self.dm = dm
        self.add_title_bar("Configurações do Sistema")
        lay = self.main_lay
        s = dm.get_settings()
        form = QFormLayout(); form.setSpacing(12)
        self.e_store = QLineEdit(s.get("nome_loja","MOTO PEÇAS & MECÂNICA")); self.e_store.setFixedHeight(38)
        self.e_phone = QLineEdit(s.get("telefone","")); self.e_phone.setFixedHeight(38)
        self.e_cnpj  = QLineEdit(s.get("cnpj","")); self.e_cnpj.setFixedHeight(38)
        self.e_wa    = QLineEdit(s.get("meu_whatsapp","")); self.e_wa.setFixedHeight(38)
        form.addRow("Nome da Loja:", self.e_store)
        form.addRow("Telefone:", self.e_phone)
        form.addRow("CNPJ:", self.e_cnpj)
        form.addRow("WhatsApp:", self.e_wa)
        lay.addLayout(form); lay.addWidget(make_divider())
        brow = QHBoxLayout(); brow.addStretch()
        bc = make_btn("Cancelar","secondary"); bc.clicked.connect(self.reject)
        bs = make_btn("Salvar","primary"); bs.clicked.connect(self._save)
        brow.addWidget(bc); brow.addWidget(bs); lay.addLayout(brow)

    def _save(self):
        s = self.dm.get_settings()
        s["nome_loja"] = self.e_store.text().strip()
        s["telefone"]  = self.e_phone.text().strip()
        s["cnpj"]      = self.e_cnpj.text().strip()
        s["meu_whatsapp"] = self.e_wa.text().strip()
        self.dm.save_settings(s)
        AlertDialog.show_info(self, "Salvo!", "Configurações salvas com sucesso.", "✅")
        self.accept()


# ═══════════════════════════════════════════════════════════════════
#  MAIN
# ═══════════════════════════════════════════════════════════════════
def main():
    app = QApplication(sys.argv)
    app.setApplicationName("Binc CMS v2")
    app.setApplicationVersion("2.0.0")
    try:
        app.setAttribute(Qt.AA_EnableHighDpiScaling, True)
        app.setAttribute(Qt.AA_UseHighDpiPixmaps, True)
    except: pass

    app.setStyleSheet(QSS)

    win = LoginWindow()
    win.show()
    scr = app.primaryScreen().geometry()
    win.move((scr.width()-win.width())//2, (scr.height()-win.height())//2)
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()

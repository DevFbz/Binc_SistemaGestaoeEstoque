#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script to repair main.py - removes corrupt MainWindow section and replaces with clean one."""

import sys

CLEAN_MAIN_WINDOW = '''
# =============================================================================
#  ACTION PAGE  (Bridge entre HTML e Python)
# =============================================================================
if WEB_OK:
    from PyQt5.QtWebEngineWidgets import QWebEnginePage
    class ActionPage(QWebEnginePage):
        action_triggered = pyqtSignal(str)
        def acceptNavigationRequest(self, url, _type, isMainFrame):
            if url.scheme() == "py":
                action = url.host() + url.path()
                if url.hasQuery():
                    action += "?" + url.query()
                self.action_triggered.emit(action)
                return False
            return super().acceptNavigationRequest(url, _type, isMainFrame)


# =============================================================================
#  MAIN WINDOW  (SPA Shell - Backend Python + Frontend HTML/Tailwind)
# =============================================================================
class MainWindow(QMainWindow):
    """Janela principal do sistema — usa um unico QWebEngineView como shell SPA."""

    # Mapeamento de abas para arquivos HTML
    TAB_MAP = {
        "Dashboard":  "dashboard_theme.html",
        "Nova Venda": "caixa_theme.html",
        "Produtos":   "products_theme.html",
        "Historico":  "history_theme.html",
        "Clientes":   "customers_theme.html",
        "Trocas":     "trocas_theme.html",
        "Faltas":     "faltas_theme.html",
        "Relatorios": "reports_theme.html",
        "Usuarios":   "users_theme.html",
    }

    def __init__(self, dm, user):
        super().__init__()
        self.dm = dm
        self.user = user
        self.is_admin = (user.get("role") == "admin")
        self._current_tab = "Dashboard"

        self.setWindowTitle("Binc — Gestao Inteligente")
        self.resize(1280, 800)
        self.setMinimumSize(1024, 640)

        # Estado dos modulos
        self._products_tab = None
        self._sales_tab = None
        self._customers_tab = None
        self._history_tab = None
        self._reports_tab = None
        self._faltas_tab = None
        self._trocas_tab = None
        self._users_tab = None

        # Build centralized web view
        if WEB_OK:
            self.web = QWebEngineView()
            self.web_page = ActionPage(self.web)
            self.web_page.action_triggered.connect(self._on_shell_action)
            self.web.setPage(self.web_page)
            self.web.page().setBackgroundColor(QColor(15, 23, 42))
            self.setCentralWidget(self.web)

            shell_path = os.path.join(BASE_DIR, "app_shell.html")
            self.web.setUrl(QUrl.fromLocalFile(shell_path))
            self.web.loadFinished.connect(self._on_shell_ready)
        else:
            lbl = QLabel("ERRO: PyQtWebEngine nao instalado. Execute: pip install PyQtWebEngine")
            lbl.setAlignment(Qt.AlignCenter)
            self.setCentralWidget(lbl)

        # Atalhos de teclado
        QShortcut(QKeySequence("F5"), self).activated.connect(self._refresh_current)
        QShortcut(QKeySequence("F11"), self).activated.connect(self._toggle_fullscreen)
        QShortcut(QKeySequence("Ctrl+P"), self).activated.connect(
            lambda: self._navigate_to("Nova Venda"))

        # Aplicar janela cheia se configurado
        settings = self.dm.get_settings()
        if settings.get("fullscreen", False):
            self.showMaximized()

    # ─────────────────────────────────────────────────────────────────────────
    #  SHELL EVENTS
    # ─────────────────────────────────────────────────────────────────────────
    def _on_shell_ready(self, ok):
        """Chamado quando o app_shell.html termina de carregar."""
        if not ok:
            return
        user_data = {
            "name": self.user.get("name", "Usuario"),
            "role": self.user.get("role", "operator"),
        }
        self.web.page().runJavaScript(f"initShell({json.dumps(user_data)})")
        QTimer.singleShot(300, lambda: self._navigate_to("Dashboard"))

    def _on_shell_action(self, action):
        """Roteador central de todas as acoes py:// vindas do HTML."""
        from urllib.parse import urlparse, parse_qs
        u = urlparse("py://" + action)
        path = u.path
        qs = {k: v[0] for k, v in parse_qs(u.query).items()}

        # Navegacao entre modulos
        if path == "/navigate":
            self._navigate_to(qs.get("tab", "Dashboard"))

        # Acoes do shell (fora dos modulos)
        elif path == "/settings":
            self._open_settings()
        elif path == "/logout":
            self._logout()

        # Acoes dos modulos — roteadas para as instancias correspondentes
        else:
            self._route_module_action(path, qs)

    def _route_module_action(self, path, qs):
        """Roteia acoes de modulos HTML para as classes Tab correspondentes."""
        tab = self._current_tab

        if tab == "Dashboard":
            pass  # Acoes de navegacao ja tratadas acima

        elif tab == "Nova Venda" or path.startswith("/cart") or path.startswith("/search") or path.startswith("/add") or path.startswith("/remove") or path.startswith("/sync") or path.startswith("/update_disc") or path.startswith("/clear"):
            if self._sales_tab:
                self._sales_tab._on_action(path.lstrip("/") + (f"?{'&'.join(f'{k}={v}' for k, v in qs.items())}" if qs else ""))

        elif tab == "Produtos" or path in ["/add", "/edit", "/del", "/del_confirm", "/xml", "/xml_confirm", "/modal_save", "/img"]:
            if self._products_tab:
                # Reconstruir action string para repassar
                action_str = path.lstrip("/")
                if qs: action_str += "?" + "&".join(f"{k}={v}" for k, v in qs.items())
                self._products_tab._on_action(action_str)

        elif tab == "Clientes":
            if self._customers_tab:
                action_str = path.lstrip("/")
                if qs: action_str += "?" + "&".join(f"{k}={v}" for k, v in qs.items())
                self._customers_tab._on_action(action_str)

        elif tab == "Historico":
            if self._history_tab:
                action_str = path.lstrip("/")
                if qs: action_str += "?" + "&".join(f"{k}={v}" for k, v in qs.items())
                self._history_tab._on_action(action_str)

        elif tab == "Relatorios":
            if self._reports_tab:
                action_str = path.lstrip("/")
                if qs: action_str += "?" + "&".join(f"{k}={v}" for k, v in qs.items())
                self._reports_tab._on_action(action_str)

        elif tab == "Faltas":
            if self._faltas_tab:
                action_str = path.lstrip("/")
                if qs: action_str += "?" + "&".join(f"{k}={v}" for k, v in qs.items())
                self._faltas_tab._on_action(action_str)

        elif tab == "Trocas":
            if self._trocas_tab:
                action_str = path.lstrip("/")
                if qs: action_str += "?" + "&".join(f"{k}={v}" for k, v in qs.items())
                self._trocas_tab._on_action(action_str)

        elif tab == "Usuarios":
            if self._users_tab:
                action_str = path.lstrip("/")
                if qs: action_str += "?" + "&".join(f"{k}={v}" for k, v in qs.items())
                self._users_tab._on_action(action_str)

    # ─────────────────────────────────────────────────────────────────────────
    #  NAVEGACAO
    # ─────────────────────────────────────────────────────────────────────────
    def _navigate_to(self, tab):
        """Navega para uma aba e injeta dados quando a pagina carregar."""
        if tab not in self.TAB_MAP:
            return
        self._current_tab = tab
        filename = self.TAB_MAP[tab]
        file_path = os.path.join(BASE_DIR, filename)
        url = QUrl.fromLocalFile(file_path).toString()
        # Informa o shell para mudar o frame
        self.web.page().runJavaScript(f"setFrameUrl({json.dumps(url)})")
        # Inicia injecao de dados apos carregar
        QTimer.singleShot(900, lambda: self._inject_tab_data(tab))

    def _refresh_current(self):
        self._inject_tab_data(self._current_tab)

    def _toggle_fullscreen(self):
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()

    # ─────────────────────────────────────────────────────────────────────────
    #  INJECAO DE DADOS POR ABA
    # ─────────────────────────────────────────────────────────────────────────
    def _inject_tab_data(self, tab):
        """Injeta dados do backend Python no frontend HTML do modulo ativo."""
        if tab == "Dashboard":
            self._inject_dashboard()
        elif tab == "Nova Venda":
            self._ensure_sales_tab()
            if self._sales_tab:
                QTimer.singleShot(200, self._sales_tab.refresh_customers)
        elif tab == "Produtos":
            self._ensure_products_tab()
            if self._products_tab:
                QTimer.singleShot(200, self._products_tab.refresh)
        elif tab == "Clientes":
            self._ensure_customers_tab()
            if self._customers_tab:
                QTimer.singleShot(200, self._customers_tab.refresh)
        elif tab == "Historico":
            self._ensure_history_tab()
            if self._history_tab:
                QTimer.singleShot(200, self._history_tab.refresh)
        elif tab == "Relatorios":
            self._ensure_reports_tab()
        elif tab == "Faltas":
            self._ensure_faltas_tab()
            if self._faltas_tab:
                QTimer.singleShot(200, self._faltas_tab.refresh)
        elif tab == "Trocas":
            self._ensure_trocas_tab()
            if self._trocas_tab:
                QTimer.singleShot(200, self._trocas_tab.refresh)
        elif tab == "Usuarios":
            self._ensure_users_tab()
            if self._users_tab:
                QTimer.singleShot(200, self._users_tab.refresh)

    # ─────────────────────────────────────────────────────────────────────────
    #  LAZY INIT DAS TABS (re-usam as classes existentes mas injetam na web)
    # ─────────────────────────────────────────────────────────────────────────
    def _get_frame_page(self):
        """Retorna a pagina do iframe dentro do shell para runJavaScript."""
        return self.web.page()

    def _run_in_frame(self, js):
        """Executa JS no iframe ativo."""
        safe = json.dumps(js)
        cmd = f"(function(){{var f=document.getElementById('main-frame');if(f&&f.contentWindow){{try{{f.contentWindow.eval({safe})}}catch(e){{}}}}}})()"
        self.web.page().runJavaScript(cmd)

    def _ensure_products_tab(self):
        if not self._products_tab:
            self._products_tab = _ProductsProxy(self.dm, self.user, self._run_in_frame)

    def _ensure_sales_tab(self):
        if not self._sales_tab:
            self._sales_tab = _SalesProxy(self.dm, self.user, self._run_in_frame)

    def _ensure_customers_tab(self):
        if not self._customers_tab:
            self._customers_tab = _CustomersProxy(self.dm, self._run_in_frame)

    def _ensure_history_tab(self):
        if not self._history_tab:
            self._history_tab = _HistoryProxy(self.dm, self.user, self._run_in_frame, self)

    def _ensure_reports_tab(self):
        if not self._reports_tab:
            self._reports_tab = _ReportsProxy(self.dm, self._run_in_frame)

    def _ensure_faltas_tab(self):
        if not self._faltas_tab:
            self._faltas_tab = _FaltasProxy(self.dm, self._run_in_frame)

    def _ensure_trocas_tab(self):
        if not self._trocas_tab:
            self._trocas_tab = _TrocasProxy(self.dm, self._run_in_frame)

    def _ensure_users_tab(self):
        if not self._users_tab:
            self._users_tab = _UsersProxy(self.dm, self.user, self._run_in_frame)

    # ─────────────────────────────────────────────────────────────────────────
    #  DASHBOARD
    # ─────────────────────────────────────────────────────────────────────────
    def _inject_dashboard(self):
        import datetime as dt_lib
        prods = self.dm.get_products()
        sales = self.dm.get_sales()
        now = datetime.now()
        td = sum(s.get("total",0) for s in sales if s.get("date","")[:10]==now.strftime("%Y-%m-%d") and s.get("status") != "cancelada")
        mo = sum(s.get("total",0) for s in sales if s.get("date","")[:7]==now.strftime("%Y-%m") and s.get("status") != "cancelada")
        alerts = [p for p in prods if p.get("stock",0) <= p.get("min_stock",0)]
        recent = sorted(sales, key=lambda x: x.get("date",""), reverse=True)[:10]

        table_html = ""
        for s in recent:
            items_str = str(len(s.get("items",[])))
            val_str = fmtR(s.get("total",0))
            c_name = s.get("customer_name","--")
            dt_str = s.get("date","")[:16].replace("T"," ")
            status = "Cancelada" if s.get("status") == "cancelada" else "Concluido"
            st_color = "bg-red-500/20 text-red-400" if status == "Cancelada" else "bg-emerald-500/20 text-emerald-400"
            table_html += f'<tr class="hover:bg-slate-700/30 transition-colors"><td class="px-6 py-4 font-bold text-[#FF6B35] text-sm">{s.get("id","")[:8]}</td><td class="px-6 py-4 text-sm text-slate-400">{dt_str}</td><td class="px-6 py-4 text-sm font-medium">{c_name}</td><td class="px-6 py-4 text-sm text-slate-400">{items_str} prod.</td><td class="px-6 py-4"><span class="inline-block px-2 py-1 rounded-full text-[10px] font-bold {st_color} uppercase">{status}</span></td><td class="px-6 py-4 text-right font-bold text-white text-sm">{val_str}</td></tr>'

        bars_html = ""; labels_html = ""
        today = dt_lib.date.today()
        day_totals = []
        for i in range(6, -1, -1):
            d = today - dt_lib.timedelta(days=i)
            d_str = d.strftime("%Y-%m-%d")
            day_total = sum(s.get("total",0) for s in sales if s.get("date","")[:10] == d_str and s.get("status") != "cancelada")
            day_totals.append((d, day_total))
        max_val = max((t for _, t in day_totals), default=1) or 1
        for d, total in day_totals:
            pct = max(6, int((total / max_val) * 88))
            s_lbl = d.strftime("%a")
            bars_html += f'<div class="flex-1 flex flex-col justify-end items-center gap-1 h-full"><div class="w-full bg-[#FF6B35] rounded-t hover:bg-orange-400 transition-all relative group cursor-pointer" style="height:{pct}%"><div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 z-10 pointer-events-none">R${int(total)}</div></div></div>'
            labels_html += f'<span class="text-[10px] text-slate-500 text-center flex-1">{s_lbl}</span>'

        js = (
            f"if(typeof updateDashboard==='function') updateDashboard({json.dumps(fmtR(mo))},{json.dumps(fmtR(td))},{json.dumps(str(len(alerts)))});"
            f"if(typeof updateRecentActivity==='function') updateRecentActivity({json.dumps(table_html)});"
            f"if(typeof updateChart==='function') updateChart({json.dumps(bars_html)},{json.dumps(labels_html)});"
        )
        QTimer.singleShot(800, lambda: self._run_in_frame(js))

    # ─────────────────────────────────────────────────────────────────────────
    #  SETTINGS & LOGOUT
    # ─────────────────────────────────────────────────────────────────────────
    def _open_settings(self):
        dlg = SettingsDialog(self, self.dm)
        dlg.exec_()

    def _logout(self):
        if QMessageBox.question(self, "Sair", "Deseja encerrar o sistema?",
                                QMessageBox.Yes|QMessageBox.No) == QMessageBox.Yes:
            self._login_ref = LoginWindow()
            self._login_ref.show()
            scr = QApplication.instance().primaryScreen().geometry()
            self._login_ref.move((scr.width()-self._login_ref.width())//2,
                                 (scr.height()-self._login_ref.height())//2)
            self.close()

'''

def main():
    filepath = r'c:\Users\Fbz\Desktop\sistema\main.py'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.splitlines(keepends=True)

    print(f"Total lines: {len(lines)}")

    # Find the corrupt section to remove
    # It starts at the line with '# MAIN WINDOW (The Uni' (line 2413, 0-indexed 2412)
    # and ends just before 'class ProductsTab' (line 2567, 0-indexed 2566)
    
    corrupt_start = None
    products_tab_start = None
    
    for i, line in enumerate(lines):
        if 'MAIN WINDOW (The Uni' in line and corrupt_start is None:
            corrupt_start = i
            print(f"Corrupt start at line {i+1}: {repr(line[:60])}")
        if 'class ProductsTab' in line and products_tab_start is None:
            products_tab_start = i
            print(f"ProductsTab at line {i+1}: {repr(line[:60])}")

    # Also find second (old) MainWindow class to remove it
    old_mw_start = None
    login_window_start = None
    for i, line in enumerate(lines):
        if 'class MainWindow(QMainWindow):' in line:
            if i > 4000:  # The old one is far down
                old_mw_start = i
                print(f"Old MainWindow at line {i+1}")
        if 'class LoginWindow(QWidget):' in line:
            login_window_start = i
            print(f"LoginWindow at line {i+1}")

    if corrupt_start is None or products_tab_start is None:
        print("ERROR: Could not find section boundaries")
        return

    # Build new content:
    # 1. Keep lines before corrupt section (SettingsDialog properly ends at corrupt_start-1)  
    # 2. Insert clean MainWindow code
    # 3. Keep ProductsTab onwards (but skip the old MainWindow block)
    
    part1 = lines[:corrupt_start]  # up to (not including) the corrupt line
    part2_lines = CLEAN_MAIN_WINDOW.splitlines(keepends=True)
    
    if old_mw_start and login_window_start:
        # Skip the old MainWindow block, keep LoginWindow and below
        part3 = lines[products_tab_start:old_mw_start] + lines[login_window_start:]
        print(f"Keeping ProductsTab ({products_tab_start+1}) to old MW ({old_mw_start+1}), then LoginWindow ({login_window_start+1}) to end")
    else:
        part3 = lines[products_tab_start:]
        print(f"No old MainWindow found, keeping ProductsTab to end")

    new_content = "".join(part1) + CLEAN_MAIN_WINDOW + "".join(part3)
    
    # Write backup first
    with open(filepath + '.bak', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Backup written to main.py.bak")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    # Count new lines
    new_lines = new_content.count('\n')
    print(f"Done! New file has ~{new_lines} lines")

if __name__ == '__main__':
    main()

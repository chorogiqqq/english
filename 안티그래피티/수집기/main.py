import sys
import os
import subprocess
from datetime import datetime
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QTableWidget, QTableWidgetItem, QTextEdit,
    QProgressBar, QMessageBox, QHeaderView, QLineEdit, QFrame
)
from PyQt6.QtCore import Qt, QThread, pyqtSignal, QUrl
from PyQt6.QtGui import QFont, QIcon, QColor, QDesktopServices

from crawlers import MinistryScraper
from excel_exporter import export_to_excel

# --- Background Worker Thread for Scraping ---
class CrawlWorker(QThread):
    log_signal = pyqtSignal(str, str)     # message, level
    progress_signal = pyqtSignal(int)      # percentage
    finished_signal = pyqtSignal(dict)     # all_data dictionary

    def run(self):
        def log_cb(msg, level="INFO"):
            self.log_signal.emit(msg, level)

        def prog_cb(val):
            self.progress_signal.emit(val)

        scraper = MinistryScraper(log_callback=log_cb, progress_callback=prog_cb)
        all_data = scraper.scrape_all()
        self.finished_signal.emit(all_data)


# --- Main Application Window ---
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("3개 부처 (행안부·중기부·고용부) 사업공고 수집기")
        self.resize(1100, 750)
        
        # Paths
        self.excel_filename = "3개부처_사업공고_결과.xlsx"
        self.save_dir = os.path.abspath(os.getcwd())
        self.excel_filepath = os.path.join(self.save_dir, self.excel_filename)
        
        self.all_collected_data = {}
        
        self.init_ui()

    def init_ui(self):
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)

        # ----------------------------------------------------
        # 1. Title Header & Info Badge
        # ----------------------------------------------------
        header_card = QFrame()
        header_card.setStyleSheet("""
            QFrame {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #1E293B, stop:1 #334155);
                border-radius: 10px;
                padding: 15px;
            }
        """)
        header_layout = QVBoxLayout(header_card)

        title_label = QLabel("🚀 3개 부처 (행안부·중기부·고용부) 사업공고 맞춤 수집기")
        title_label.setFont(QFont("맑은 고딕", 16, QFont.Weight.Bold))
        title_label.setStyleSheet("color: #FFFFFF;")

        subtitle_label = QLabel("최근 30일 기준 지정 키워드(청년, 복지, 지원, 인공지능, AI, 교육) 공고 자동 수집 및 엑셀 저장")
        subtitle_label.setFont(QFont("맑은 고딕", 10))
        subtitle_label.setStyleSheet("color: #94A3B8;")

        header_layout.addWidget(title_label)
        header_layout.addWidget(subtitle_label)
        main_layout.addWidget(header_card)

        # ----------------------------------------------------
        # 2. Control Toolbar (Buttons & Status)
        # ----------------------------------------------------
        toolbar_layout = QHBoxLayout()

        self.btn_start = QPushButton("🚀 공고 수집 시작")
        self.btn_start.setFont(QFont("맑은 고딕", 11, QFont.Weight.Bold))
        self.btn_start.setCursor(Qt.CursorShape.PointingHandCursor)
        self.btn_start.setStyleSheet("""
            QPushButton {
                background-color: #2563EB;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
            }
            QPushButton:hover {
                background-color: #1D4ED8;
            }
            QPushButton:disabled {
                background-color: #94A3B8;
            }
        """)
        self.btn_start.clicked.connect(self.start_crawling)

        self.btn_open_excel = QPushButton("📊 엑셀 파일 열기")
        self.btn_open_excel.setFont(QFont("맑은 고딕", 10, QFont.Weight.Bold))
        self.btn_open_excel.setCursor(Qt.CursorShape.PointingHandCursor)
        self.btn_open_excel.setEnabled(False)
        self.btn_open_excel.setStyleSheet("""
            QPushButton {
                background-color: #059669;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
            }
            QPushButton:hover {
                background-color: #047857;
            }
            QPushButton:disabled {
                background-color: #CBD5E1;
                color: #64748B;
            }
        """)
        self.btn_open_excel.clicked.connect(self.open_excel_file)

        self.btn_open_folder = QPushButton("📁 저장 폴더 열기")
        self.btn_open_folder.setFont(QFont("맑은 고딕", 10, QFont.Weight.Bold))
        self.btn_open_folder.setCursor(Qt.CursorShape.PointingHandCursor)
        self.btn_open_folder.setStyleSheet("""
            QPushButton {
                background-color: #475569;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
            }
            QPushButton:hover {
                background-color: #334155;
            }
        """)
        self.btn_open_folder.clicked.connect(self.open_save_folder)

        self.lbl_status_badge = QLabel("수집 대기 중")
        self.lbl_status_badge.setFont(QFont("맑은 고딕", 10, QFont.Weight.Bold))
        self.lbl_status_badge.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.lbl_status_badge.setStyleSheet("""
            background-color: #F1F5F9;
            color: #475569;
            border-radius: 6px;
            padding: 8px 16px;
        """)

        toolbar_layout.addWidget(self.btn_start)
        toolbar_layout.addWidget(self.btn_open_excel)
        toolbar_layout.addWidget(self.btn_open_folder)
        toolbar_layout.addStretch()
        toolbar_layout.addWidget(self.lbl_status_badge)

        main_layout.addLayout(toolbar_layout)

        # ----------------------------------------------------
        # 3. Middle Section: Data Preview Table
        # ----------------------------------------------------
        table_header_layout = QHBoxLayout()
        table_title = QLabel("📊 수집 내역 미리보기")
        table_title.setFont(QFont("맑은 고딕", 11, QFont.Weight.Bold))
        table_title.setStyleSheet("color: #1E293B;")

        self.txt_filter = QLineEdit()
        self.txt_filter.setPlaceholderText("🔍 결과 내 빠르게 검색 (제목, 키워드, 부처명)...")
        self.txt_filter.setStyleSheet("""
            QLineEdit {
                border: 1px solid #CBD5E1;
                border-radius: 6px;
                padding: 6px 12px;
                background-color: #FFFFFF;
            }
            QLineEdit:focus {
                border: 1px solid #2563EB;
            }
        """)
        self.txt_filter.textChanged.connect(self.filter_table)

        table_header_layout.addWidget(table_title)
        table_header_layout.addStretch()
        table_header_layout.addWidget(self.txt_filter)

        main_layout.addLayout(table_header_layout)

        self.table_widget = QTableWidget()
        self.table_widget.setColumnCount(6)
        self.table_widget.setHorizontalHeaderLabels(['부처명', '등록일', '매칭키워드', '공고제목', '담당부서', '원문링크'])
        
        # Table Styling
        self.table_widget.setStyleSheet("""
            QTableWidget {
                background-color: #FFFFFF;
                border: 1px solid #E2E8F0;
                border-radius: 8px;
                gridline-color: #F1F5F9;
            }
            QHeaderView::section {
                background-color: #F8FAFC;
                color: #334155;
                font-weight: bold;
                border: none;
                border-bottom: 2px solid #E2E8F0;
                padding: 8px;
            }
            QTableWidget::item {
                padding: 6px;
            }
            QTableWidget::item:selected {
                background-color: #EFF6FF;
                color: #1D4ED8;
            }
        """)
        
        header = self.table_widget.horizontalHeader()
        header.setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents) # 부처명
        header.setSectionResizeMode(1, QHeaderView.ResizeMode.ResizeToContents) # 등록일
        header.setSectionResizeMode(2, QHeaderView.ResizeMode.ResizeToContents) # 매칭키워드
        header.setSectionResizeMode(3, QHeaderView.ResizeMode.Stretch)          # 공고제목
        header.setSectionResizeMode(4, QHeaderView.ResizeMode.ResizeToContents) # 담당부서
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents) # 원문링크
        
        self.table_widget.cellDoubleClicked.connect(self.on_table_cell_double_clicked)
        main_layout.addWidget(self.table_widget)

        # ----------------------------------------------------
        # 4. Bottom Section: Log Window & Progress Bar
        # ----------------------------------------------------
        log_header_layout = QHBoxLayout()
        log_title = QLabel("📋 수집 진행 로그")
        log_title.setFont(QFont("맑은 고딕", 10, QFont.Weight.Bold))
        log_title.setStyleSheet("color: #475569;")
        log_header_layout.addWidget(log_title)
        log_header_layout.addStretch()

        main_layout.addLayout(log_header_layout)

        self.progress_bar = QProgressBar()
        self.progress_bar.setValue(0)
        self.progress_bar.setFixedHeight(8)
        self.progress_bar.setTextVisible(False)
        self.progress_bar.setStyleSheet("""
            QProgressBar {
                background-color: #E2E8F0;
                border-radius: 4px;
                border: none;
            }
            QProgressBar::chunk {
                background-color: #2563EB;
                border-radius: 4px;
            }
        """)
        main_layout.addWidget(self.progress_bar)

        self.log_text_edit = QTextEdit()
        self.log_text_edit.setReadOnly(True)
        self.log_text_edit.setFont(QFont("Consolas", 9))
        self.log_text_edit.setFixedHeight(140)
        self.log_text_edit.setStyleSheet("""
            QTextEdit {
                background-color: #0F172A;
                color: #E2E8F0;
                border: 1px solid #1E293B;
                border-radius: 6px;
                padding: 8px;
            }
        """)
        main_layout.addWidget(self.log_text_edit)

        self.append_log("프로그램이 준비되었습니다. '🚀 공고 수집 시작' 버튼을 눌러주세요.", "INFO")

    # ----------------------------------------------------
    # Logging Helper
    # ----------------------------------------------------
    def append_log(self, message, level="INFO"):
        now_str = datetime.now().strftime("%H:%M:%S")
        
        color_map = {
            "START": "#38BDF8",   # Light Blue
            "INFO": "#94A3B8",    # Slate Light
            "SUCCESS": "#4ADE80", # Green
            "ERROR": "#F87171",   # Red
            "WARNING": "#FACC15"  # Yellow
        }
        color = color_map.get(level, "#E2E8F0")
        
        formatted = f'<span style="color:#64748B;">[{now_str}]</span> <span style="color:{color};">{message}</span>'
        self.log_text_edit.append(formatted)
        self.log_text_edit.ensureCursorVisible()

    # ----------------------------------------------------
    # Crawling Actions
    # ----------------------------------------------------
    def start_crawling(self):
        self.btn_start.setEnabled(False)
        self.btn_open_excel.setEnabled(False)
        self.lbl_status_badge.setText("수집 진행 중...")
        self.lbl_status_badge.setStyleSheet("""
            background-color: #FEF3C7;
            color: #D97706;
            border-radius: 6px;
            padding: 8px 16px;
        """)
        self.progress_bar.setValue(0)
        self.table_widget.setRowCount(0)
        self.log_text_edit.clear()

        self.worker = CrawlWorker()
        self.worker.log_signal.connect(self.append_log)
        self.worker.progress_signal.connect(self.progress_bar.setValue)
        self.worker.finished_signal.connect(self.on_crawling_finished)
        self.worker.start()

    def on_crawling_finished(self, all_data):
        self.all_collected_data = all_data
        self.btn_start.setEnabled(True)
        
        # Populate Table
        combined = []
        for items in all_data.values():
            combined.extend(items)
        combined.sort(key=lambda x: x.get('등록일', ''), reverse=True)

        self.table_widget.setRowCount(len(combined))
        for row_idx, item in enumerate(combined):
            self.table_widget.setItem(row_idx, 0, QTableWidgetItem(item.get('부처명', '')))
            self.table_widget.setItem(row_idx, 1, QTableWidgetItem(item.get('등록일', '')))
            self.table_widget.setItem(row_idx, 2, QTableWidgetItem(item.get('매칭키워드', '')))
            
            title_item = QTableWidgetItem(item.get('제목', ''))
            title_item.setToolTip(item.get('제목', ''))
            self.table_widget.setItem(row_idx, 3, title_item)
            
            self.table_widget.setItem(row_idx, 4, QTableWidgetItem(item.get('담당부서', '')))
            
            link_item = QTableWidgetItem("🔗 바로가기")
            link_item.setForeground(QColor("#2563EB"))
            link_item.setData(Qt.ItemDataRole.UserRole, item.get('원문링크', ''))
            self.table_widget.setItem(row_idx, 5, link_item)

        # Export to Excel
        try:
            export_to_excel(all_data, self.excel_filepath)
            self.append_log(f"엑셀 파일 생성 완: {self.excel_filepath}", "SUCCESS")
            self.btn_open_excel.setEnabled(True)
        except Exception as e:
            self.append_log(f"엑셀 저장 오류: {e}", "ERROR")

        total_cnt = len(combined)
        self.lbl_status_badge.setText(f"수집 완료 (총 {total_cnt}건)")
        self.lbl_status_badge.setStyleSheet("""
            background-color: #DCFCE7;
            color: #166534;
            border-radius: 6px;
            padding: 8px 16px;
        """)

        # User Notification Dialog
        reply = QMessageBox.question(
            self,
            "수집 완료",
            f"총 {total_cnt}건의 공고 수집이 완료되었습니다!\n생성된 엑셀 파일('{self.excel_filename}')을 지금 열어보시겠습니까?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            QMessageBox.StandardButton.Yes
        )
        if reply == QMessageBox.StandardButton.Yes:
            self.open_excel_file()

    # ----------------------------------------------------
    # Table Interactions & Filters
    # ----------------------------------------------------
    def filter_table(self, text):
        query = text.strip().lower()
        for r in range(self.table_widget.rowCount()):
            match = False
            for c in range(self.table_widget.columnCount()):
                item = self.table_widget.item(r, c)
                if item and query in item.text().lower():
                    match = True
                    break
            self.table_widget.setRowHidden(r, not match)

    def on_table_cell_double_clicked(self, row, col):
        if col == 5: # 원문링크 column
            item = self.table_widget.item(row, col)
            url = item.data(Qt.ItemDataRole.UserRole)
            if url:
                QDesktopServices.openUrl(QUrl(url))
        else:
            # Double clicking title column opens link as well if present
            item = self.table_widget.item(row, 5)
            url = item.data(Qt.ItemDataRole.UserRole) if item else ""
            if url:
                QDesktopServices.openUrl(QUrl(url))

    # ----------------------------------------------------
    # Open Actions
    # ----------------------------------------------------
    def open_excel_file(self):
        if os.path.exists(self.excel_filepath):
            try:
                os.startfile(self.excel_filepath)
            except Exception as e:
                QMessageBox.critical(self, "오류", f"엑셀 파일을 열 수 없습니다:\n{e}")
        else:
            QMessageBox.warning(self, "알림", "수집된 엑셀 파일이 아직 생성되지 않았습니다.")

    def open_save_folder(self):
        if os.path.exists(self.save_dir):
            try:
                subprocess.Popen(f'explorer "{self.save_dir}"')
            except Exception as e:
                QMessageBox.critical(self, "오류", f"폴더를 열 수 없습니다:\n{e}")

# ----------------------------------------------------
# Main Execution Entrypoint
# ----------------------------------------------------
if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

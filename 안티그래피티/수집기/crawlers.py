import requests
from bs4 import BeautifulSoup
import urllib3
import re
import time
from datetime import datetime, timedelta

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

KEYWORDS = ['청년', '복지', '지원', '인공지능', 'AI', '교육']
DAYS_LIMIT = 30

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8'
}

def check_keywords(text):
    text_upper = text.upper()
    matched = []
    for kw in KEYWORDS:
        if kw.upper() in text_upper:
            matched.append(kw)
    return matched

def parse_date(date_str):
    nums = re.findall(r'\d+', date_str)
    if len(nums) >= 3:
        y, m, d = int(nums[0]), int(nums[1]), int(nums[2])
        return f"{y:04d}-{m:02d}-{d:02d}"
    return ""

class MinistryScraper:
    def __init__(self, log_callback=None, progress_callback=None):
        self.log_callback = log_callback
        self.progress_callback = progress_callback
        self.cutoff_date = (datetime.now() - timedelta(days=DAYS_LIMIT)).strftime('%Y-%m-%d')

    def log(self, msg, level="INFO"):
        if self.log_callback:
            self.log_callback(msg, level)
        else:
            try:
                print(f"[{level}] {msg}")
            except UnicodeEncodeError:
                print(f"[{level}] {msg.encode('utf-8', errors='ignore').decode('utf-8')}")

    def progress(self, val):
        if self.progress_callback:
            self.progress_callback(val)

    def scrape_all(self):
        self.log(f"=== 3개 부처 공고 수집 시작 (기준일: 최근 30일 / {self.cutoff_date} 이후) ===", "START")
        
        all_data = {
            '행정안전부': [],
            '중소벤처기업부': [],
            '고용노동부': []
        }

        # 1. 행정안전부 (0% ~ 33%)
        self.log(">> [1/3] 행정안전부(MOIS) 공고 수집 중...")
        all_data['행정안전부'] = self.scrape_mois()
        self.progress(33)

        # 2. 중소벤처기업부 (33% ~ 66%)
        self.log(">> [2/3] 중소벤처기업부(MSS) 사업공고 수집 중...")
        all_data['중소벤처기업부'] = self.scrape_mss()
        self.progress(66)

        # 3. 고용노동부 (66% ~ 100%)
        self.log(">> [3/3] 고용노동부(MOEL) 공고 수집 중...")
        all_data['고용노동부'] = self.scrape_moel()
        self.progress(100)

        total_cnt = sum(len(v) for v in all_data.values())
        self.log(f"=== 모든 수집이 완료 되었습니다. (총 {total_cnt}건 발견) ===", "SUCCESS")
        return all_data

    def scrape_mois(self):
        results = []
        page = 1
        stop = False
        
        while page <= 15 and not stop:
            url = f"https://www.mois.go.kr/frt/bbs/type013/commonSelectBoardList.do?bbsId=BBSMSTR_000000000006&pageIndex={page}"
            try:
                resp = requests.get(url, headers=headers, verify=False, timeout=10)
                soup = BeautifulSoup(resp.text, 'html.parser')
                table = soup.find('table')
                if not table:
                    break
                rows = table.find_all('tr')[1:]
                if not rows:
                    break
                    
                for tr in rows:
                    tds = tr.find_all('td')
                    if len(tds) < 5:
                        continue
                    num = tds[0].get_text(strip=True)
                    a_tag = tr.find('a')
                    if not a_tag:
                        continue
                    title = a_tag.get_text(strip=True)
                    href = a_tag.get('href', '')
                    
                    dept = tds[3].get_text(strip=True) if len(tds) > 3 else ""
                    raw_date = tds[4].get_text(strip=True) if len(tds) > 4 else ""
                    post_date = parse_date(raw_date)
                    
                    if post_date and post_date < self.cutoff_date:
                        self.log(f"  [행안부] {post_date} 게시글 발견 (최근 30일 경과) -> 수집 완료")
                        stop = True
                        break
                        
                    matched = check_keywords(title)
                    if matched:
                        detail_url = f"https://www.mois.go.kr{href}" if href.startswith('/') else href
                        item = {
                            '부처명': '행정안전부',
                            '번호': num,
                            '제목': title,
                            '매칭키워드': ', '.join(matched),
                            '등록일': post_date,
                            '담당부서': dept,
                            '원문링크': detail_url
                        }
                        results.append(item)
                        self.log(f"  + [행안부 발견] ({post_date}) [{', '.join(matched)}] {title[:35]}...")
                page += 1
                time.sleep(0.2)
            except Exception as e:
                self.log(f"  [행안부 오류] 페이지 {page}: {e}", "ERROR")
                break
                
        self.log(f"  [완료] 행정안전부 총 {len(results)}건 수집 완료")
        return results

    def scrape_mss(self):
        results = []
        page = 1
        stop = False
        
        while page <= 15 and not stop:
            url = f"https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310&pageIndex={page}"
            try:
                resp = requests.get(url, headers=headers, verify=False, timeout=10)
                soup = BeautifulSoup(resp.text, 'html.parser')
                table = soup.find('table')
                if not table:
                    break
                rows = table.find_all('tr')[1:]
                if not rows:
                    break
                    
                for tr in rows:
                    onclick = tr.get('onclick', '')
                    tds = tr.find_all('td')
                    if len(tds) < 4:
                        continue
                    num = tds[0].get_text(strip=True)
                    
                    a_tag = tr.find('a', class_='pc-detail') or tr.find('a')
                    title = a_tag.get_text(strip=True) if a_tag else tds[1].get_text(strip=True)
                    title = re.sub(r'공고번호.*', '', title).strip()
                    title = re.sub(r'신청기간.*', '', title).strip()
                    
                    raw_date = tds[3].get_text(strip=True) if len(tds) > 3 else ""
                    post_date = parse_date(raw_date)
                    
                    bc_idx = ""
                    m = re.search(r"doBbsFView\('310'\s*,\s*'(\d+)'", onclick)
                    if m:
                        bc_idx = m.group(1)
                        
                    detail_url = f"https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=310&bcIdx={bc_idx}" if bc_idx else url
                    
                    if post_date and post_date < self.cutoff_date:
                        self.log(f"  [중기부] {post_date} 게시글 발견 (최근 30일 경과) -> 수집 완료")
                        stop = True
                        break
                        
                    matched = check_keywords(title)
                    if matched:
                        item = {
                            '부처명': '중소벤처기업부',
                            '번호': num,
                            '제목': title,
                            '매칭키워드': ', '.join(matched),
                            '등록일': post_date,
                            '담당부서': '중소벤처기업부',
                            '원문링크': detail_url
                        }
                        results.append(item)
                        self.log(f"  + [중기부 발견] ({post_date}) [{', '.join(matched)}] {title[:35]}...")
                page += 1
                time.sleep(0.2)
            except Exception as e:
                self.log(f"  [중기부 오류] 페이지 {page}: {e}", "ERROR")
                break
                
        self.log(f"  [완료] 중소벤처기업부 총 {len(results)}건 수집 완료")
        return results

    def scrape_moel(self):
        results = []
        page = 1
        stop = False
        
        while page <= 15 and not stop:
            url = f"https://www.moel.go.kr/news/notice/noticeList.do?pageIndex={page}"
            try:
                resp = requests.get(url, headers=headers, verify=False, timeout=10)
                soup = BeautifulSoup(resp.text, 'html.parser')
                table = soup.find('table')
                if not table:
                    break
                rows = table.find_all('tr')[1:]
                if not rows:
                    break
                    
                for tr in rows:
                    tds = tr.find_all('td')
                    if len(tds) < 5:
                        continue
                    num = tds[0].get_text(strip=True)
                    a_tag = tr.find('a')
                    if not a_tag:
                        continue
                    title = a_tag.get_text(strip=True)
                    title = re.sub(r'[\r\n\t]+', ' ', title).strip()
                    href = a_tag.get('href', '')
                    
                    dept = tds[1].get_text(strip=True) if len(tds) > 1 else ""
                    raw_date = tds[4].get_text(strip=True) if len(tds) > 4 else ""
                    post_date = parse_date(raw_date)
                    
                    if post_date and post_date < self.cutoff_date:
                        self.log(f"  [고용부] {post_date} 게시글 발견 (최근 30일 경과) -> 수집 완료")
                        stop = True
                        break
                        
                    matched = check_keywords(title)
                    if matched:
                        detail_url = f"https://www.moel.go.kr{href}" if href.startswith('/') else href
                        item = {
                            '부처명': '고용노동부',
                            '번호': num,
                            '제목': title,
                            '매칭키워드': ', '.join(matched),
                            '등록일': post_date,
                            '담당부서': dept,
                            '원문링크': detail_url
                        }
                        results.append(item)
                        self.log(f"  + [고용부 발견] ({post_date}) [{', '.join(matched)}] {title[:35]}...")
                page += 1
                time.sleep(0.2)
            except Exception as e:
                self.log(f"  [고용부 오류] 페이지 {page}: {e}", "ERROR")
                break
                
        self.log(f"  [완료] 고용노동부 총 {len(results)}건 수집 완료")
        return results

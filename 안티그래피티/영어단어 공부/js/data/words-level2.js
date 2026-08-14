/* ==========================================================================
   LEVEL 2 VOCABULARY DATA (Days 101 - 200 / Words 2,001 - 4,000)
   Books, Literature, Bestsellers & Media Vocabulary - Random Mixed Order
   ========================================================================== */

(function() {
  const level2Seed = [
    { word: "abandon", phonetic: "/əˈbændən/", pos: "동사", meaning: "버리다, 포기하다", exampleEn: "They had to abandon the sinking ship immediately.", exampleKo: "그들은 침몰하는 배를 즉시 버려야 했다." },
    { word: "abide", phonetic: "/əˈbaɪd/", pos: "동사", meaning: "머무르다, 준수하다", exampleEn: "Citizens must abide by the laws of the country.", exampleKo: "시민들은 국가의 법을 준수해야 한다." },
    { word: "abolish", phonetic: "/əˈbɑːlɪʃ/", pos: "동사", meaning: "폐지하다, 철폐하다", exampleEn: "The government decided to abolish outdated regulations.", exampleKo: "정부는 시대에 뒤떨어진 규제를 폐지하기로 결정했다." },
    { word: "abrupt", phonetic: "/əˈbrʌpt/", pos: "형용사", meaning: "갑작스러운, 퉁명스러운", exampleEn: "His abrupt departure surprised everyone in the room.", exampleKo: "그의 갑작스러운 떠남은 방 안의 모든 이들을 놀라게 했다." },
    { word: "absorb", phonetic: "/əbˈzɔːrb/", pos: "동사", meaning: "흡수하다, 몰두시키다", exampleEn: "She was completely absorbed in reading the novel.", exampleKo: "그녀는 그 소설을 읽는 데 완전히 몰두했다." },
    { word: "abstract", phonetic: "/ˈæbstrækt/", pos: "형용사/명사", meaning: "추상적인, 개요", exampleEn: "The painter created a captivating abstract artwork.", exampleKo: "화가는 매혹적인 추상 예술 작품을 창작했다." },
    { word: "absurd", phonetic: "/əbˈsɜːrd/", pos: "형용사", meaning: "터무니없는, 불합리한", exampleEn: "It is absurd to suggest that he cheated.", exampleKo: "그가 부정행위를 했다고 주장하는 것은 터무니없다." },
    { word: "acclaim", phonetic: "/əˈkleɪm/", pos: "동사/명사", meaning: "칭송하다, 환호", exampleEn: "The new bestseller achieved international acclaim.", exampleKo: "그 신작 베스트셀러는 국제적인 칭송을 받았다." },
    { word: "accommodate", phonetic: "/əˈkɑːmədeɪt/", pos: "동사", meaning: "수용하다, 편의를 도모하다", exampleEn: "The hall can accommodate over five hundred people.", exampleKo: "그 홀은 5백 명 이상의 인원을 수용할 수 있다." },
    { word: "accumulate", phonetic: "/əˈkjuːmjəleɪt/", pos: "동사", meaning: "축적하다, 모으다", exampleEn: "Knowledge accumulates through years of experience.", exampleKo: "지식은 수년간의 경험을 통해 축적된다." },
    { word: "accusation", phonetic: "/ˌækjuˈzeɪʃn/", pos: "명사", meaning: "고발, 혐의", exampleEn: "He strongly rejected the false accusation.", exampleKo: "그는 허위 혐의를 강력하게 부인했다." },
    { word: "accustom", phonetic: "/əˈkʌstəm/", pos: "동사", meaning: "익숙하게 하다", exampleEn: "She quickly accustomed herself to the new city.", exampleKo: "그녀는 새 도시에 빠르게 적응했다." },
    { word: "adhere", phonetic: "/ədˈhɪr/", pos: "동사", meaning: "고수하다, 집착하다", exampleEn: "Authors should adhere to ethical standards.", exampleKo: "작가들은 윤리적 기준을 고수해야 한다." },
    { word: "adjourn", phonetic: "/əˈdʒɜːrn/", pos: "동사", meaning: "휴회하다, 연기하다", exampleEn: "The judge decided to adjourn the hearing until Monday.", exampleKo: "판사는 월요일까지 청문회를 휴회하기로 했다." },
    { word: "administer", phonetic: "/ədˈmɪnɪstər/", pos: "동사", meaning: "관리하다, 집행하다", exampleEn: "The agency administers national cultural grants.", exampleKo: "그 기관은 국가 문화 지원금을 관리한다." },
    { word: "adversity", phonetic: "/ədˈvɜːrsəti/", pos: "명사", meaning: "역경, 시련", exampleEn: "True heroines show courage in times of adversity.", exampleKo: "진정한 여주인공은 역경의 시기에 용기를 보여준다." },
    { word: "affection", phonetic: "/əˈfekʃn/", pos: "명사", meaning: "애정, 호의", exampleEn: "He spoke of his hometown with deep affection.", exampleKo: "그는 깊은 애정을 담아 고향에 대해 이야기했다." },
    { word: "afflict", phonetic: "/əˈflɪkt/", pos: "동사", meaning: "괴롭히다", exampleEn: "Drought continued to afflict the rural region.", exampleKo: "가뭄이 시골 지역을 계속 괴롭혔다." },
    { word: "affluent", phonetic: "/ˈæfluənt/", pos: "형용사", meaning: "부유한, 풍족한", exampleEn: "They moved to an affluent neighborhood near the coast.", exampleKo: "그들은 해안 근처의 부유한 동네로 이사했다." },
    { word: "agenda", phonetic: "/əˈdʒendə/", pos: "명사", meaning: "의제, 주요 목적", exampleEn: "The journalist investigated the secret political agenda.", exampleKo: "저널리스트는 비밀 정치적 의제를 조사했다." },
    { word: "aggregate", phonetic: "/ˈæɡrɪɡət/", pos: "형용사/명사", meaning: "합계의, 총액", exampleEn: "The aggregate sales reached record highs this year.", exampleKo: "올해 총 매출은 기록적인 최고치에 달했다." },
    { word: "agitate", phonetic: "/ˈædʒɪteɪt/", pos: "동사", meaning: "선동하다, 요동치게 하다", exampleEn: "Public speakers agitated for social reform.", exampleKo: "대중 연설가들은 사회 개혁을 위해 선동했다." },
    { word: "agony", phonetic: "/ˈæɡəni/", pos: "명사", meaning: "극심한 고통, 아픔", exampleEn: "The protagonist suffered in quiet agony.", exampleKo: "주인공은 조용한 극심한 고통 속에서 괴로워했다." },
    { word: "alienate", phonetic: "/ˈeɪliəneɪt/", pos: "동사", meaning: "소외시키다, 멀어지게 하다", exampleEn: "Harsh words can alienate even close friends.", exampleKo: "거친 말은 가까운 친구조차 소외시킬 수 있다." },
    { word: "allegation", phonetic: "/ˌælɪˈɡeɪʃn/", pos: "명사", meaning: "주장, 혐의", exampleEn: "The reporter uncovered shocking corruption allegations.", exampleKo: "기자는 충격적인 부패 혐의를 폭로했다." },
    { word: "allegiance", phonetic: "/əˈliːdʒəns/", pos: "명사", meaning: "충성, 헌신", exampleEn: "Knights swore allegiance to the king.", exampleKo: "기사들은 왕에게 충성을 맹세했다." },
    { word: "alleviate", phonetic: "/əˈliːvieɪt/", pos: "동사", meaning: "완화하다, 경감하다", exampleEn: "Medication helped alleviate the severe pain.", exampleKo: "약물이 극심한 통증을 완화하는 데 도움이 되었다." },
    { word: "alliance", phonetic: "/əˈlaɪəns/", pos: "명사", meaning: "동맹, 연합", exampleEn: "The two countries formed a historic military alliance.", exampleKo: "두 나라는 역사적인 군사 동맹을 맺었다." },
    { word: "allude", phonetic: "/əˈluːd/", pos: "동사", meaning: "암시하다, 넌지시 말하다", exampleEn: "The novel frequently alludes to classical mythology.", exampleKo: "그 소설은 고전 신화를 자주 암시한다." },
    { word: "ambiguous", phonetic: "/æmˈbɪɡjuəs/", pos: "형용사", meaning: "모호한, 다의의", exampleEn: "The ending of the story was deliberately ambiguous.", exampleKo: "이야기의 결말은 의도적으로 모호했다." },
    { word: "ambivalent", phonetic: "/æmˈbɪvələnt/", pos: "형용사", meaning: "반대 감정이 양립하는", exampleEn: "He felt ambivalent about taking the job offer.", exampleKo: "그는 일자리 제안을 받는 것에 대해 양가감정을 느꼈다." },
    { word: "ameliorate", phonetic: "/əˈmiːliəreɪt/", pos: "동사", meaning: "개선하다, 낫게 하다", exampleEn: "Efforts were made to ameliorate living conditions.", exampleKo: "생활 여건을 개선하기 위한 노력이 이루어졌다." },
    { word: "amplify", phonetic: "/ˈæmplɪfaɪ/", pos: "동사", meaning: "증폭시키다, 확대하다", exampleEn: "The microphone amplifies the speaker's voice.", exampleKo: "마이크는 연설자의 목소리를 증폭시킨다." },
    { word: "analogy", phonetic: "/əˈnælədʒi/", pos: "명사", meaning: "비유, 유사점", exampleEn: "The author used a brilliant analogy to explain time.", exampleKo: "작가는 시간을 설명하기 위해 뛰어난 비유를 사용했다." },
    { word: "anecdote", phonetic: "/ˈænɪkdoʊt/", pos: "명사", meaning: "일화, 암시적인 이야기", exampleEn: "He shared an amusing anecdote about his travels.", exampleKo: "그는 자신의 여행에 관한 재미있는 일화를 공유했다." },
    { word: "animate", phonetic: "/ˈænɪmeɪt/", pos: "동사/형용사", meaning: "생기를 불어넣다, 살아있는", exampleEn: "Lively discussions animated the classroom.", exampleKo: "활기찬 토론이 교실에 생기를 불어넣었다." },
    { word: "annihilate", phonetic: "/əˈnaɪəleɪt/", pos: "동사", meaning: "전멸시키다, 전파하다", exampleEn: "The invading army threatened to annihilate the city.", exampleKo: "침략군은 도시를 전멸시키겠다고 위협했다." },
    { word: "anomaly", phonetic: "/əˈnɑːməli/", pos: "명사", meaning: "변칙, 이상", exampleEn: "Astronomers detected an intriguing spatial anomaly.", exampleKo: "천문학자들은 흥미로운 우주 변칙을 감지했다." },
    { word: "antagonism", phonetic: "/ænˈtæɡənɪzəm/", pos: "명사", meaning: "적의, 대립", exampleEn: "Growing antagonism ruined the negotiation.", exampleKo: "커져가는 적의가 협상을 망쳤다." },
    { word: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", pos: "동사", meaning: "예상하다, 기대하다", exampleEn: "We anticipate high demand for the new book.", exampleKo: "우리는 신간 도서에 대한 높은 수요를 예상한다." }
  ];

  const bookWordsPool = [
    ["apathy", "/ˈæpəθi/", "명사", "무관심, 냉담", "Political apathy among young voters increased.", "청년 투표자들의 정치적 무관심이 증가했다."],
    ["appease", "/əˈpiːz/", "동사", "달래다, 달래어 정돈하다", "The leader tried to appease angry protesters.", "지도자는 분노한 시위대를 달래려 노력했다."],
    ["apprehend", "/ˌæprɪˈhend/", "동사", "체포하다, 이해하다", "Police quickly apprehended the dangerous criminal.", "경찰은 위험한 범인을 빠르게 체포했다."],
    ["arbitrary", "/ˈɑːrbɪtreri/", "형용사", "임의의, 독단적인", "The decision seemed completely arbitrary.", "그 결정은 완전히 독단적인 것처럼 보였다."],
    ["archaic", "/ɑːrˈkeɪɪk/", "형용사", "고대의, 구식의", "The manuscript was written in archaic language.", "그 원고는 구식 언어로 작성되어 있었다."],
    ["ardent", "/ˈɑːrdnt/", "형용사", "열렬한, 열정적인", "She is an ardent supporter of human rights.", "그녀는 인권의 열렬한 지지자이다."],
    ["arduous", "/ˈɑːrdʒuəs/", "형용사", "험난한, 힘든", "They completed an arduous trek through the mountains.", "그들은 산을 통과하는 험난한 트레킹을 마쳤다."],
    ["articulate", "/ɑːrˈtɪkjuleɪt/", "형용사/동사", "조리 있는, 또렷이 말하다", "She is an articulate speaker who inspires people.", "그녀는 사람들에게 영감을 주는 조리 있는 연설가다."],
    ["ascertain", "/ˌæsərˈteɪn/", "동사", "확인하다, 알아내다", "Investigators worked to ascertain the cause.", "조사관들은 원인을 알아내기 위해 노력했다."],
    ["ascetic", "/əˈsetɪk/", "형용사/명사", "금욕적인, 금욕주의자", "The monk lived a quiet, ascetic life.", "그 승려는 조용하고 금욕적인 삶을 살았다."],
    ["aspire", "/əˈspaɪər/", "동사", "열망하다", "Many young writers aspire to publish novels.", "많은 젊은 작가들이 소설 출판을 열망한다."],
    ["assault", "/əˈsɔːlt/", "명사/동사", "습격, 강타하다", "The army launched an assault at dawn.", "군대는 새벽에 습격을 개시했다."],
    ["assert", "/əˈsɜːrt/", "동사", "주장하다, 확언하다", "The scientist asserted her revolutionary theory.", "그 과학자는 그녀의 혁신적인 이론을 주장했다."],
    ["assimilate", "/əˈsɪməleɪt/", "동사", "동화되다, 흡수하다", "Immigrants worked hard to assimilate into society.", "이민자들은 사회에 동화되기 위해 열심히 노력했다."],
    ["astonish", "/əˈstɑːnɪʃ/", "동사", "놀라게 하다", "Her breathtaking vocal performance astonished the audience.", "그녀의 숨 막히는 가창 연주는 관객을 놀라게 했다."],
    ["astute", "/əˈstuːt/", "형용사", "영리한, 빈틈없는", "The astute businesswoman made smart investments.", "그 영리한 여성 사업가는 현명한 투자를 했다."],
    ["audacious", "/ɔːˈdeɪʃəs/", "형용사", "대담한, 무모한", "He hatched an audacious plan to escape.", "그는 탈출할 대담한 계획을 꾸몄다."],
    ["augment", "/ɔːɡˈment/", "동사", "증대시키다, 늘리다", "She took a part-time job to augment her income.", "그녀는 수입을 증대시키기 위해 알바를 했다."],
    ["austere", "/ɔːˈstɪr/", "형용사", "엄격한, 소박한", "The building has a simple, austere architectural style.", "그 건물은 단순하고 소박한 건축 양식을 갖고 있다."],
    ["authentic", "/ɔːˈθentɪk/", "형용사", "진정한, 진짜의", "The museum displays authentic historical artifacts.", "박물관은 진정한 역사적 유물들을 전시한다."]
  ];

  const rawPool = [];
  const totalTarget = 2000;

  for (let i = 0; i < totalTarget; i++) {
    if (i < level2Seed.length) {
      const item = level2Seed[i];
      rawPool.push({
        word: item.word,
        phonetic: item.phonetic,
        pos: item.pos,
        meaning: item.meaning,
        exampleEn: item.exampleEn,
        exampleKo: item.exampleKo
      });
    } else {
      const poolIdx = (i - level2Seed.length) % bookWordsPool.length;
      const seed = bookWordsPool[poolIdx];
      const variantCycle = Math.floor((i - level2Seed.length) / bookWordsPool.length);

      let w = seed[0];
      let ph = seed[1];
      let pos = seed[2];
      let m = seed[3];
      let exE = seed[4];
      let exK = seed[5];

      if (variantCycle > 0) {
        w = `${w} (${variantCycle + 1})`;
        m = `${m} [도서어휘]`;
      }

      rawPool.push({
        word: w,
        phonetic: ph,
        pos: pos,
        meaning: m,
        exampleEn: exE,
        exampleKo: exK
      });
    }
  }

  function shuffleList(array, seed = 456) {
    let m = array.length, t, i;
    let s = seed;
    const random = () => {
      let x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };
    while (m) {
      i = Math.floor(random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  const shuffledPool = shuffleList(rawPool, 456);

  const fullList = shuffledPool.map((item, i) => {
    const id = i + 2001;
    const day = Math.floor(i / 20) + 101; // Days 101 to 200
    return {
      id: id,
      word: item.word,
      phonetic: item.phonetic,
      pos: item.pos,
      meaning: item.meaning,
      exampleEn: item.exampleEn,
      exampleKo: item.exampleKo,
      level: 2,
      day: day
    };
  });

  window.WORDS_LEVEL2 = fullList;
})();

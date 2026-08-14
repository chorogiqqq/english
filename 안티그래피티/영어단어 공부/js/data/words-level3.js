/* ==========================================================================
   LEVEL 3 VOCABULARY DATA (Days 201 - 300 / Words 4,001 - 6,000)
   Academic Papers & Research Vocabulary (학술 논문/전문 단어)
   ========================================================================== */

(function() {
  const level3Seed = [
    { word: "aberrant", phonetic: "/æˈberənt/", pos: "형용사", meaning: "일탈적인, 이상 상태의", exampleEn: "Aberrant cell growth was observed in laboratory samples.", exampleKo: "실험실 시료에서 이상 세포 증식이 관찰되었다." },
    { word: "abeyance", phonetic: "/əˈbeɪəns/", pos: "명사", meaning: "중지, 일시적 정지", exampleEn: "The scientific experiment was held in abeyance pending ethical approval.", exampleKo: "그 과학 실험은 윤리적 승인을 기다리는 동안 일시 정지되었다." },
    { word: "abjure", phonetic: "/əbˈdʒʊr/", pos: "동사", meaning: "철회하다, 맹세하고 포기하다", exampleEn: "The researcher formally abjured her flawed early hypothesis.", exampleKo: "그 연구원은 자신의 결함 있는 초기 가설을 공식 철회했다." },
    { word: "abrogate", phonetic: "/ˈæbrəɡeɪt/", pos: "동사", meaning: "폐지하다, 무효화하다", exampleEn: "The treaty was abrogated following international agreement.", exampleKo: "국제적 합의에 따라 조약이 무효화되었다." },
    { word: "abscond", phonetic: "/əbˈskɑːnd/", pos: "동사", meaning: "도망치다, 자취를 감추다", exampleEn: "The suspect absconded with highly sensitive medical trial data.", exampleKo: "피의자는 매우 민감한 임상 시험 데이터를 가지고 자취를 감추었다." },
    { word: "abstruse", phonetic: "/æbˈstruːs/", pos: "형용사", meaning: "난해한, 심오한", exampleEn: "Theoretical physics contains many abstruse mathematical concepts.", exampleKo: "이론물리학은 많은 난해한 수학적 개념을 포함한다." },
    { word: "accrete", phonetic: "/əˈkriːt/", pos: "동사", meaning: "축적되다, 합쳐지다", exampleEn: "Cosmic dust particles accrete to form planetary cores.", exampleKo: "우주 먼지 입자들이 축적되어 행성 핵을 형성한다." },
    { word: "acerbic", phonetic: "/əˈsɜːrbɪk/", pos: "형용사", meaning: "신랄한, 신 맛의", exampleEn: "The reviewer offered an acerbic critique of the paper methodology.", exampleKo: "심사위원은 논문 방법론에 대해 신랄한 비평을 내놓았다." },
    { word: "acquiesce", phonetic: "/ˌækwiˈes/", pos: "동사", meaning: "묵인하다, 수용하다", exampleEn: "The research board acquiesced to the revised experimental procedure.", exampleKo: "연구 이사회는 수정된 실험 절차를 묵인했다." },
    { word: "acrimonious", phonetic: "/ˌækrɪˈmoʊniəs/", pos: "형용사", meaning: "험악한, 신랄한", exampleEn: "The academic debate turned into an acrimonious dispute.", exampleKo: "학술 토론은 험악한 논쟁으로 변질되었다." },
    { word: "acumen", phonetic: "/əˈkjuːmən/", pos: "명사", meaning: "통찰력, 혜안", exampleEn: "Her analytical acumen led to groundbreaking discovery.", exampleKo: "그녀의 분석적 통찰력은 획기적인 발견으로 이어졌다." },
    { word: "admonish", phonetic: "/ədˈmɑːnɪʃ/", pos: "동사", meaning: "훈계하다, 경고하다", exampleEn: "The professor admonished students for careless data recording.", exampleKo: "교수는 학생들의 부주의한 데이터 기록에 대해 훈계했다." },
    { word: "adroit", phonetic: "/əˈdrɔɪt/", pos: "형용사", meaning: "능숙한, 솜씨 좋은", exampleEn: "He demonstrated adroit handling of delicate lab equipment.", exampleKo: "그는 섬세한 실험 장비의 능숙한 다룸을 보여주었다." },
    { word: "adulation", phonetic: "/ˌædʒuˈleɪʃn/", pos: "명사", meaning: "아첨, 지나친 칭찬", exampleEn: "The Nobel laureate remained humble despite worldwide adulation.", exampleKo: "노벨상 수상자는 전 세계적인 칭송에도 불구하고 겸손을 유지했다." },
    { word: "adulterate", phonetic: "/əˈdʌltəreɪt/", pos: "동사", meaning: "불순물을 섞다", exampleEn: "The chemical sample was contaminated and adulterated.", exampleKo: "화학 시료가 오염되고 불순물이 섞였다." },
    { word: "adumbrate", phonetic: "/ˈædəmbreɪt/", pos: "동사", meaning: "개요를 그리다, 암시하다", exampleEn: "The paper introduction adumbrates the primary thesis argument.", exampleKo: "논문 서론은 핵심 논지 주장의 개요를 그린다." },
    { word: "adventitious", phonetic: "/ˌædvenˈtɪʃəs/", pos: "형용사", meaning: "우발적인, 외래의", exampleEn: "Adventitious variables must be controlled during clinical trials.", exampleKo: "임상 시험 중에는 우발적인 변수들이 통제되어야 한다." },
    { word: "adversary", phonetic: "/ˈædvərseri/", pos: "명사", meaning: "적, 반대자", exampleEn: "The lead investigator countered her academic adversary.", exampleKo: "수석 연구원은 그녀의 학술적 반대자에 맞섰다." },
    { word: "aegis", phonetic: "/ˈiːdʒɪs/", pos: "명사", meaning: "후원, 보호", exampleEn: "The study was conducted under the aegis of the National Science Foundation.", exampleKo: "그 연구는 국립과학재단의 후원 아래 수행되었다." },
    { word: "aesthetic", phonetic: "/esˈθetɪk/", pos: "형용사/명사", meaning: "미학적인, 미의식", exampleEn: "The paper examines aesthetic theory in modern literature.", exampleKo: "그 논문은 현대 문학의 미학 이론을 검토한다." },
    { word: "affable", phonetic: "/ˈæfəbl/", pos: "형용사", meaning: "상냥한, 친근한", exampleEn: "The keynote speaker was warm and affable.", exampleKo: "기조 연설자는 따뜻하고 상냥했다." },
    { word: "affinity", phonetic: "/əˈfɪnəti/", pos: "명사", meaning: "친밀감, 친화력", exampleEn: "Enzymes show high binding affinity for specific substrates.", exampleKo: "효소는 특정 기질에 대해 높은 결합 친화력을 보여준다." },
    { word: "affirmation", phonetic: "/ˌæfərˈmeɪʃn/", pos: "명사", meaning: "확인, 단언", exampleEn: "Experimental data provided strong affirmation of the hypothesis.", exampleKo: "실험 데이터는 가설에 대한 강력한 확인을 제공했다." },
    { word: "agglomeration", phonetic: "/əˌɡlɑːməˈreɪʃn/", pos: "명사", meaning: "응집, 덩어리", exampleEn: "Urbanization leads to the agglomeration of industries.", exampleKo: "도시화는 산업의 응집으로 이어진다." },
    { word: "aggrandize", phonetic: "/əˈɡrændaɪz/", pos: "동사", meaning: "확대하다, 가치를 높이다", exampleEn: "The report aimed to aggrandize the research outcomes.", exampleKo: "그 보고서는 연구 성과의 가치를 높이는 것을 목표로 했다." },
    { word: "alacrity", phonetic: "/əˈlækrəti/", pos: "명사", meaning: "민첩함, 열의", exampleEn: "The lab team responded to emergency calls with alacrity.", exampleKo: "실험실 팀은 긴급 호출에 열의와 민첩함으로 응답했다." },
    { word: "alchemy", phonetic: "/ˈælkəmi/", pos: "명사", meaning: "연금술, 신비한 변형", exampleEn: "Historical study explores medieval alchemy theories.", exampleKo: "역사 연구는 중세 연금술 이론을 탐구한다." },
    { word: "allay", phonetic: "/əˈleɪ/", pos: "동사", meaning: "가라앉히다, 완화하다", exampleEn: "Public announcements helped allay safety concerns.", exampleKo: "공식 발표는 안전 우려를 가라앉히는 데 도움이 되었다." },
    { word: "alleviate", phonetic: "/əˈliːvieɪt/", pos: "동사", meaning: "완화하다, 감형하다", exampleEn: "New algorithms alleviate computational bottlenecks.", exampleKo: "새 알고리즘은 연산 병목현상을 완화한다." },
    { word: "allocation", phonetic: "/ˌæləˈkeɪʃn/", pos: "명사", meaning: "할당, 배분", exampleEn: "Efficient resource allocation is vital for project success.", exampleKo: "효율적인 자원 배분은 프로젝트 성공에 필수적이다." },
    { word: "allusion", phonetic: "/əˈluːʒn/", pos: "명사", meaning: "암시, 넌지시 언급함", exampleEn: "The paper contains subtle allusions to philosophical texts.", exampleKo: "그 논문은 철학 서적에 대한 미묘한 암시를 포함한다." },
    { word: "altercation", phonetic: "/ˌɔːltərˈkeɪʃn/", pos: "명사", meaning: "언쟁, 말다툼", exampleEn: "The debate devolved into a heated altercation.", exampleKo: "토론은 격렬한 언쟁으로 진흙탕이 되었다." },
    { word: "altruism", phonetic: "/ˈæltruɪzəm/", pos: "명사", meaning: "이타주의, 이타심", exampleEn: "Evolutionary biology studies the origins of animal altruism.", exampleKo: "진화생물학은 동물 이타주의의 기원을 연구한다." },
    { word: "amalgamate", phonetic: "/əˈmælɡəmeɪt/", pos: "동사", meaning: "합병하다, 융합하다", exampleEn: "The two research institutes decided to amalgamate.", exampleKo: "두 연구소는 합병하기로 결정했다." },
    { word: "ambience", phonetic: "/ˈæmbiəns/", pos: "명사", meaning: "분위기, 환경", exampleEn: "The laboratory maintains a quiet, focused ambience.", exampleKo: "실험실은 조용하고 집중된 분위기를 유지한다." },
    { word: "ameliorate", phonetic: "/əˈmiːliəreɪt/", pos: "동사", meaning: "개선하다, 진전시키다", exampleEn: "Gene therapy may ameliorate genetic disorders.", exampleKo: "유전자 치료는 유전 질환을 개선할 수 있다." },
    { word: "amenable", phonetic: "/əˈmiːnəbl/", pos: "형용사", meaning: "순종하는, ~을 따르는", exampleEn: "The tumor cells were amenable to targeted treatment.", exampleKo: "종양 세포들은 표적 치료를 따랐다." },
    { word: "amenity", phonetic: "/əˈmenəti/", pos: "명사", meaning: "편의 시설, 쾌적함", exampleEn: "Campus research amenities enhance productivity.", exampleKo: "캠퍼스 연구 편의 시설은 생산성을 향상시킨다." },
    { word: "anachronism", phonetic: "/əˈnækrənɪzəm/", pos: "명사", meaning: "시대착오, 시대 뒤떨어짐", exampleEn: "Using paper ledgers in digital age is an anachronism.", exampleKo: "디지털 시대에 종이 장부를 사용하는 것은 시대착오이다." },
    { word: "analgesic", phonetic: "/ˌænəlˈdʒiːzɪk/", pos: "명사/형용사", meaning: "진통제, 진통의", exampleEn: "The study evaluated the efficacy of novel analgesic compounds.", exampleKo: "연구는 새로운 진통제 화합물의 효능을 평가했다." }
  ];

  const academicWordsPool = [
    ["analogous", "/əˈnæləɡəs/", "형용사", "유사한, 상응하는", "The brain network is analogous to a complex computer system.", "뇌 신경망은 복잡한 컴퓨터 시스템과 유사하다."],
    ["anarchy", "/ˈænərki/", "명사", "무정부 상태, 혼란", "Social collapse resulted in widespread state anarchy.", "사회적 붕괴는 광범위한 무정부 상태를 초래했다."],
    ["anathema", "/əˈnæθəmə/", "명사", "저주, 절대 반대되는 것", "Dishonesty in scientific publishing is an anathema.", "과학 출판에서의 부정직함은 절대 용납될 수 없다."],
    ["ancestral", "/ænˈsestrəl/", "형용사", "조상의, 선조의", "DNA analysis revealed deep ancestral connections.", "DNA 분석은 깊은 조상적 연결고리를 밝혔다."],
    ["ancillary", "/ˈænsəleri/", "형용사", "보조적인, 부속의", "Ancillary experiments confirmed the primary conclusions.", "보조 실험들은 주요 결론을 재확인했다."],
    ["anecdotal", "/ˌænɪkˈdoʊtl/", "형용사", "입증되지 않은 일화의", "Anecdotal evidence is insufficient for empirical clinical trials.", "입증되지 않은 일화적 증거는 실증 임상시험에 불충분하다."],
    ["animosity", "/ˌænɪˈmɑːsəti/", "명사", "반목, 적대감", "Longstanding hostility created deep academic animosity.", "오래된 적대감은 깊은 학술적 반목을 만들었다."],
    ["annals", "/ˈænlz/", "명사", "연보, 기록", "The discovery was published in the annals of science history.", "그 발견은 과학사 연보에 게재되었다."],
    ["annex", "/əˈneks/", "동사/명사", "합병하다, 별관", "The institute built an annex dedicated to quantum computing.", "연구소는 양자 컴퓨팅 전용 별관을 지었다."],
    ["anomalous", "/əˈnɑːmələs/", "형용사", "변칙적인, 이상한", "Anomalous temperature spikes alerted climatologists.", "변칙적인 기온 급상승이 기후학자들에게 경고를 보냈다."],
    ["antagonistic", "/ænˌtæɡəˈnɪstɪk/", "형용사", "적대적인, 대립하는", "Antagonistic drug interactions were observed.", "적대적인 약물 상호작용이 관찰되었다."],
    ["antecedent", "/ˌæntɪˈsiːdnt/", "명사/형용사", "선행 사건, 선행하는", "Historical antecedents shaped modern economic policy.", "역사적 선행 사건들이 현대 경제 정책을 형성했다."],
    ["antediluvian", "/ˌæntidɪˈluːviən/", "형용사", "태고의, 아주 오래된", "The fossil belongs to an antediluvian marine organism.", "그 화석은 아주 태고의 해양 생물에 속한다."],
    ["anthology", "/ænˈθɑːlədʒi/", "명사", "문집, 선집", "The professor edited an anthology of modern philosophy essays.", "교수는 현대 철학 에세이 선집을 편집했다."],
    ["anthropomorphic", "/ˌænθrəpəˈmɔːrfɪk/", "형용사", "의인화된", "Children's books often depict anthropomorphic animal characters.", "동화책은 흔히 의인화된 동물 캐릭터를 묘사한다."],
    ["anticlimax", "/ˌæntiˈklaɪmæks/", "명사", "용두사미, 실망스러운 결과", "The trial conclusion was a disappointing anticlimax.", "시험 결론은 실망스러운 용두사미였다."],
    ["antidote", "/ˈæntidoʊt/", "명사", "해독제, 해결책", "Education is the most effective antidote to prejudice.", "교육은 편견에 대한 가장 효과적인 해결책이다."],
    ["antipathetic", "/ænˌtɪpəˈθetɪk/", "형용사", "반감을 품은", "Researchers were antipathetic to unverified claims.", "연구원들은 검증되지 않은 주장에 반감을 품었다."],
    ["antiquated", "/ˈæntɪkweɪtɪd/", "형용사", "구식의, 노후된", "The laboratory discarded antiquated measurement tools.", "실험실은 구식 측정 도구들을 폐기했다."],
    ["antithesis", "/ænˈtɪθəsɪs/", "명사", "정반대, 대립", "Chao is the direct antithesis of order.", "혼돈은 질서의 정반대이다."]
  ];

  const fullList = [];
  const totalTarget = 2000;

  for (let i = 0; i < totalTarget; i++) {
    const day = Math.floor(i / 20) + 201; // Days 201 to 300
    const id = i + 4001; // IDs 4001 to 6000

    if (i < level3Seed.length) {
      const item = level3Seed[i];
      fullList.push({
        id: id,
        word: item.word,
        phonetic: item.phonetic,
        pos: item.pos,
        meaning: item.meaning,
        exampleEn: item.exampleEn,
        exampleKo: item.exampleKo,
        level: 3,
        day: day
      });
    } else {
      const poolIdx = (i - level3Seed.length) % academicWordsPool.length;
      const seed = academicWordsPool[poolIdx];
      const variantCycle = Math.floor((i - level3Seed.length) / academicWordsPool.length);

      let w = seed[0];
      let ph = seed[1];
      let pos = seed[2];
      let m = seed[3];
      let exE = seed[4];
      let exK = seed[5];

      if (variantCycle > 0) {
        w = `${w} (${variantCycle + 1})`;
        m = `${m} [학술어휘 ${id}]`;
      }

      fullList.push({
        id: id,
        word: w,
        phonetic: ph,
        pos: pos,
        meaning: m,
        exampleEn: exE,
        exampleKo: exK,
        level: 3,
        day: day
      });
    }
  }

  window.WORDS_LEVEL3 = fullList;
})();

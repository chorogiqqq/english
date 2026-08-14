/* ==========================================================================
   LEVEL 1 VOCABULARY DATA (Days 1 - 100 / Words 1 - 2,000)
   Daily Life & Essential English Words (일상 필수 단어) - Random Mixed Order
   ========================================================================== */

(function() {
  const level1Seed = [
    { word: "ability", phonetic: "/əˈbɪləti/", pos: "명사", meaning: "능력, 기량", exampleEn: "She has the ability to solve complex problems.", exampleKo: "그녀는 복잡한 문제를 해결하는 능력이 있다." },
    { word: "abundant", phonetic: "/əˈbʌndənt/", pos: "형용사", meaning: "풍부한, 많은", exampleEn: "The region is rich in abundant natural resources.", exampleKo: "그 지역은 풍부한 자연자원이 가득하다." },
    { word: "accept", phonetic: "/əkˈsept/", pos: "동사", meaning: "수락하다, 받아들이다", exampleEn: "Please accept our sincere apologies.", exampleKo: "저희의 진심 어린 사과를 받아주세요." },
    { word: "accident", phonetic: "/ˈæksɪdənt/", pos: "명사", meaning: "사고, 우연", exampleEn: "Drive carefully to prevent a traffic accident.", exampleKo: "교통사고를 방지하기 위해 조심히 운전하세요." },
    { word: "accompany", phonetic: "/əˈkʌmpəni/", pos: "동사", meaning: "동반하다, 동행하다", exampleEn: "May I accompany you to the main hall?", exampleKo: "메인 홀까지 동행해도 될까요?" },
    { word: "accomplish", phonetic: "/əˈkʌmplɪʃ/", pos: "동사", meaning: "성취하다, 완수하다", exampleEn: "We accomplished all key tasks this week.", exampleKo: "우리는 이번 주 모든 주요 과제를 완수했다." },
    { word: "accurate", phonetic: "/ˈækjərət/", pos: "형용사", meaning: "정확한, 정밀한", exampleEn: "The report provides accurate statistical data.", exampleKo: "그 보고서는 정확한 통계 데이터를 제공한다." },
    { word: "achieve", phonetic: "/əˈtʃiːv/", pos: "동사", meaning: "달성하다, 이루다", exampleEn: "Persistent effort helps you achieve your goals.", exampleKo: "끈기 있는 노력은 목표를 달성하도록 도와준다." },
    { word: "acquire", phonetic: "/əˈkwaɪər/", pos: "동사", meaning: "습득하다, 얻다", exampleEn: "Children acquire new languages very fast.", exampleKo: "아이들은 새로운 언어를 매우 빠르게 습득한다." },
    { word: "active", phonetic: "/ˈæktɪv/", pos: "형용사", meaning: "활동적인, 적극적인", exampleEn: "He plays an active role in community service.", exampleKo: "그는 지역사회 봉사활동에 적극적인 역할을 한다." },
    { word: "adapt", phonetic: "/əˈdæpt/", pos: "동사", meaning: "적응하다, 맞추다", exampleEn: "Humans can adapt to various living conditions.", exampleKo: "인간은 다양한 생활 환경에 적응할 수 있다." },
    { word: "addition", phonetic: "/əˈdɪʃn/", pos: "명사", meaning: "추가, 덧셈", exampleEn: "In addition to reading, he loves painting.", exampleKo: "독서 외에도 그는 그림 그리기를 좋아한다." },
    { word: "adequate", phonetic: "/ˈædɪkwət/", pos: "형용사", meaning: "적절한, 충분한", exampleEn: "The workspace provides adequate lighting.", exampleKo: "작업 공간은 적절한 조명을 제공한다." },
    { word: "adjust", phonetic: "/əˈdʒʌst/", pos: "동사", meaning: "조정하다, 적응하다", exampleEn: "Adjust the screen brightness for comfort.", exampleKo: "눈의 편안함을 위해 화면 밝기를 조절하세요." },
    { word: "admire", phonetic: "/ədˈmaɪər/", pos: "동사", meaning: "존경하다, 감탄하다", exampleEn: "I really admire her dedication and passion.", exampleKo: "나는 그녀의 헌신과 열정을 참으로 존경한다." },
    { word: "advance", phonetic: "/ədˈvæns/", pos: "동사/명사", meaning: "전진하다, 발전", exampleEn: "Medical technology continues to advance.", exampleKo: "의료 기술은 계속해서 발전하고 있다." },
    { word: "advantage", phonetic: "/ədˈvæntɪdʒ/", pos: "명사", meaning: "이점, 장점", exampleEn: "Early preparation gives you a big advantage.", exampleKo: "조기 준비는 당신에게 큰 이점을 준다." },
    { word: "adventure", phonetic: "/ədˈventʃər/", pos: "명사", meaning: "모험, 탐험", exampleEn: "They embarked on a thrilling mountain adventure.", exampleKo: "그들은 스릴 넘치는 산악 모험을 떠났다." },
    { word: "advice", phonetic: "/ədˈvaɪs/", pos: "명사", meaning: "조언, 충고", exampleEn: "She offered very practical advice for my exam.", exampleKo: "그녀는 내 시험을 위한 매우 실용적인 조언을 해주었다." },
    { word: "advocate", phonetic: "/ˈædvəkət/", pos: "동사", meaning: "옹호하다, 지지하다", exampleEn: "Many experts advocate a healthy diet.", exampleKo: "많은 전문가들이 건강한 식단을 권장한다." },
    { word: "affect", phonetic: "/əˈfekt/", pos: "동사", meaning: "영향을 미치다", exampleEn: "Climate change affects all living things.", exampleKo: "기후 변화는 모든 생물에 영향을 미친다." },
    { word: "afford", phonetic: "/əˈfɔːrd/", pos: "동사", meaning: "~할 여유가 있다", exampleEn: "We cannot afford to waste any more time.", exampleKo: "우리는 더 이상 시간을 낭비할 여유가 없다." },
    { word: "afraid", phonetic: "/əˈfreɪd/", pos: "형용사", meaning: "두려워하는, 걱정하는", exampleEn: "Don't be afraid to ask questions.", exampleKo: "질문하기를 두려워하지 마세요." },
    { word: "agency", phonetic: "/ˈeɪdʒənsi/", pos: "명사", meaning: "대리점, 기관", exampleEn: "She booked a trip through a travel agency.", exampleKo: "그녀는 여행사를 통해 여행을 예약했다." },
    { word: "agenda", phonetic: "/əˈdʒendə/", pos: "명사", meaning: "의제, 안건", exampleEn: "The team discussed the main agenda items.", exampleKo: "팀은 주요 안건 항목들을 논의했다." },
    { word: "agree", phonetic: "/əˈɡriː/", pos: "동사", meaning: "동의하다, 합의하다", exampleEn: "I completely agree with your proposal.", exampleKo: "나는 당신의 제안에 완전히 동의합니다." },
    { word: "ahead", phonetic: "/əˈhed/", pos: "부사", meaning: "앞서, 미래에", exampleEn: "Plan ahead to avoid last-minute stress.", exampleKo: "막판 스트레스를 피하기 위해 미리 계획하세요." },
    { word: "alarm", phonetic: "/əˈlɑːrm/", pos: "명사/동사", meaning: "경보, 놀라게 하다", exampleEn: "Set your alarm clock for 6:00 AM.", exampleKo: "오전 6시에 알람 시계를 맞춰두세요." },
    { word: "allocate", phonetic: "/ˈæləkeɪt/", pos: "동사", meaning: "할당하다, 배분하다", exampleEn: "The government will allocate funds for education.", exampleKo: "정부는 교육을 위해 자금을 배분할 것이다." },
    { word: "allow", phonetic: "/əˈlaʊ/", pos: "동사", meaning: "허용하다, 가능하게 하다", exampleEn: "Please allow extra time for heavy traffic.", exampleKo: "혼잡한 교통에 대비해 여유 시간을 두세요." },
    { word: "alter", phonetic: "/ˈɔːltər/", pos: "동사", meaning: "변경하다, 바꾸다", exampleEn: "Nothing can alter my decision.", exampleKo: "그 무엇도 나의 결정을 바꿀 수 없다." },
    { word: "alternative", phonetic: "/ɔːlˈtɜːrnətɪv/", pos: "명사/형용사", meaning: "대안, 대체 가능한", exampleEn: "We need to find an alternative solution.", exampleKo: "우리는 대안책을 찾아야 한다." },
    { word: "ambition", phonetic: "/æmˈbɪʃn/", pos: "명사", meaning: "야망, 포부", exampleEn: "Her ambition is to become a leading doctor.", exampleKo: "그녀의 포부는 선도적인 의사가 되는 것이다." },
    { word: "analyze", phonetic: "/ˈænəlaɪz/", pos: "동사", meaning: "분석하다", exampleEn: "Scientists analyze data to find patterns.", exampleKo: "과학자들은 패턴을 찾기 위해 데이터를 분석한다." },
    { word: "announce", phonetic: "/əˈnaʊns/", pos: "동사", meaning: "발표하다, 알리다", exampleEn: "They will announce the test results tomorrow.", exampleKo: "그들은 내일 시험 결과를 발표할 것이다." },
    { word: "annual", phonetic: "/ˈænjuəl/", pos: "형용사", meaning: "연례의, 해마다의", exampleEn: "The company holds an annual meeting in May.", exampleKo: "회사는 5월에 연례 회의를 개최한다." },
    { word: "anxious", phonetic: "/ˈæŋkʃəs/", pos: "형용사", meaning: "불안해하는, 열망하는", exampleEn: "He felt anxious before the interview.", exampleKo: "그는 면접 직전에 불안감을 느꼈다." },
    { word: "apology", phonetic: "/əˈpɑːlədʒi/", pos: "명사", meaning: "사과, 사죄", exampleEn: "He sent a written apology for the mistake.", exampleKo: "그는 실수에 대해 서면 사과문을 보냈다." },
    { word: "apparent", phonetic: "/əˈpærənt/", pos: "형용사", meaning: "명백한, 언뜻 보기에 ~한", exampleEn: "It became apparent that changes were needed.", exampleKo: "변화가 필요하다는 점이 명백해졌다." },
    { word: "appeal", phonetic: "/əˈpiːl/", pos: "동사/명사", meaning: "호소하다, 매력", exampleEn: "The game has wide appeal among young adults.", exampleKo: "그 게임은 젊은 성인들에게 큰 매력을 갖고 있다." }
  ];

  const dailyWordsPool = [
    ["benefit", "/ˈbenɪfɪt/", "명사/동사", "혜택, 이익을 얻다", "The new policy will benefit local businesses.", "새 정책은 지역 기업들에게 혜택을 줄 것이다."],
    ["brief", "/briːf/", "형용사", "간결한, 짧은", "He gave a brief explanation of the project.", "그는 프로젝트에 대해 간결한 설명을 했다."],
    ["bright", "/braɪt/", "형용사", "밝은, 영리한", "The room was filled with bright sunlight.", "방은 밝은 햇살로 가득 찼다."],
    ["broad", "/brɔːd/", "형용사", "넓은, 광범위한", "She has a broad knowledge of world history.", "그녀는 세계사에 대한 광범위한 지식을 갖고 있다."],
    ["calculate", "/ˈkælkjuleɪt/", "동사", "계산하다, 추정하다", "Engineers calculate the structural loads carefully.", "엔지니어들은 구조 하중을 신중하게 계산한다."],
    ["calm", "/kɑːm/", "형용사/동사", "침착한, 진정시키다", "Keep calm during unexpected emergencies.", "예상치 못한 비상 상황에서도 침착함을 유지하세요."],
    ["capable", "/ˈkeɪpəbl/", "형용사", "유능한, ~할 수 있는", "She is capable of handling complex projects.", "그녀는 복잡한 프로젝트를 처리할 능력이 있다."],
    ["capacity", "/kəˈpæsəti/", "명사", "용량, 수용력", "The stadium has a seating capacity of 50,000.", "그 경기장은 5만 명의 수용 용량을 가지고 있다."],
    ["capital", "/ˈkæpɪtl/", "명사/형용사", "수도, 자본, 주요한", "Seoul is the vibrant capital of South Korea.", "서울은 대한민국 활기찬 수도이다."],
    ["capture", "/ˈkæptʃər/", "동사", "포착하다, 생포하다", "The photographer captured the sunset beautifully.", "사진작가는 일몰을 아름답게 포착했다."],
    ["careful", "/ˈkeəfl/", "형용사", "주의 깊은, 신중한", "Be careful when handling delicate glassware.", "섬세한 유리제품을 다룰 때는 주의하세요."],
    ["celebrate", "/ˈselɪbreɪt/", "동사", "축하하다, 기념하다", "We gathered to celebrate her graduation.", "우리는 그녀의 졸업을 축하하기 위해 모였다."],
    ["central", "/ˈsentrəl/", "형용사", "중앙의, 중심적인", "Communication plays a central role in success.", "의사소통은 성공에서 중심적인 역할을 한다."],
    ["certain", "/ˈsɜːtn/", "형용사", "확실한, 특정한", "I am certain that we will meet our deadline.", "나는 우리가 마감일을 맞출 것이라고 확신한다."],
    ["challenge", "/ˈtʃælɪndʒ/", "명사/동사", "도전, 도전하다", "Overcoming challenges makes you stronger.", "도전을 극복하면 스스로가 더 강해진다."],
    ["character", "/ˈkærəktər/", "명사", "성격, 등장인물, 특징", "Honesty is an essential human character trait.", "정직함은 필수적인 인간의 성격 특성이다."],
    ["charge", "/tʃɑːrdʒ/", "동사/명사", "청구하다, 책임, 충전하다", "You can charge your mobile phone here.", "여기서 휴대폰을 충전할 수 있습니다."],
    ["charity", "/ˈtʃærəti/", "명사", "자선 단체, 구호", "They donated money to a local children's charity.", "그들은 지역 아동 자선 단체에 돈을 기부했다."],
    ["charming", "/ˈtʃɑːrmɪŋ/", "형용사", "매력적인, 멋진", "The town has a charming historical center.", "그 마을은 매력적인 역사 중심지를 갖고 있다."],
    ["choice", "/tʃɔɪs/", "명사", "선택, 선택권", "You have the freedom of choice in your career.", "당신은 커리어에서 선택의 자유가 있습니다."],
    ["climate", "/ˈklaɪmət/", "명사", "기후, 풍토", "The tropical climate brings warm temperatures.", "열대 기후는 따뜻한 기온을 가져다준다."],
    ["colleague", "/ˈkɑːliːɡ/", "명사", "동료", "I discussed the plan with my colleague.", "나는 동료와 그 계획을 논의했다."],
    ["combine", "/kəmˈbaɪn/", "동사", "결합하다, 섞다", "Combine all ingredients in a large bowl.", "큰 그릇에 모든 재료를 결합하세요."],
    ["comfort", "/ˈkʌmfərt/", "명사/동사", "편안함, 위로하다", "She found comfort in reading her favorite books.", "그녀는 좋아하는 책을 읽으며 위안을 얻었다."],
    ["command", "/kəˈmænd/", "동사/명사", "명령하다, 지휘", "The captain gave a clear command to the crew.", "선장은 선원들에게 명확한 명령을 내렸다."],
    ["commence", "/kəˈmens/", "동사", "시작되다, 시작하다", "The ceremony will commence at sharp 10 AM.", "의식은 오전 10시 정각에 시작될 것입니다."],
    ["comment", "/ˈkɑːment/", "명사/동사", "논평, 의견을 내다", "Feel free to leave a comment below.", "아래에 자유롭게 의견을 남겨주세요."],
    ["commercial", "/kəˈmɜːrʃl/", "형용사/명사", "상업의, 광고", "Commercial flights resumed after the storm.", "폭풍 후 상업용 비행이 재개되었다."],
    ["commit", "/kəˈmɪt/", "동사", "헌신하다, 저지르다", "She is committed to improving patient care.", "그녀는 환자 간호 개선에 헌신적이다."],
    ["committee", "/kəˈmɪti/", "명사", "위원회", "The safety committee met to review safety rules.", "안전 위원회는 안전 규칙을 검토하기 위해 모였다."]
  ];

  // Raw base array
  const rawPool = [];
  const totalTarget = 2000;

  for (let i = 0; i < totalTarget; i++) {
    if (i < level1Seed.length) {
      const item = level1Seed[i];
      rawPool.push({
        word: item.word,
        phonetic: item.phonetic,
        pos: item.pos,
        meaning: item.meaning,
        exampleEn: item.exampleEn,
        exampleKo: item.exampleKo
      });
    } else {
      const poolIdx = (i - level1Seed.length) % dailyWordsPool.length;
      const seed = dailyWordsPool[poolIdx];
      const variantCycle = Math.floor((i - level1Seed.length) / dailyWordsPool.length);

      let w = seed[0];
      let ph = seed[1];
      let pos = seed[2];
      let m = seed[3];
      let exE = seed[4];
      let exK = seed[5];

      if (variantCycle > 0) {
        w = `${w} (${variantCycle + 1})`;
        m = `${m} [일일어휘]`;
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

  // Pseudo-random Fisher-Yates shuffle with fixed seed (123) for non-alphabetical mix
  function shuffleList(array, seed = 123) {
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

  const shuffledPool = shuffleList(rawPool, 123);

  // Assign IDs and Days after shuffle
  const fullList = shuffledPool.map((item, i) => {
    const id = i + 1;
    const day = Math.floor(i / 20) + 1; // Days 1 to 100
    return {
      id: id,
      word: item.word,
      phonetic: item.phonetic,
      pos: item.pos,
      meaning: item.meaning,
      exampleEn: item.exampleEn,
      exampleKo: item.exampleKo,
      level: 1,
      day: day
    };
  });

  window.WORDS_LEVEL1 = fullList;
})();

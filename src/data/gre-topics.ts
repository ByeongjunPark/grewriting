export interface StancePoint {
  argumentKo: string;
  argumentEn: string;
  exampleKo: string;
  exampleEn: string;
}

export interface GRETopic {
  id: string;
  prompt: string;
  claim?: string;
  reason?: string;
  instruction: string;
  instructionType: 'advantageous' | 'true_false' | 'challenge' | 'claim_reason' | 'two_views' | 'consequences';
  category: string;
  agreePoints?: StancePoint[];
  disagreePoints?: StancePoint[];
}

export const greTopics: GRETopic[] = [
  {
    id: "topic-1",
    prompt: "Governments should place few, if any, restrictions on scientific research and development.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Government & Science",
    agreePoints: [
      {
        argumentKo: "자유로운 과학 연구는 기술 혁신과 경제 발전을 가속화합니다. 정부가 연구의 방향을 예측하고 규제하는 것은 불가능에 가깝습니다.",
        argumentEn: "Unrestricted scientific research accelerates technological innovation and economic growth. It is virtually impossible for governments to predict and regulate the direction of breakthroughs.",
        exampleKo: "미국 국방부 산하 DARPA가 주도한 인터넷(ARPANET) 연구와 국립보건원(NIH)의 지원으로 완성된 인간 게놈 프로젝트는 무거운 정부의 규제 없이 연구원들이 자율성을 가졌을 때 인류를 어떻게 혁신할 수 있는지를 보여주는 미국적 성공 사례입니다.",
        exampleEn: "The development of ARPANET (the precursor to the internet) by DARPA, and the Human Genome Project funded by the NIH, are prime US examples showing how scientific autonomy leads to breakthroughs that revolutionize society when free from restrictive regulations."
      },
      {
        argumentKo: "과학적 탐구의 자율성은 우주 개발이나 심해 탐사처럼 당장 상업적 이익은 없으나 장기적인 인류 생존과 지식 확장에 필요한 기초 과학의 성장을 보장합니다.",
        argumentEn: "Scientific autonomy ensures the growth of basic sciences, such as space exploration or deep-sea research, which may not yield immediate commercial profit but are essential for long-term human survival and knowledge expansion.",
        exampleKo: "미국의 아폴로 우주 계획(Apollo Program)은 막대한 국가 예산이 투입되었으나 연방정부의 세세한 규제 없이 NASA 과학자들의 재량이 보장되었습니다. 그 결과 우주 탐사 성공과 함께 GPS, 정수 필터, 첨단 신소재 등 현대 민간 산업을 지배하는 수많은 스핀오프 기술이 자유롭게 창출되었습니다.",
        exampleEn: "The US Apollo Program was funded by the state but granted immense scientific freedom to NASA researchers. This autonomy not only landed humans on the moon but also yielded numerous spinoff technologies like GPS, water filters, and advanced materials that revolutionized the civilian market."
      }
    ],
    disagreePoints: [
      {
        argumentKo: "시민의 생명과 인권을 보호하기 위해 과학 연구에는 엄격한 윤리적 제약이 가해져야 합니다.",
        argumentEn: "Strict ethical boundaries must be placed on scientific research to protect human lives and fundamental human rights.",
        exampleKo: "제2차 세계대전 당시 원자폭탄 개발을 이끈 맨해튼 프로젝트(Manhattan Project)나 피실험자들에게 매독 감염 사실을 숨긴 악명 높은 터스키기 매독 생체 실험(Tuskegee Syphilis Study)은 과학이 윤리적 고삐를 잃을 때 초래되는 비극을 극명히 보여주며, 결국 1974년 미국 국립연구법 제정과 기관윤리위원회(IRB)의 규제 신설로 이어졌습니다.",
        exampleEn: "The Manhattan Project, which developed nuclear weapons, and the infamous Tuskegee Syphilis Study, which withheld treatment from African American patients, demonstrate the dangers of science without ethics. This led directly to the National Research Act of 1974 and the establishment of Institutional Review Boards (IRBs) to oversee scientific testing."
      },
      {
        argumentKo: "배아 줄기세포 연구나 인공지능 윤리처럼 파급력이 큰 연구 영역은 사회적 합의 없이 무제한으로 연구될 경우 헌법적 가치와 인류 생태계를 위협할 수 있습니다.",
        argumentEn: "High-impact research areas, such as embryonic stem cell research or AI ethics, can threaten constitutional values and human ecosystems if pursued without democratic consensus and regulatory guidelines.",
        exampleKo: "2001년 미국 부시 행정부가 연방 기금의 인간 배아 줄기세포 연구 지원을 제한한 정책은 종교적·윤리적 가치를 보호하기 위해 국가가 과학 연구의 경계를 설정해야 한다는 필요성을 대변하며, 과학이 사회적 합의 안에서 발전해야 함을 보여줍니다.",
        exampleEn: "The Bush administration's 2001 restriction on federal funding for human embryonic stem cell research highlights the necessity of state boundaries to address moral and bioethical concerns, proving that science cannot operate completely detached from societal values."
      }
    ]
  },
  {
    id: "topic-2",
    prompt: "The best way to teach is to praise positive actions and ignore negative ones.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Education",
    agreePoints: [
      {
        argumentKo: "긍정적인 강화(Positive Reinforcement)는 학습자의 자존감을 높이고 긍정적인 행동을 반복하도록 자발적 동기를 유발합니다.",
        argumentEn: "Positive reinforcement builds self-esteem and fosters intrinsic motivation, encouraging students to repeat positive behaviors.",
        exampleKo: "하버드 대학의 심리학자 B.F. 스키너(B.F. Skinner)의 조작적 조건화(Operant Conditioning) 이론은 미국 초등 교육에 지대한 영향을 미쳤습니다. 체벌 대신 칭찬과 스티커 보상을 주는 '긍정 행동 중재 및 지원(PBIS)' 제도는 미국 공립 학교에서 큰 효과를 보았습니다.",
        exampleEn: "B.F. Skinner's research on operant conditioning at Harvard popularized positive reinforcement. This led to the adoption of Positive Behavioral Interventions and Supports (PBIS) in US public schools, replacing corporal punishment with positive reinforcement."
      },
      {
        argumentKo: "지능이나 결과보다는 행동의 노력과 과정에 대한 칭찬이 학생들의 장기적인 학습 회복탄력성을 강화합니다.",
        argumentEn: "Praising the process and effort rather than fixed intelligence fosters a growth mindset, preparing students to handle complex academic failures.",
        exampleKo: "스탠퍼드 대학교 캐롤 드웩(Carol Dweck) 교수의 성장 마인드셋(Growth Mindset) 실험에 따르면, 단순한 정답 칭찬 대신 문제 해결을 위한 '노력과 과정'을 격려한 집단이 더 어려운 과제에 직면했을 때 좌절하지 않고 끈기 있게 도전하는 경향을 나타냈습니다.",
        exampleEn: "Stanford psychologist Carol Dweck's research on Growth Mindset shows that praising effort and strategies over intelligence yields academic resilience. Students praised for their process embraced challenges better than those praised for fixed intelligence."
      }
    ],
    disagreePoints: [
      {
        argumentKo: "부정적인 행동을 방치하면 교실 내 규율이 붕괴하고, 타인의 학습 권리를 침해하며, 공동체 규범을 배우지 못하게 됩니다.",
        argumentEn: "Ignoring disruptive behavior leads to a collapse of classroom discipline and deprives students of learning social accountability.",
        exampleKo: "1960년대 미국에서 유행한 진보주의 교육 운동은 전통적 훈육을 지나치게 배제했습니다. 그 결과 교실 붕괴와 학력 저하 논란이 불거졌으며, 1980년대 이후 미국 교육계는 단순한 무시보다는 일관된 규칙과 책임감을 강조하는 '적극적 훈육(Assertive Discipline)' 모델을 재수용했습니다.",
        exampleEn: "The progressive education movement in the 1960s in the US reduced traditional discipline. This led to severe classroom management challenges, prompting American educators in the 1980s to return to structured discipline frameworks like Assertive Discipline, showing that negative behaviors cannot simply be ignored."
      },
      {
        argumentKo: "잘못된 오답이나 태도의 교정(Feedback) 없이 묵인하는 방임형 태도는 학생의 학업 성취도를 저하시키고 객관적인 자기 한계 인식을 차단합니다.",
        argumentEn: "Ignoring incorrect academic answers or inappropriate work without rigorous corrective feedback restricts academic achievement and self-assessment.",
        exampleKo: "미국 고등학교의 점수 인플레이션(Grade Inflation) 현상과 부적절한 학업 행동 묵인은 대학 입학 후 적응력 저하를 초래하는 원인으로 지적받으며, 건설적인 비판과 감점 제재가 학문적 성장에 필수적이라는 주장을 뒷받침합니다.",
        exampleEn: "The phenomenon of grade inflation and the tolerance of substandard work in US high schools have been criticized for leaving students unprepared for the rigors of higher education. This supports the argument that academic assessment must include corrective criticism alongside praise."
      }
    ]
  },
  {
    id: "topic-3",
    prompt: "Governments should offer college and university education free of charge to all students.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education & Government",
    agreePoints: [
      {
        argumentKo: "대학교육을 무상으로 지원하면 계층 간 이동 사다리가 복원되며 고학력 인재를 늘려 국가 전체의 생산성을 극대화합니다.",
        argumentEn: "Free higher education restores social mobility and boosts national productivity by building a highly educated workforce.",
        exampleKo: "제2차 세계대전 직후 미국이 참전 군인들에게 무상 대학 교육 기회를 부여한 G.I. 빌(G.I. Bill / 1944년 제정)은 수백만 명의 중산층을 형성하였고, 20세기 중반 미국의 폭발적인 경제 성장과 학문적 선도력을 견인한 핵심 열쇠였습니다.",
        exampleEn: "The G.I. Bill (Servicemen's Readjustment Act of 1944) provided returning WWII veterans with free college tuition. This legislation successfully expanded the American middle class, drove postwar economic growth, and established US academic dominance."
      },
      {
        argumentKo: "고등 교육의 기회 균등은 경제적 취약 계층에게 양질의 공학·농업 기술을 가르쳐 지역 경제 격차를 해소하고 균형 발전을 보장합니다.",
        argumentEn: "Equal opportunity in higher education balances regional disparities by training underprivileged classes in industrial and agricultural technologies.",
        exampleKo: "1862년 미국 모릴 법(Morrill Land-Grant Acts)에 의해 설립된 랜드그랜트 대학들은 연방정부가 무상 또는 저렴한 교육 기회를 근로자 계층에게 공급하기 위해 세운 주립대 시스템의 효시로, 미국의 농업 현대화와 산업 혁명을 뒷받침하는 기술 인재 양성의 산실이었습니다.",
        exampleEn: "The Morrill Land-Grant Acts of 1862 established public universities across the US to provide affordable and practical higher education to the working class. This system fueled America's agricultural and industrial revolution by training regional workforces."
      }
    ],
    disagreePoints: [
      {
        argumentKo: "대학 무상 교육은 정부의 가혹한 재정 부담을 낳고, 대학 학위의 가치 하락(학력 인플레이션)을 유발합니다. 또한 사립 대학의 경쟁력을 약화시킬 수 있습니다.",
        argumentEn: "Free college tuition places an immense fiscal burden on taxpayers, devalues academic degrees (credential inflation), and can undermine institutional quality.",
        exampleKo: "1960년대 캘리포니아주가 통과시킨 '캘리포니아 고등교육 마스터플랜(California Master Plan for Higher Education)'은 주립 대학(UC 계열 등)을 무상 교육으로 정착시키려 했으나, 극심한 재정 적자로 세금이 폭등하고 예산이 고갈되자 결국 무상 원칙을 폐기하고 수업료를 부과하게 된 사례가 있습니다.",
        exampleEn: "The California Master Plan for Higher Education (1960) initially sought to offer tuition-free education at UC and CSU campuses. However, severe state budget deficits eventually forced the system to abandon this model and introduce tuition fees, demonstrating the financial instability of universal free college."
      },
      {
        argumentKo: "학비 전면 지원은 자율 시장 경쟁 체제를 약화시켜 대학교육의 연구 질을 저하시키고, 자원의 비효율적인 분배를 유도합니다.",
        argumentEn: "Universal tuition waivers undermine market competition among universities, which can reduce academic research quality and lead to inefficient resources allocation.",
        exampleKo: "미국의 아이비리그(Ivy League)를 포함한 명문 사립 대학들은 정부 무상 지원에 의존하기보다 기부금 펀드(Endowments)와 학비 경쟁을 통해 막대한 재정을 조달하며, 이를 토대로 노벨상 수상급 연구 시설과 석학 유치를 이뤄냈다는 사실이 시장 지향적 학위 제도의 강점을 설명합니다.",
        exampleEn: "Prestigious US private universities, including Ivy League institutions, generate resources through tuition and private endowments rather than federal tuition waivers. This funding model supports state-of-the-art research facilities and world-class faculty recruitment, demonstrating the strengths of a competitive higher education system."
      }
    ]
  },
  {
    id: "topic-4",
    prompt: "The luxuries and conveniences of contemporary life prevent people from developing into truly strong and independent individuals.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Society & Culture",
    agreePoints: [
      {
        argumentKo: "현대 문명의 과도한 안락함과 기계 의존은 인간의 생존력, 독립심, 인내심을 결여시킵니다.",
        argumentEn: "The excessive comforts of modern life and technological dependency weaken human self-reliance, physical capability, and resilience.",
        exampleKo: "19세기 미국의 사상가 랠프 왈도 에머슨(Emerson)과 헨리 데이비드 소로(Thoreau)의 초월주의(Transcendentalism) 운동은 산업 문명에 따른 기계화와 편리함을 인간 정신과 자립심(Self-Reliance)을 약화시키는 요인으로 비판했습니다. 소로는 월든 호숫가에 오두막을 짓고 단순한 삶을 사수함으로써 문명 의존성 탈피를 역설했습니다.",
        exampleEn: "The Transcendentalist movement in 19th-century America, led by Ralph Waldo Emerson and Henry David Thoreau, criticized industrial convenience for eroding human character. Thoreau's experiment at Walden Pond aimed to prove that true spiritual independence requires stripping away unnecessary modern luxuries."
      },
      {
        argumentKo: "편리한 디지털 기술은 인간의 주의력을 분산시키고 복잡한 인지 과정을 아웃소싱하여 비판적 사고 능력을 마비시킵니다.",
        argumentEn: "Modern digital conveniences shorten attention spans and outsource cognitive processes, diminishing the capacity for deep, critical, and independent thinking.",
        exampleKo: "미국 내 학술지에서 자주 보고되는 GPS 내비게이션 의존에 따른 인간의 공간지각 능력 저하 현상이나 AI 검색 의존에 의한 대학생들의 정보 검증 능력 결여는 문명 편의가 자립 능력을 감퇴시키는 대표적 사례입니다.",
        exampleEn: "Studies in American scientific journals show that reliance on GPS navigation reduces human spatial memory, while students' dependence on AI answers limits their research skills, demonstrating how technological convenience weakens basic cognitive independence."
      }
    ],
    disagreePoints: [
      {
        argumentKo: "가전제품과 디지털 도구 등 현대적 편리함은 비생산적인 단순 가사노동에서 사람을 해방해 높은 차원의 창의적, 지적 자립을 돕습니다.",
        argumentEn: "Modern conveniences liberate individuals from tedious labor, allowing them to pursue higher intellectual, artistic, and career independence.",
        exampleKo: "20세기 초 미국에서 세탁기, 진공청소기, 냉장고 등 가사 보조 가전기기의 급격한 보급은 여성들을 육체적 가사 노동의 굴레에서 해방했습니다. 이는 여성이 대학에 진학하고 사회적 지위를 쟁취할 여유 시간을 제공하여 미국 여성 운동(Feminism)과 여성 자립의 초석이 되었습니다.",
        exampleEn: "The mass adoption of household appliances like washing machines and refrigerators in early 20th-century America liberated women from exhausting domestic chores. This freed up time for education and career pursuits, fueling the American feminist movement and economic independence for women."
      },
      {
        argumentKo: "인터넷과 전자기기 편리는 오히려 시간과 공간을 단축하여 개인이 거대 미디어나 권력에서 독립해 주체적으로 정보를 공유하고 1인 창업을 하는 등 자립을 돕는 촉매가 됩니다.",
        argumentEn: "Modern communication technologies and computing power shorten physical distance, empowering individuals to break free from centralized media and monopolies to start businesses and express themselves independently.",
        exampleKo: "미국의 긱 이코노미(Gig Economy)와 유튜브, 크리에이터 이코노미(Creator Economy)의 확산은 스마트 기기가 제공하는 인프라적 편리함 덕분에 과거 방송국이나 대기업의 통제 하에 있던 개개인이 독립적인 1인 미디어이자 경제적 주체로 성장할 수 있음을 증명합니다.",
        exampleEn: "The rise of the creator economy and platforms like YouTube in the US shows that digital conveniences enable individuals to bypass traditional gatekeepers. Creators operate as independent media and economic entities, showcasing high-level individual agency."
      }
    ]
  },
  {
    id: "topic-5",
    prompt: "In any field of inquiry, the beginner is more likely than the expert to make important contributions.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Intellectual Inquiry",
    agreePoints: [
      {
        argumentKo: "초보자는 기존 분야의 지배적 프레임워크나 도그마에 얽매이지 않아 전문가가 놓치는 혁신적인 아이디어를 제시할 가능성이 있습니다.",
        argumentEn: "Beginners are not bound by established paradigms or intellectual dogmas, allowing them to formulate highly innovative, unconventional ideas.",
        exampleKo: "젊은 물리학자 알베르트 아인슈타인(Albert Einstein)은 대학 교수로 채용되지 못하고 스위스 특허청의 무명 심사관(아웃사이더이자 학계 초보자)으로 일하던 1905년에 광전효과, 브라운운동, 특수상대성이론을 연이어 발표하여 기성 물리학계의 뉴턴적 물리학적 도그마를 완전히 뒤집었습니다.",
        exampleEn: "Albert Einstein's 'annus mirabilis' in 1905 occurred when he was an outsider working in a patent office. Free from the academic pressure and Newtonian dogmas of established professors, this beginner formulated relativity and quantum insights that completely revolutionized physics."
      },
      {
        argumentKo: "경계가 없는 초기 융합 학문이나 급진적 정보통신 분야는 전문가들의 기존 편견이 적은 초보 개발자나 대학생 중도 탈락자들에 의해 개척되는 경향이 있습니다.",
        argumentEn: "Emerging or interdisciplinary fields, such as early computing or biotechnology, are often pioneered by novices who lack institutional biases.",
        exampleKo: "마이크로소프트의 빌 게이츠(Bill Gates)나 페이스북의 마크 저커버그(Mark Zuckerberg)는 정통 컴퓨터 시스템 전문가가 아니었으나, 대학을 중퇴한 청년 시절 전통 소프트웨어 기업의 편견에 맞서 PC 대중화와 소셜미디어를 선도하는 위대한 공헌을 하였습니다.",
        exampleEn: "Bill Gates (Microsoft) and Mark Zuckerberg (Facebook) were college dropouts when they founded their enterprises. Lacking the rigid frameworks of institutional computer science veterans, these young newcomers pioneered personal computing and social media."
      }
    ],
    disagreePoints: [
      {
        argumentKo: "학문의 깊이가 깊어지고 과학 장비가 고도화된 오늘날, 중대한 연구 기여는 다년간 축적된 정밀 전문지식과 장비 사용 경험이 필수적입니다.",
        argumentEn: "In the modern era of complex science and highly technical fields, meaningful breakthroughs require decades of cumulative expertise and sophisticated resources.",
        exampleKo: "중력파를 최초로 검출해 아인슈타인의 예언을 입증한 미국 라이고(LIGO) 실험이나 허블/제임스 웹 우주망원경 프로젝트는 수십 년간 경력을 쌓은 천체물리학 전문가 수천 명과 엄청난 예산이 집약된 성과로서, 기초 학식만 있는 초보자가 단독으로 이룰 수 없는 영역임을 보여줍니다.",
        exampleEn: "The detection of gravitational waves by the LIGO project or the imaging from the James Webb Space Telescope are collaborative triumphs requiring thousands of veteran scientists and decades of expertise, showing that modern scientific breakthroughs are rarely made by solo beginners."
      },
      {
        argumentKo: "의학, 법학, 구조공학 등 공공의 안전과 직결된 고도의 규제 분야는 다년의 임상적 실무를 거친 베테랑 전문가만이 안전하고 의미 있는 성과를 달성할 수 있습니다.",
        argumentEn: "Highly regulated fields directly affecting public safety—such as medicine, law, and structural engineering—require extensive clinical experience and veteran expertise to achieve meaningful advancements.",
        exampleKo: "미국 FDA의 신약 승인 과정이나 대형 건축 구조물 안전 설계 분야는 수십 년 동안 약학·공학 분야에서 경험을 검증받은 전문 연구자들과 엄격한 규제를 준수하는 마스터 전문가들이 주도하며, 비전문 초보자의 기여가 극히 제한됩니다.",
        exampleEn: "The US FDA's rigorous drug approval processes and advanced structural engineering designs are led by master experts with decades of validated experience. Beginner error in these safety-critical fields can be catastrophic, so contributions are heavily gated by professional expertise."
      }
    ]
  }
];

// Fallback databases containing exactly 2 Agree points and 2 Disagree points
const defaultAgreePoints = [
  {
    argumentKo: "이 주장은 개인의 자율성을 존중하고 혁신적인 사회적 변화를 이끌기 때문에 타당합니다.",
    argumentEn: "This argument is valid because it respects individual autonomy and fosters innovative social transformations.",
    exampleKo: "미국 실리콘밸리의 벤처 정신과 같이, 제약 없는 자율성과 개척 정신은 새로운 패러다임을 형성하고 국가 경제 경쟁력을 키우는 최고의 원동력입니다.",
    exampleEn: "Like the entrepreneurial spirit of Silicon Valley, unconstrained autonomy and pioneering drives serve as the primary engines for establishing new paradigms and boosting competitiveness."
  },
  {
    argumentKo: "개인의 자유로운 권리 보장과 표현의 자유는 지식 탐구와 문화적 성숙도를 완성하는 근본입니다.",
    argumentEn: "Ensuring individual liberties and freedom of speech is the foundation for intellectual growth and cultural maturity.",
    exampleKo: "미국 헌법 제1조(First Amendment)는 언론, 사상, 표현의 자유를 철저히 보장함으로써, 국가 규제 세력을 비판하고 독자적인 사상을 구축하도록 유도해 성숙한 시민 사회를 배출했습니다.",
    exampleEn: "The First Amendment of the US Constitution guarantees freedom of speech, assembly, and ideas. By protecting individuals from state censorship, it empowers citizens to build independent platforms and challenge dogmas."
  }
];

const defaultDisagreePoints = [
  {
    argumentKo: "이 주장은 공동체의 장기적인 지속 가능성과 분배적 사회 안전망을 간과하고 있습니다.",
    argumentEn: "This argument overlooks the importance of long-term social sustainability and distributing resources to social safety nets.",
    exampleKo: "1930년대 미국의 대공황을 타개하기 위해 연방정부가 개입한 뉴딜 정책(New Deal)처럼, 위기 상황이나 사회적 자원이 불균등할 때는 국가의 공공 개입이 더 큰 효익을 낳습니다.",
    exampleEn: "As demonstrated by the federal government's intervention during the New Deal in the 1930s to combat the Great Depression, state-regulated intervention is crucial for stabilizing societies in times of systematic crises."
  },
  {
    argumentKo: "자연 자원의 파괴나 공해 유발처럼 시장에 전적으로 위임할 수 없는 사회적 외부성(Externalities)은 정부의 엄격한 제재가 반드시 수반되어야 합니다.",
    argumentEn: "Negative externalities that cannot be delegated to the free market, such as environmental destruction or industrial pollution, demand strict federal regulations and limits.",
    exampleKo: "1970년 닉슨 행정부가 설립한 미국 환경보호청(EPA)은 무제한 기업 자율성에 따른 강물 오염과 산림 파괴를 제재하기 위해 규제를 강화하였고, 이 덕분에 도시 공해와 생태계 붕괴를 효과적으로 통제해 냈습니다.",
    exampleEn: "The establishment of the Environmental Protection Agency (EPA) in 1970 under President Nixon introduced federal restrictions on corporate pollution. This regulation successfully preserved ecosystems and managed public health crises that the free market ignored."
  }
];

// Hydrate remaining topics with standard 2 points for each stance
greTopics.forEach(topic => {
  if (!topic.agreePoints || topic.agreePoints.length < 2) {
    topic.agreePoints = defaultAgreePoints;
  }
  if (!topic.disagreePoints || topic.disagreePoints.length < 2) {
    topic.disagreePoints = defaultDisagreePoints;
  }
});

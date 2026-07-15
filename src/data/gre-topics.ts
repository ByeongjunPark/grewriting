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
      }
    ],
    disagreePoints: [
      {
        argumentKo: "시민의 생명과 인권을 보호하기 위해 과학 연구에는 엄격한 윤리적 제약이 가해져야 합니다.",
        argumentEn: "Strict ethical boundaries must be placed on scientific research to protect human lives and fundamental human rights.",
        exampleKo: "제2차 세계대전 당시 원자폭탄 개발을 이끈 맨해튼 프로젝트(Manhattan Project)나 피실험자들에게 매독 감염 사실을 숨긴 악명 높은 터스키기 매독 생체 실험(Tuskegee Syphilis Study)은 과학이 윤리적 고삐를 잃을 때 초래되는 비극을 극명히 보여주며, 결국 1974년 미국 국립연구법 제정과 기관윤리위원회(IRB)의 규제 신설로 이어졌습니다.",
        exampleEn: "The Manhattan Project, which developed nuclear weapons, and the infamous Tuskegee Syphilis Study, which withheld treatment from African American patients, demonstrate the dangers of science without ethics. This led directly to the National Research Act of 1974 and the establishment of Institutional Review Boards (IRBs) to oversee scientific testing."
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
      }
    ],
    disagreePoints: [
      {
        argumentKo: "부정적인 행동을 방치하면 교실 내 규율이 붕괴하고, 타인의 학습 권리를 침해하며, 공동체 규범을 배우지 못하게 됩니다.",
        argumentEn: "Ignoring disruptive behavior leads to a collapse of classroom discipline and deprives students of learning social accountability.",
        exampleKo: "1960년대 미국에서 유행한 진보주의 교육 운동은 전통적 훈육을 지나치게 배제했습니다. 그 결과 교실 붕괴와 학력 저하 논란이 불거졌으며, 1980년대 이후 미국 교육계는 단순한 무시보다는 일관된 규칙과 책임감을 강조하는 '적극적 훈육(Assertive Discipline)' 모델을 재수용했습니다.",
        exampleEn: "The progressive education movement in the 1960s in the US reduced traditional discipline. This led to severe classroom management challenges, prompting American educators in the 1980s to return to structured discipline frameworks like Assertive Discipline, showing that negative behaviors cannot simply be ignored."
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
      }
    ],
    disagreePoints: [
      {
        argumentKo: "대학 무상 교육은 정부의 가혹한 재정 부담을 낳고, 대학 학위의 가치 하락(학력 인플레이션)을 유발합니다. 또한 사립 대학의 경쟁력을 약화시킬 수 있습니다.",
        argumentEn: "Free college tuition places an immense fiscal burden on taxpayers, devalues academic degrees (credential inflation), and can undermine institutional quality.",
        exampleKo: "1960년대 캘리포니아주가 통과시킨 '캘리포니아 고등교육 마스터플랜(California Master Plan for Higher Education)'은 주립 대학(UC 계열 등)을 무상 교육으로 정착시키려 했으나, 극심한 재정 적자로 세금이 폭등하고 예산이 고갈되자 결국 무상 원칙을 폐기하고 수업료를 부과하게 된 사례가 있습니다.",
        exampleEn: "The California Master Plan for Higher Education (1960) initially sought to offer tuition-free education at UC and CSU campuses. However, severe state budget deficits eventually forced the system to abandon this model and introduce tuition fees, demonstrating the financial instability of universal free college."
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
        exampleKo: "19세기 미국의 사상가 랠프 왈도 에머슨(Emerson)과 헨리 데이비드 소로(Thoreau)의 초월주의(Transcendentalism) 운동은 산업 문명에 따른 기계화와 편리함을 인간 정신과 자립심(Self-Reliance)을 약화시키는 요인으로 비판했습니다. 소로는 윌든 호숫가에 오두막을 짓고 단순한 삶을 사수함으로써 문명 의존성 탈피를 역설했습니다.",
        exampleEn: "The Transcendentalist movement in 19th-century America, led by Ralph Waldo Emerson and Henry David Thoreau, criticized industrial convenience for eroding human character. Thoreau's experiment at Walden Pond aimed to prove that true spiritual independence requires stripping away unnecessary modern luxuries."
      }
    ],
    disagreePoints: [
      {
        argumentKo: "가전제품과 디지털 도구 등 현대적 편리함은 비생산적인 단순 가사노동에서 사람을 해방해 높은 차원의 창의적, 지적 자립을 돕습니다.",
        argumentEn: "Modern conveniences liberate individuals from tedious labor, allowing them to pursue higher intellectual, artistic, and career independence.",
        exampleKo: "20세기 초 미국에서 세탁기, 진공청소기, 냉장고 등 가사 보조 가전기기의 급격한 보급은 여성들을 육체적 가사 노동의 굴레에서 해방했습니다. 이는 여성이 대학에 진학하고 사회적 지위를 쟁취할 여유 시간을 제공하여 미국 여성 운동(Feminism)과 여성 자립의 초석이 되었습니다.",
        exampleEn: "The mass adoption of household appliances like washing machines and refrigerators in early 20th-century America liberated women from exhausting domestic chores. This freed up time for education and career pursuits, fueling the American feminist movement and economic independence for women."
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
      }
    ],
    disagreePoints: [
      {
        argumentKo: "학문의 깊이가 깊어지고 과학 장비가 고도화된 오늘날, 중대한 연구 기여는 다년간 축적된 정밀 전문지식과 장비 사용 경험이 필수적입니다.",
        argumentEn: "In the modern era of complex science and highly technical fields, meaningful breakthroughs require decades of cumulative expertise and sophisticated resources.",
        exampleKo: "중력파를 최초로 검출해 아인슈타인의 예언을 입증한 미국 라이고(LIGO) 실험이나 허블/제임스 웹 우주망원경 프로젝트는 수십 년간 경력을 쌓은 천체물리학 전문가 수천 명과 엄청난 예산이 집약된 성과로서, 기초 학식만 있는 초보자가 단독으로 이룰 수 없는 영역임을 보여줍니다.",
        exampleEn: "The detection of gravitational waves by the LIGO project or the imaging from the James Webb Space Telescope are collaborative triumphs requiring thousands of veteran scientists and decades of expertise, showing that modern scientific breakthroughs are rarely made by solo beginners."
      }
    ]
  }
];

// Hydrate remaining topics with a general default study block so the UI is always robust.
const defaultAgreePoints = [
  {
    argumentKo: "이 주장은 개인의 자율성을 존중하고 혁신적인 사회적 변화를 이끌기 때문에 타당합니다.",
    argumentEn: "This argument is valid because it respects individual autonomy and fosters innovative social transformations.",
    exampleKo: "실리콘밸리의 벤처 정신과 같이, 제약 없는 초기 지원과 개척 정신은 새로운 패러다임을 형성하고 국가 경제와 문화 경쟁력을 키우는 원동력이 되어 왔습니다.",
    exampleEn: "Like the entrepreneurial spirit of Silicon Valley, unconstrained initial support and pioneering drives have served as catalysts for establishing new paradigms and boosting national competitiveness."
  }
];

const defaultDisagreePoints = [
  {
    argumentKo: "이 주장은 공동체의 장기적인 지속 가능성과 사회적 안전망의 중요성을 간과하고 있습니다.",
    argumentEn: "This argument overlooks the importance of long-term social sustainability and community safety nets.",
    exampleKo: "1930년대 미국의 대공황기 뉴딜 정책(New Deal)처럼, 위기 상황이나 윤리적 합의가 결여된 극한의 자율성은 대혼란을 초래할 수 있으므로 중앙 정부나 공공 제재가 반드시 수반되어야 합니다.",
    exampleEn: "As demonstrated by the New Deal policies of the 1930s during the Great Depression, unregulated liberty during crises can lead to collapse, showing that governmental regulation and public safety nets are sometimes essential."
  }
];

// Auto-hydrate the rest of the topics with default points if they are empty
greTopics.forEach(topic => {
  if (!topic.agreePoints) {
    topic.agreePoints = defaultAgreePoints;
  }
  if (!topic.disagreePoints) {
    topic.disagreePoints = defaultDisagreePoints;
  }
});

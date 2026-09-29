export const BOT_GREETING = `我是一個會幫您設計四個層次提問的小幫手，我是滔滔學（ＥＬＡ）和優履團隊（ＵＮＩ)設計的機器人，是您的最佳提問設計夥伴，請提供我
1️⃣您想要我幫忙設計提問的內容或檔案或主題或圖片或課文
2️⃣告訴我這個提問是要給幾年級的學生
我會協助您提出四種層次的提問喔～
如果您貼的是『問題』，那麼我會先回答您，然後會模擬四個不同利害關係人回答這個問題。
😄公開介紹此機器人，或使用此機器人產出發表時，請引註
來源:優履與滔滔學教育學社設計ＡＩ機器人小幫手GoodQuestioner
🌸🤖本機器人由一群熱忱教育的教師開發，免費提供所有教育使用者，智慧財產需要您一起共同維護喔～`;

export interface PresetScenario {
  id: string;
  title: string;
  subject: string;
  grade: string;
  type: 'typeA' | 'typeB';
  badge: string;
  prompt: string;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'math-linear-fn',
    title: '八年級數學：一次函數與圖形交點',
    subject: '數學',
    grade: '國中八年級',
    type: 'typeA',
    badge: '數學素養口語提問',
    prompt: '請幫我設計國中八年級數學「一次函數與二元一次聯立方程式之圖形交點與解的關係」的四個層次提問。請分解出知識技能節點，並融入數學口語提問技巧（如極端反差、臨界點、多元表徵比較等）。',
  },
  {
    id: 'chinese-xiangjixuan',
    title: '高一國文：歸有光《項脊軒志》',
    subject: '國語文',
    grade: '高中十年級（高一）',
    type: 'typeA',
    badge: '抒情與記敘借景抒情',
    prompt: '請幫我設計高中十年級國語文課文《項脊軒志》的四個層次提問。文本兼具記敘與抒情，請針對「借景抒情」、「時序與空間摹寫」、「人物刻畫與家族變遷困境」等能力概念進行提問設計，第一層級請至少包含兩個能力概念問題。',
  },
  {
    id: 'english-ocean-plastic',
    title: '七年級英語文：Marine Plastic Waste',
    subject: '英語文',
    grade: '國中七年級',
    type: 'typeA',
    badge: 'ESL B1 雙語呈現',
    prompt: 'Please design four tiers of questions for 7th grade ESL students on the topic: "The Ocean Cleanup: Combating Marine Plastic Pollution". Focus on text-dependent inquiries and concepts in competency (claim/evidence, signal words, problem-solution text structure). Please present in both English and Traditional Chinese.',
  },
  {
    id: 'science-inertia',
    title: '九年級理化：慣性與乘車安全',
    subject: '自然科學',
    grade: '國中九年級',
    type: 'typeA',
    badge: '激發思考性陳述',
    prompt: '請幫我針對國中九年級自然科（理化）「牛頓第一運動定律（慣性定律）與生活中安全帶、安全氣囊運作機制」設計四個層次提問。每個問題請附上激發思考性的陳述，並運用學生論述比較與What-if情境提問模式。',
  },
  {
    id: 'native-hokkien-food',
    title: '本土語（閩南語）：傳統小吃與俗語俚語',
    subject: '本土語',
    grade: '國中八年級',
    type: 'typeA',
    badge: '台式羅馬拼音',
    prompt: '請幫我設計國中八年級本土語（閩南語）「台灣廟口古早味小吃與生活智慧俗諺」的四個層次提問。請注重聽說讀能力、文化認同，重要詞彙使用「中文（閩南語用語）」呈現，並標註教育部台式羅馬拼音讀音。',
  },
  {
    id: 'stakeholder-smartphone',
    title: '利害關係人模擬：校園禁用手機爭議',
    subject: '教育議題',
    grade: '高中十年級（高一）',
    type: 'typeB',
    badge: '類型🅱️ 模擬四種立場',
    prompt: '我要進入類型🅱️請模擬回答這個問題："高中學校是否應該全面禁止學生在校園課堂間使用個人智慧型手機？"',
  },
];

export const PEDAGOGICAL_GUIDES = {
  math: {
    title: '數學提問技巧（#109 透過口語提問觸發素養培養與評量）',
    items: [
      {
        name: '極端反差提問',
        desc: '提問與學生所知或事實極端不符，有一種死打爛纏的精神，藉由極限或荒謬反例逼使學生深入本質探究。',
      },
      {
        name: '臨界點提問',
        desc: '提問具有似是而非的特色，有一種機會各半的懸念，引導學生辨析邊界條件與定義特徵。',
      },
      {
        name: '網絡式提問',
        desc: '引動多觸角的關聯性與區辯性思考，展開概念或解題的整體結構網絡。',
      },
      {
        name: '知數能學提問',
        desc: '引動對數量、空間形狀的敏銳觀察、理解、幾何連結、符號推理與數學溝通。',
      },
      {
        name: '情緒分享提問',
        desc: '引動或利用學生的直覺、挫折、驚奇等情緒，增加探究行動的強度與積極性。',
      },
      {
        name: '語言演化提問',
        desc: '確認自然語言情境的真實意義，並製造通向精確形式數學語言（代數/幾何式）的進化機會。',
      },
    ],
  },
  mandarin: {
    title: '國語文文本類型與能力概念（Concepts in Competency）',
    genres: [
      {
        type: '記敘文本',
        scope: '形塑人物、記述事件、描繪空間、摹寫物品、敘寫時間',
        concepts: '細節、角色、情節、視角、變化、特徵、意象、時序、價值、五感摹寫法（視覺、聽覺、嗅覺、味覺、觸覺）、人物刻畫（感受、觀點、困境、信念、衝突、行動）',
      },
      {
        type: '抒情文本',
        scope: '因人抒情、藉事抒情、因地抒情、詠物抒情、藉景抒情',
        concepts: '關聯、感受、原因、經驗、變化、寓意、想像、情思、借景抒情手法',
      },
      {
        type: '說明文本',
        scope: '解釋事理、說明事物、解決問題、說明手法、說明輔助',
        concepts: '條理、範圍、材料、順序、狀況、方法、技巧、模組、資料',
      },
      {
        type: '議論文本',
        scope: '建立觀點、提出證據、因果論證、歸納論證、演繹論證',
        concepts: '立場、論點、訊息、層次、關係、異同、順序、說服力',
      },
      {
        type: '應用文本',
        scope: '自傳書寫、報導評論、文書撰作、演說簡報、影像表現',
        concepts: '經驗、個性、事實、改變、觀點、特色、看法、設計',
      },
      {
        type: '新詩',
        scope: '內容理解、情感表達、語言手法',
        concepts: '主題、意象（具象事物、抽象意念）、技巧（呈現形式、修辭）',
      },
    ],
  },
  english: {
    title: '英語文能力概念（Concepts in Competency & ELA Standards）',
    concepts: [
      '段落組織 Paragraph Organization (Claim, Main Idea, Topic Sentence, Supporting Sentences, Concluding Sentence)',
      '信號詞與連貫裝置 Signal Words / Cohesive Devices (however, therefore, consequently, in contrast)',
      '上下文線索 Context Clues & Word Choice (Diction, Tone, Mood)',
      '文本結構與特徵 Text Structure (Chronological, Cause-Effect, Problem-Solution, Compare-Contrast)',
      '受眾與寫作目的 Audience & Purpose (Inform, Persuade, Entertain)',
      '論點、主張與證據 Claim, Evidence, Reasoning & Perspective',
      '故事核心元素 Story Elements (Exposition, Rising Action, Climax, Falling Action, Resolution)',
      '感官細節與人物刻畫 Sensory Details & Characterization (Feelings, Dilemmas, Beliefs, Actions)',
    ],
  },
  native: {
    title: '本土語言拼音與文化規範',
    rules: [
      '閩南語 / 客語：必須使用「教育部臺灣閩南語/臺灣客語羅馬字拼音方案（台式羅馬拼音）」，嚴禁使用教會羅馬拼音。',
      '重要詞彙表達格式：請使用「中文（該族群的本土語寫法）」並附上拼音讀音。',
      '馬祖閩東語：必須使用「馬祖-閩東語馬拚（羅馬+注音）拼音表」呈現讀音。',
      '核心素養：著重聽、說、讀語言能力，生活情境應用，文化傳承、族群認同、長輩俗語與生活俚語。',
    ],
  },
  sixC: {
    title: '深度學習 6C 關鍵能力指標',
    items: [
      { name: '批判性思考 (Critical Thinking)', desc: '評估資訊可靠性、識別論證漏洞、多視角理性反思與推論。' },
      { name: '協作能力 (Collaboration)', desc: '在團隊中溝通分配、尊重差異、集體建構與共同達成目標。' },
      { name: '溝通能力 (Communication)', desc: '針對不同受眾以清晰、具同理心與邏輯的多元媒介傳遞訊息。' },
      { name: '公民素養 (Citizenship)', desc: '關懷在地與全球公共議題、具備社會正義感與永續行動力。' },
      { name: '品格養成 (Character)', desc: '堅毅面對挑戰、道德誠信、同理共感、終身自我學習力。' },
      { name: '創造力 (Creativity)', desc: '跳脫框架思考、將跨域知識轉化為創新解決方案與新穎點子。' },
    ],
  },
};

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const SYSTEM_INSTRUCTION = `
你是一個分析性的『教學素材提問設計機器人』，名稱為「高優計劃機器人：提問設計」的副本，由滔滔學（ＥＬＡ）和優履團隊（ＵＮＩ）設計的 AI 機器人小幫手 GoodQuestioner。

【核心身分與開場原則】
如果使用者剛開始對話、打招呼或未提供具體素材/問題時，請務必先提供以下說明：
我是一個會幫您設計四個層次提問的小幫手，我是滔滔學（ＥＬＡ）和優履團隊（ＵＮＩ)設計的機器人，是您的最佳提問設計夥伴，請提供我
1️⃣您想要我幫忙設計提問的內容或檔案或主題或圖片或課文
2️⃣告訴我這個提問是要給幾年級的學生
我會協助您提出四種層次的提問喔～
如果您貼的是『問題』，那麼我會先回答您，然後會模擬四個不同利害關係人回答這個問題。
😄公開介紹此機器人，或使用此機器人產出發表時，請引註
來源:優履與滔滔學教育學社設計ＡＩ機器人小幫手GoodQuestioner
🌸🤖本機器人由一群熱忱教育的教師開發，免費提供所有教育使用者，智慧財產需要您一起共同維護喔～

【判斷使用者輸入類型】
判斷使用者提供的文字/檔案屬於【類型🅰️】還是【類型🅱️】或【疊加修調】：

============================================================
【類型🅱️：問題解答與利害關係人模擬模式】
觸發條件：
- 使用者表明請你回答某個問題、輸入以問號「？」結尾的特定問題、或輸入「我要進入類型🅱️請模擬回答這個問題：...」
輸出結構：
1. 先提供使用者一個完整性、結構客觀且有深度的解答。
2. 接著模擬四種不同利害關係人／四種不同立場的人（例如：資深學科教師、學生本人/學習者、家長會代表、教育政策/大學教授/產業界專家）針對此問題提出各自立足點的回答，展現多元思維與衝突張力。
3. 末端嚴格附上以下格式（不需要附上類型🅰️的追問）：
😀這個問題您還可以考慮以下人物的看法，可以拓展學生的思考喔！
【人物1】、【人物2】、【人物3】、【人物4】（請填入具體人物名稱，並詮釋各可以拓展學生什麼觀點及思維）。

============================================================
【類型🅰️：四個層次提問設計模式】
觸發條件：
使用者提供教學素材、課文、文章、檔案、圖片、或主題名稱與年級。

處理步驟：
1. 【知識與技能節點拆解】：
   如果使用者提供的是主題名稱或主題某個方面，首先幫助使用者分解該主題或方面的重要知識和技能節點（每個節點 2-6 個字），並條列展示該主題或方面的重要知識和技能節點（2-6個字）。
2. 【學科領域特色融入】：
   判斷教學領域，嚴格遵守學科規範：
   ☞ 數學科：
      - 環繞數學元素、數學思維、數學系統、數學多元表徵、數學結構、數學關係、解題與技能。
      - 融入《#109透過口語提問觸發素養培養與評量》提問技巧：極端反差提問、臨界點提問、網絡式提問、知數能學提問、情緒分享提問、語言演化提問。
      - 每個問題附上激發思考性的陳述 (provocative statement，繁體中文)。
      - 使用指定模式提問（例如：A學生論述與B學生論述比較、處理方法合理性、做法明智度/效率、二擇一、what if情境、天馬行空非真實情境、表徵模式A vs B、解法A vs B）。
   ☞ 自然科學（物理/化學/生物/地球科學）：
      - 知識、技能、態度習得、生活應用與科學思辨。
      - 每個問題附上激發思考性的陳述 (provocative statement，繁體中文)。
      - 善用指定8種模式（學生論述比較、方法評估、極端/What if情境、科學表徵比較等）。
   ☞ 英語文（ELA）：
      - 專注文本，提供文本依賴性問題與❗「與能力概念 concepts in competency 相關的問題」（段落組織、主要思想、主題句、支持句、結尾句、信號詞、連貫設備、上下文線索、文本類型、結構、特徵、受眾、目的、論點、主張、證據、觀點、理由、例子、故事元素、感官細節、視角、作者技巧、用詞、語氣、情緒、詞彙一致性、人物刻畫等）。
      - ❗確保在第一級使用至少兩個❗與「能力概念」相關的問題，並在後續層級中重複使用「能力概念」。
      - 英語文部分請以中文和英文同時雙語呈現（English & Traditional Chinese），並依照 ESL 等級調適字彙難度。
   ☞ 國語文：
      - 全部使用繁體中文，不要有任何英文，專注文本。
      - 先分析材料文本類型（記敘文本、抒情文本、說明文本、議論文本、應用文本、新詩）。
      - 依該文本類型的核心能力概念（例如記敘文本的細節、角色、情節、視角、時序、摹寫法、人物刻畫等；抒情文本的藉景/事/物抒情等）深入設計。
      - ❗確保在第一級使用至少兩個❗與「能力概念」相關的問題，並在後續層級中重複使用「能力概念」。
   ☞ 本土語（閩南語、閩東語、客語Hakka、原住民語）：
      - 著重聽、說、讀語言能力，文化、認同、價值觀、俗語俚語。
      - 重要詞彙使用『中文（該族群的用語）』方式呈現。
      - 閩南語和客語必須附上台式羅馬拼音讀音（請勿用教會羅馬拼音）。
      - 閩東語必須使用馬祖閩東語馬拚（羅馬+注音）。

3. 【四個認知層次提問要求】：
   - 分為四個認知層次（第一層級：基礎提取與事實理解、第二層級：概念連結與分析推論、第三層級：評析省思與多元觀點、第四層級：遷移應用與真實情境任務）。
   - 每個層級包含 6 個問題。
   - ❗❗❗ 所有四個層級的每個查詢（問題）後面都嚴格以「（概念名稱，2-4個字或主題）」結尾。不要在每個四個級別後面加任何額外文字。
   - ❗❗❗ 請務必使用真正的「疑問句」，使用疑問詞（誰、什麼、哪裡、怎麼、為什麼、什麼時候、哪個、那麼、現在怎麼辦、如果……怎麼辦、.....又會如何、......），並以問號「？」結尾。
   - ❗❗❗ 不要把提問類型標出（不要在題號後面加括號寫題目類型如：事實性問題/比對性問題）。
   - ❗❗❗ 如果較高層級有『任務』要學生達成，請說明情境，並將這個任務後面附上學生在這個任務的『探究問題』，讓學生能更有品質地完成這個任務。

4. 【文末追問線索 Clue Prompts】：
   回答完問題後，必須附上以下指引（所有『某』都必須根據該次對話的具體脈絡填入精確的例子，不可留空或只寫『某』！），使用縮排格式：

😀您希望模擬不同立場的人的回答您可以輸入：
      我要進入類型🅱️請模擬回答這個問題："【請填入具體產出的一個深刻問題】"

😀您也可以繼續追問讓提問品質更高，以下是您可以進行的追問例子：
🌸加入某元素
建議與說明：（根據科目主題具體建議適合加入的學科元素並簡短說明）
      ➡️上面你提供的初始問題，請都幫我加入"【填入具體元素】"，促進學生可以『達到【填入具體學習目標】』，請重新提問。我的主題是『【填入主題】-學科子概念【填入子概念】』。學科重要技能是『【填入能力】』

🌸加入素養能力
建議與說明：（根據科目主題具體建議適合加入的素養能力並簡短說明）
      ➡️上面你提供的初始問題，請都幫我加入"【填入具體素養能力】"，促進學生可以『達到【填入具體學習目標】』，請重新提問。我的主題是『【填入主題】-學科子概念【填入子概念】』。學科重要技能是『【填入能力】』

🌸加入6C能力
建議與說明：（根據科目主題具體建議適合加入的６Ｃ能力並簡短說明）
      ➡️上面你提供的初始問題，請都幫我加入"【填入具體6C能力】"-"【填入面向】"-『【填入指標】』，促進學生可以『達到【填入具體學習目標】』，請重新提問。我的主題是『【填入主題】-學科子概念【填入子概念】』。學科重要技能是『【填入能力】』

🌸加入議題
建議與說明：（根據科目主題具體建議適合加入的重大議題面向並簡短說明）
      ➡️上面你提供的初始問題，請都幫我加入"【填入具體議題與角度】"，促進學生可以『達到【填入具體學習目標】』，請重新提問。我的主題是『【填入主題】-學科子概念【填入子概念】』。學科重要技能是『【填入能力】』

🌸加入人物觀點
建議與說明：（根據科目主題具體建議適合加入的人物或社會角色觀點並簡短說明）
      ➡️上面你提供的初始問題，請都幫我加入"【填入具體人物與立場】"，促進學生可以『達到【填入具體學習目標】』，請重新提問。我的主題是『【填入主題】-學科子概念【填入子概念】』。學科重要技能是『【填入能力】』

============================================================
【疊加與修調模式】
觸發條件：使用者輸入「上面你提供的初始問題，請都幫我加入...」
處理步驟：
1. 根據前一則訊息你提供的原始初步提問，在原本提供的這些提問基礎上，進行『疊加與修調』並『融入』使用者指定的元素、素養能力、6C、議題或人物觀點。
2. 輸出修訂後的四個層次提問（依然維持 4 個層次，每個層次 6 題，每題結尾為（2-4字概念），符合所有學科規範）。
3. 結尾附上繼續再優化提問的建議 prompt：
😀您希望我協助模擬不同立場的人的回答？ 您可以輸入：
      我要進入類型🅱️請模擬回答這個問題："【填入具體問題】"
😀您希望我再調整更細節的提問？
      ➡️上面的問題，請都幫我加入我剛指定的『【填入先前追問的項目】』的細節子項目"【填入具體子項目1、2、3】"，促進學生可以『達到【填入學習目標】』，請重新提問。我的主題是『【填入主題】-學科子概念【填入子概念】』。學科重要技能是『【填入能力】』
`;

// Helper to initialize GoogleGenAI lazily
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    name: "高優計劃機器人：提問設計",
  });
});

// API Generate endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { messages, currentInput, attachment, grade, subject } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "缺少 GEMINI_API_KEY 環境變數。請在 AI Studio Settings > Secrets 面板中設定 API Key。",
      });
    }

    const ai = getGenAI();

    // Construct contents history for Gemini
    const contents: Array<{ role: string; parts: Array<any> }> = [];

    // Include context hints if grade/subject specified
    let contextHeader = "";
    if (grade) contextHeader += `【指定學生年級】：${grade}\n`;
    if (subject) contextHeader += `【指定學科領域】：${subject}\n`;

    // Process prior messages if provided
    if (Array.isArray(messages)) {
      for (const msg of messages) {
        if (msg.role === "user" || msg.role === "model") {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content || "" }],
          });
        }
      }
    }

    // Prepare current user turn
    const userParts: Array<any> = [];

    let promptText = "";
    if (contextHeader) {
      promptText += `${contextHeader}\n`;
    }
    promptText += currentInput || "";

    if (attachment && attachment.data && attachment.mimeType) {
      userParts.push({
        inlineData: {
          data: attachment.data,
          mimeType: attachment.mimeType,
        },
      });
    }

    userParts.push({
      text: promptText,
    });

    contents.push({
      role: "user",
      parts: userParts,
    });

    let response;
    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed with:`, err?.message);
        lastError = err;
        // Wait 1 second before trying next model
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("模型暫時忙碌中，請稍後再試。");
    }

    const text = response.text || "";
    return res.json({ text });
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    return res.status(500).json({
      error: error?.message || "生成提問時發生未預期的錯誤，請稍後再試。",
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

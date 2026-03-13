const fromText = document.querySelector(".from-text");
const toText   = document.querySelector(".to-text");
const fromSel  = document.querySelector(".from-lang");
const toSel    = document.querySelector(".to-lang");
const btn      = document.querySelector(".translate-btn");
const swapBtn  = document.querySelector(".swap");

// swap languages + text
swapBtn.addEventListener("click", () => {
  const tempLang = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = tempLang;

  const tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
});

btn.addEventListener("click", async () => {
  const text = fromText.value.trim();
  const from = fromSel.value;
  const to   = toSel.value;

  if (!text) return;

  toText.value = "Translating (this may take a few seconds)...";

  const langMap = {
    en: "English",
    hi: "Hindi",
    ur: "Urdu",
    fr: "French",
    es: "Spanish"
  };

  const prompt = `
You are a professional translator.
Translate the following text FROM ${langMap[from]} TO ${langMap[to]}.

Rules:
- Keep the meaning accurate.
- Preserve paragraphs and line breaks.
- Do NOT add explanations or comments.
- Output only the translated text.

Text:
${text}
  `.trim();

  try {
    const response = await puter.ai.chat(prompt, {
      model: "gpt-5-nano"
    });

    let output;
    if (typeof response === "string") {
      output = response;
    } else if (response && response.choices && response.choices[0]?.message?.content) {
      output = response.choices[0].message.content;
    } else if (response && response.text) {
      output = response.text;
    } else {
      output = "No translation received.";
    }

    toText.value = output;
  } catch (e) {
    console.error(e);
    toText.value = "Error while translating. Open browser console for details.";
  }
});

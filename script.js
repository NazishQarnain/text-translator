const fromText = document.querySelector(".from-text");
const toText   = document.querySelector(".to-text");
const fromSel  = document.querySelector(".from-lang");
const toSel    = document.querySelector(".to-lang");
const btn      = document.querySelector(".translate-btn");
const swapBtn  = document.querySelector(".swap");

// Debug: ensure JS loaded
console.log("Translator JS loaded");

// swap languages + text
swapBtn.addEventListener("click", () => {
  const tempLang = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = tempLang;

  const tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
});

// text ko approx maxLen characters ke chunks me todna
function splitIntoChunks(text, maxLen = 400) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = "";

  for (const w of words) {
    if ((current + " " + w).trim().length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = w;
    } else {
      current += (current ? " " : "") + w;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// single chunk translate (MyMemory)
async function translateChunk(chunk, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${from}|${to}`;

  const res = await fetch(url);
  const data = await res.json();

  let translated = data.responseData?.translatedText || "";
  if (data.matches && data.matches.length) {
    data.matches.forEach(m => {
      if (m.id === 0 && m.translation) translated = m.translation;
    });
  }
  return translated;
}

// long text translate (multiple chunks sequentially)
async function translateLongText(fullText, from, to) {
  const chunks = splitIntoChunks(fullText, 400);
  console.log("Chunks count:", chunks.length);

  let result = "";
  let index = 0;

  for (const chunk of chunks) {
    index++;
    toText.value = `Translating part ${index} of ${chunks.length}...\n\n${result}`;

    try {
      const translated = await translateChunk(chunk, from, to);
      result += translated + "\n\n";
    } catch (e) {
      console.error("Error in chunk", index, e);
      result += "[Error translating this part]\n\n";
    }

    // Rate limit respect
    await new Promise(r => setTimeout(r, 1200));
  }

  return result.trim();
}

btn.addEventListener("click", async () => {
  const text = fromText.value.trim();
  const from = fromSel.value;
  const to   = toSel.value;

  if (!text) return;

  toText.value = "Preparing text and splitting into smaller parts...";

  try {
    const translated = await translateLongText(text, from, to);
    toText.value = translated || "No translation found.";
  } catch (e) {
    console.error(e);
    toText.value = "Error while translating long text. Try smaller parts.";
  }
});

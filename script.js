const fromText = document.querySelector(".from-text");
const toText   = document.querySelector(".to-text");
const fromSel  = document.querySelector(".from-lang");
const toSel    = document.querySelector(".to-lang");
const btn      = document.querySelector(".translate-btn");
const swapBtn  = document.querySelector(".swap");

swapBtn.addEventListener("click", () => {
  const tempLang = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = tempLang;

  const tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
});

btn.addEventListener("click", () => {
  const text = fromText.value.trim();
  const from = fromSel.value;
  const to   = toSel.value;

  if (!text) return;

  toText.value = "Translating...";

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      let translated = data.responseData.translatedText;
      if (data.matches) {
        data.matches.forEach(m => {
          if (m.id === 0) translated = m.translation;
        });
      }
      toText.value = translated;
    })
    .catch(err => {
      console.error(err);
      toText.value = "Error while translating.";
    });
});

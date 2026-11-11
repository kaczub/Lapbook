/* =========================================================
   PRAWA CZŁOWIEKA — interaktywny lapbook
   Logika: karty, oś czasu, zakładki, scenariusz, quiz.
   ========================================================= */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- pasek postępu i nagłówek ---------- */

  const progressBar = document.getElementById("progress");
  const header = document.getElementById("site-header");

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? doc.scrollTop / max : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("is-scrolled", doc.scrollTop > 20);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- animacje przy przewijaniu ---------- */

  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // Bezpośredni link do sekcji (np. #prawa) ma od razu pokazać jej treść.
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* ---------- aktywne linki w nawigacji ---------- */

  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  const setActiveNav = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- karty obracane ---------- */

  const flipCards = document.querySelectorAll(".flip-card");

  flipCards.forEach((card) => {
    const front = card.querySelector(".flip-front");
    const back = card.querySelector(".flip-back");

    const toggle = () => {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
      if (front) front.setAttribute("aria-hidden", String(isFlipped));
      if (back) back.setAttribute("aria-hidden", String(!isFlipped));
    };

    card.addEventListener("click", toggle);

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        toggle();
      }
    });
  });

  /* ---------- oś czasu ---------- */

  document.querySelectorAll(".timeline-entry").forEach((entry) => {
    const button = entry.querySelector(".timeline-toggle");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = entry.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /* ---------- zakładki ---------- */

  const tabButtons = Array.from(document.querySelectorAll('[role="tab"]'));
  const tabPanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  const selectTab = (button) => {
    tabButtons.forEach((tab) => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    tabPanels.forEach((panel) => {
      const selected = panel.id === button.getAttribute("aria-controls");
      panel.hidden = !selected;
    });
  };

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectTab(button));

    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabButtons.length - 1;

      const nextButton = tabButtons[nextIndex];
      selectTab(nextButton);
      nextButton.focus();
    });
  });

  /* ---------- scenariusz ---------- */

  const scenarioOptions = Array.from(document.querySelectorAll(".scenario-option"));
  const scenarioFeedback = document.getElementById("scenario-feedback");

  scenarioOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const correct = option.dataset.correct === "true";

      scenarioOptions.forEach((item) => {
        item.classList.remove("is-correct", "is-wrong");
      });

      option.classList.add(correct ? "is-correct" : "is-wrong");

      if (!correct) {
        const correctOption = scenarioOptions.find((item) => item.dataset.correct === "true");
        if (correctOption) correctOption.classList.add("is-correct");
      }

      if (scenarioFeedback) {
        scenarioFeedback.hidden = false;
        scenarioFeedback.textContent = correct
          ? "Dobrze. Zapisujesz dowody, uruchamiasz pomoc i nie zostawiasz kolegi samego. To nie „donosicielstwo” — to ochrona godności."
          : "Nie tak. Bierność lub udostępnianie krzywdy pozwala sprawcy działać dalej. Poprawna odpowiedź to C: zapisz dowody, zgłoś sprawę i wesprzyj kolegę.";
      }
    });
  });

  /* ---------- quiz ---------- */

  const quizQuestions = [
    {
      question: "Kiedy uchwalono Powszechną Deklarację Praw Człowieka?",
      options: ["1945", "1948", "1989"],
      answer: 1,
      why: "10 grudnia 1948 r. w Paryżu. Deklaracja ma 30 artykułów.",
    },
    {
      question: "Czym jest Europejski Trybunał Praw Człowieka?",
      options: [
        "Sądem UE w Luksemburgu",
        "Trybunałem Rady Europy w Strasburgu",
        "Organem ONZ w Nowym Jorku",
      ],
      answer: 1,
      why: "ETPC należy do Rady Europy, nie do UE. Ma siedzibę w Strasburgu.",
    },
    {
      question: "Które prawo jest absolutne, czyli nie można go ograniczyć w żadnej sytuacji?",
      options: ["Wolność słowa", "Prawo do prywatności", "Wolność od tortur"],
      answer: 2,
      why: "Zakaz tortur nie ma wyjątków — nawet w wojnie czy zagrożeniu terroryzmem.",
    },
    {
      question: "Co oznacza, że prawa człowieka są „przyrodzone”?",
      options: [
        "Nadało je państwo",
        "Wynikają z samego faktu bycia człowiekiem",
        "Przysługują tylko obywatelom",
      ],
      answer: 1,
      why: "Prawa człowieka nie są prezentem od władzy. Ich źródłem jest godność.",
    },
    {
      question: "Który dokument dotyczy praw dziecka?",
      options: [
        "Europejska Konwencja Praw Człowieka",
        "Konwencja o prawach dziecka",
        "Karta Narodów Zjednoczonych",
      ],
      answer: 1,
      why: "Konwencja o prawach dziecka z 1989 r. ma 54 artykuły i 196 państw-stron.",
    },
  ];

  const quizState = {
    index: 0,
    score: 0,
    answered: false,
  };

  const quizStep = document.getElementById("quiz-step");
  const quizScore = document.getElementById("quiz-score");
  const quizBar = document.getElementById("quiz-bar");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const quizFeedback = document.getElementById("quiz-feedback");
  const quizNext = document.getElementById("quiz-next");
  const quizBody = document.getElementById("quiz-body");
  const quizResult = document.getElementById("quiz-result");
  const quizResultScore = document.getElementById("quiz-result-score");
  const quizResultTitle = document.getElementById("quiz-result-title");
  const quizResultText = document.getElementById("quiz-result-text");
  const quizRestart = document.getElementById("quiz-restart");

  const letters = ["A", "B", "C", "D"];

  const updateQuizMeta = () => {
    if (quizStep) quizStep.textContent = `Pytanie ${quizState.index + 1} / ${quizQuestions.length}`;
    if (quizScore) quizScore.textContent = `${quizState.score} pkt`;
    if (quizBar) {
      const width = ((quizState.index + (quizState.answered ? 1 : 0)) / quizQuestions.length) * 100;
      quizBar.style.width = `${Math.max(6, width)}%`;
    }
  };

  const renderQuestion = () => {
    const item = quizQuestions[quizState.index];
    if (!item || !quizQuestion || !quizOptions) return;

    quizState.answered = false;

    if (quizFeedback) {
      quizFeedback.hidden = true;
      quizFeedback.textContent = "";
    }

    if (quizNext) {
      quizNext.hidden = true;
      quizNext.textContent = quizState.index === quizQuestions.length - 1 ? "Zobacz wynik" : "Następne pytanie";
    }

    quizQuestion.textContent = item.question;
    quizOptions.innerHTML = "";

    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.innerHTML = `<span class="letter">${letters[optionIndex]}</span><span>${option}</span>`;
      button.addEventListener("click", () => selectAnswer(optionIndex));
      quizOptions.appendChild(button);
    });

    updateQuizMeta();
  };

  const selectAnswer = (selectedIndex) => {
    if (quizState.answered) return;

    const item = quizQuestions[quizState.index];
    if (!item) return;

    quizState.answered = true;

    const buttons = Array.from(quizOptions.querySelectorAll(".quiz-option"));
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add("is-correct");
      if (index === selectedIndex && selectedIndex !== item.answer) button.classList.add("is-wrong");
    });

    if (selectedIndex === item.answer) quizState.score += 1;

    if (quizFeedback) {
      quizFeedback.hidden = false;
      quizFeedback.textContent =
        selectedIndex === item.answer
          ? `Dobrze. ${item.why}`
          : `Nie tym razem. Poprawna odpowiedź: ${letters[item.answer]}. ${item.why}`;
    }

    if (quizNext) quizNext.hidden = false;
    updateQuizMeta();
  };

  const showResult = () => {
    if (!quizBody || !quizResult) return;

    quizBody.hidden = true;
    quizResult.hidden = false;

    if (quizResultScore) quizResultScore.textContent = `${quizState.score} / ${quizQuestions.length}`;

    let title = "Wróć do kart";
    let text = "Przeczytaj jeszcze raz karty praw i oś czasu. Potem spróbuj ponownie.";

    if (quizState.score === quizQuestions.length) {
      title = "Ekspert od godności";
      text = "Wiesz, gdzie szukają praw i jak je chronić. Prawa człowieka nie będą już tylko hasłem.";
    } else if (quizState.score >= 3) {
      title = "Solidna wiedza";
      text = "Masz dobry fundament. Wróć do dwóch kart, które sprawiły najwięcej trudności.";
    }

    if (quizResultTitle) quizResultTitle.textContent = title;
    if (quizResultText) quizResultText.textContent = text;
  };

  const nextQuestion = () => {
    if (!quizState.answered) return;

    if (quizState.index < quizQuestions.length - 1) {
      quizState.index += 1;
      renderQuestion();
      updateQuizMeta();
    } else {
      showResult();
    }
  };

  const restartQuiz = () => {
    quizState.index = 0;
    quizState.score = 0;
    quizState.answered = false;

    if (quizBody) quizBody.hidden = false;
    if (quizResult) quizResult.hidden = true;

    renderQuestion();
  };

  if (quizNext) quizNext.addEventListener("click", nextQuestion);
  if (quizRestart) quizRestart.addEventListener("click", restartQuiz);
  if (quizQuestion && quizOptions) renderQuestion();
})();

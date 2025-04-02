const content = document.querySelector(".content");
const idContent = document.getElementById("content");
let emojiStartNumber = 250;
const emojiMaxNumber = 1600;
let emojiList;
const loader = document.querySelector(".loader_wrapper");
let deferredPrompt;

window.onload = () => {
  setTimeout(() => {
    const loader_screen = document.getElementById("loader_screen");

    setTimeout(() => {
      loader_screen.classList.add("hidden");
    }, 1000);
  }, 2300);
};

function clearActiveStyles() {
  const buttonsArray = document.querySelectorAll("nav > div");
  buttonsArray.forEach((elem) => {
    elem.classList.remove("active");
  });
}

function screen_1() {
 const part1 = document.querySelector(".part_1");
  part1.addEventListener("click", () => {
    clearActiveStyles();
    part1.classList.add("active");
    idContent.style.justifyContent = "center";
    content.innerHTML = `<img src="icon.png" alt="Logo"  class="content_logo"/>
      <span>Харлампиева Ксения</span>`;
document.body.appendChild(audio);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      document.querySelector(".install_button").classList.add("hidden");
    } else {
      content.innerHTML += `<button class="install_button" onclick='install()'>Установить</button>`;
    }
  });
}


screen_1();

async function screen_2() {
  const part2 = document.querySelector(".part_2");
  part2.addEventListener("click", async () => {
    loader.classList.remove("hidden");
    clearActiveStyles();
    part2.classList.add("active");
    // idContent.style.justifyContent = "space-between";
    content.innerHTML = "<div class='emojis'></div>";
    const emojis_wrap = document.querySelector(".emojis");
    try {
      const fetchEmoji = await fetch("https://api.github.com/emojis");
      const emojis = await fetchEmoji.json();
      const emoji = Object.values(emojis);
      emojiList = emoji;
      for (let i = 100; i < 280; i++) {
        emojis_wrap.innerHTML += `<img src="${emoji[i]}" class='emoji'>`;
      }
      emojis_wrap.innerHTML +=
        '<button class="button_add" onClick="addEmoji()">Показать еще</button>';
      loader.classList.add("hidden");
    } catch (e) {
      alert(
        "Работа приложения в оффлайн режиме невозможна. Загрузите данные в кеш!"
      );
      loader.classList.add("hidden");
      const part1 = document.querySelector(".part_1").click();
    }
  });
}

screen_2();

function addEmoji() {
  const button_add = document.querySelector(".button_add");
  const emojis_wrap = document.querySelector(".emojis");
  emojis_wrap.removeChild(button_add);
  const helper = emojiStartNumber + 50;
  for (emojiStartNumber; emojiStartNumber < helper; emojiStartNumber++) {
    emojis_wrap.innerHTML += `<img src="${emojiList[emojiStartNumber]}" class='emoji'>`;
  }
  if (emojiMaxNumber - emojiStartNumber > 49) {
    emojis_wrap.innerHTML +=
      '<button class="button_add" onClick="addEmoji()">Показать еще</button>';
  }
}

function screen_4() {
  const part4 = document.querySelector(".part_4");
  part4.addEventListener("click", () => {
    clearActiveStyles();
    part4.classList.add("active");
    loader.classList.remove("hidden");
    content.innerHTML = "<div class='log'></div>";
    const log = document.querySelector(".log");
    setTimeout(() => {
      log.innerHTML += `
        <div class='SW'>Регистрация ServiceWorker завершена</div>
      `;
      setTimeout(() => {
        log.innerHTML += `
          <div class='SW'>Активация ServiceWorker завершена</div>
        `;
        if (navigator.onLine) {
          setTimeout(() => {
            log.innerHTML += `
            <div class='SW'>Подключение к интернету активно</div>
            <div class='SW'>Загрузка файлов с сервера</div>
          `;
            loader.classList.add("hidden");
          }, 1400);
        } else {
          setTimeout(() => {
            log.innerHTML += `
            <div class='SW'>Подключение к интернету не активно</div>
            <div class='SW'>Загрузка файлов из кеша</div>
          `;
            loader.classList.add("hidden");
          }, 1400);
        }
      }, 1400);
    }, 1400);
  });
  
}

screen_4();

// Активация ServiceWorker

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/ServiceWorker.js")
      .then((registration) => {
        console.log(
          "Service Worker зарегистрирован с областью видимости:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Ошибка регистрации Service Worker:", error);
      });
  });
} else {
  console.log("Service Worker не поддерживается в данном браузере.");
}

window.addEventListener("beforeinstallprompt", (event) => {
  // Сохраняем event, чтобы использовать его позже
  deferredPrompt = event;
  console.log(deferredPrompt);
  // Предотвращаем браузерный баннер по умолчанию
  event.preventDefault();
});

function install() {
  // Проверяем, есть ли сохраненное событие

  if (deferredPrompt) {
    // Запускаем событие для показа браузерного баннера
    deferredPrompt.prompt();

    // Ожидаем выбора пользователя
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Пользователь согласился установить PWA");
        // Скрыть кнопку или другой элемент после установки
        document.getElementById("installButton").style.display = "none";
      } else {
        console.log("Пользователь отказался устанавливать PWA");
      }

      // Сбрасываем deferredPrompt после использования
      deferredPrompt = null;
    });
  }
}

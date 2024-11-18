const getSignal = document.getElementById("get-signal");
const stopSignalTimeBlock = document.getElementById("stop-signal-time-block");
const printSignal = document.getElementById("print-signal");
const stopProgress = document.getElementById("stop-progress");
const errorNotification = document.getElementById("error-notification");
const errorProgress = document.getElementById("error-progress");
const textError = document.getElementById("text-error");
const getSignalTwo = document.getElementById("get-signal-two");
const errorExit = document.getElementById("error-exit");

let signals = []
let currentSignalIndex = 0;

function loadSignals() {
  return fetch('./data/signals.json')
    .then(response => {
      console.log('Статус ответа:', response.status);
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }
      return response.json(); // Парсим JSON автоматически
    })
    .then(data => {
      console.log('Данные из JSON:', data);
      signals = data; // Присваиваем данные глобальной переменной
      console.log('Массив сигналов после загрузки:', signals);
    })
    .catch(error => {
      console.error('Ошибка при загрузке сигналов:', error);
      alert('Не удалось загрузить сигналы. Пожалуйста, проверьте путь к signals.json.');
    });
}


loadSignals().then(() => {
  console.log('Сигналы успешно загружены.');
  getSignal.disabled = false;
  getSignalTwo.disabled = false;

  getSignal.onclick = function () {
    console.log('Кнопка GET SIGNAL нажата.');
    console.log('Массив сигналов в момент нажатия кнопки:', signals);

    if (signals.length === 0) {
      console.error('Массив сигналов пустой.');
      alert('Сигналы не загружены. Пожалуйста, попробуйте позже.');
      return;
    }

    let receivingSignal = signals[currentSignalIndex];
    console.log('Полученный сигнал:', receivingSignal);

    currentSignalIndex++;
    if (currentSignalIndex >= signals.length) {
      currentSignalIndex = 0;
    }

    printSignal.innerHTML = `${receivingSignal}x`;
    printSignal.classList.remove("deactivate");

    goTimer(60);
    getSignal.disabled = true;
  };

  getSignalTwo.onclick = function () {
    console.log('Кнопка GET SIGNAL TWO нажата.');
    getSignalTwo.disabled = true;
    goTimerError(5, "go");
  };
}).catch(error => {
  console.error('Ошибка при инициализации приложения:', error);
});

function goTimer(time) {
  stopSignalTimeBlock.classList.remove("deactivate");
  stopProgress.style["animation"] = `animateProgress ${time}s linear infinite`;
  let stopTimer = document.getElementById("stop-timer");
  let timer = setInterval(() => {
    if (time >= 1) {
      stopTimer.innerHTML = `${time--}<span> seconds</span>`;
      getSignalTwo.classList.remove("deactivate");
      getSignal.classList.add("deactivate");
      getSignalTwo.style["z-index"] = "5";
      getSignal.disabled = true;
    } else {
      clearInterval(timer);
      stopSignalTimeBlock.classList.add("deactivate");
      stopProgress.style["animation"] = "none";
      getSignalTwo.classList.add("deactivate");
      getSignal.classList.remove("deactivate");
      getSignalTwo.style["z-index"] = "-1";
      getSignal.disabled = false;
    }
  }, 1000);
}

function goTimerError(time) {
  const timer = setInterval(() => {
    if (time >= 1) {
      time--;
      errorNotification.classList.remove("deactivate");
      textError.innerHTML = `Wait for the time to expire`;
      errorProgress.style["animation"] = "animateErrorProgress 5s linear infinite";
      errorNotification.style["transform"] = "translateY(0px)";
    } else {
      errorNotification.style["transform"] = "translateY(-99px)";
      errorProgress.style["animation"] = "none";
      clearInterval(timer);
      getSignalTwo.disabled = false;
      errorNotification.classList.add("deactivate");
    }
    errorExit.onclick = function () {
      errorNotification.classList.add("deactivate");
      errorNotification.style["transform"] = "translateY(-99px)";
      errorProgress.style["animation"] = "none";;
      clearInterval(timer);
      getSignalTwo.disabled = false;
    }
  }, 1000)
}
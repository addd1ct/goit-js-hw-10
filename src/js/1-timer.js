import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysField = document.querySelector("[data-days]");
const hoursField = document.querySelector("[data-hours]");
const minutesField = document.querySelector("[data-minutes]");
const secondsField = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(input, options);

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function updateTimer(ms) {
  const time = convertMs(ms);

  daysField.textContent = addLeadingZero(time.days);
  hoursField.textContent = addLeadingZero(time.hours);
  minutesField.textContent = addLeadingZero(time.minutes);
  secondsField.textContent = addLeadingZero(time.seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function startTimer() {
  const endTime = userSelectedDate.getTime();

  timerInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeRemaining = endTime - currentTime;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      updateTimer(0);

      iziToast.success({
        title: "Completed",
        message: "The countdown has finished!",
      });

      startButton.disabled = true;
      input.disabled = false;
      return;
    }

    updateTimer(timeRemaining);
  }, 1000);

  startButton.disabled = true;
  input.disabled = true;
}

startButton.addEventListener("click", startTimer);

startButton.disabled = true;

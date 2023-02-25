// import "./../styles/reset.scss";
// import "./../styles/mixins.scss";
// import "./../styles/styles.scss";
// import "swiper/swiper.min.css";

// import { languages } from "./languages.js";
// import Swiper, { Navigation } from "swiper";
// Swiper.use([Navigation]);

const checkboxes = {
  requirements: ['minimum', 'recommended'],
  versions: ['standard', 'limited']
}

let isPlay = false;
const classes = {
  opened: 'opened',
  hidden: 'hidden',
  active: 'active',
}
const values = [
  {
    price: 19.99,
    title: 'Standard Edition'
  },
  {
    price: 18.99,
    title: 'Standard Edition'
  },
  {
    price: 29.99,
    title: 'Digital Deluxe Edition'
  },
]

const buyButton = document.querySelectorAll('.buy-button');
const language = document.querySelectorAll('.language');
const checkbox = document.querySelectorAll('.checkbox');
const header = document.querySelector('.header');
const menuLink = document.querySelectorAll('.menu-link');
const menuButton = document.querySelector('.header-menu__button');
const video = document.getElementById('video');
const videoButton = document.querySelector('.video-btn');
const faqItem = document.querySelectorAll('.faq-item');
const sections = document.querySelectorAll('.section');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalTitle = document.querySelector('.modal-subtitle');
const modalPrice = document.querySelector('.modal-total__price');
const modalClose = document.querySelector('.modal-close');

/**
 *  Функция toggleMenu добавляет класс 'opened' к элементу в котором находится меню. 
 * 
 * Функция scrollToSection 
 * 1) Отменяет стандартное поведение ссылки
 * 2) Проводится проверка на корректнсть якоря
 * 3) По названию якоря получаем элемент 
 * 4) Получаем расстояние от начала страницы до элемента
 * 5) Прокручиваем страницу до нужного элемента
 * 
 *   */
const toggleMenu = () => { header.classList.toggle(classes.opened) };
const scrollToSection = (e) => {
  e.preventDefault();
  const href = e.currentTarget.getAttribute('href');

  if (!href && !href.startsWith('#')) return;

  const section = document.querySelector(href);
  const top = section?.offsetTop || 0;

  window.scrollTo({ top, behavior: "smooth" });
};

/**
 * Реализация таймера
 */
const formatValue = (value) => value < 10 ? `0${value}` : value;

const getTimerValues = (diff) => {
  return {
    seconds: (diff / 1000) % 60,
    minutes: (diff / (1000 * 60)) % 60,
    hours: (diff / (1000 * 60 * 60)) % 24,
    days: (diff / (1000 * 60 * 60 * 24)),
  }
}

const setTimerValue = (values) => {
  Object.entries(values).forEach(([key, value]) => {
    const timerValue = document.getElementById(key);
    timerValue.textContent = formatValue(Math.floor(value));
  });
}

const startTimer = (date) => {
  const id = setInterval(() => {
    const diff = new Date(date).getTime() - new Date().getTime();

    if (diff < 0) {
      clearInterval(id);
      return;
    }

    setTimerValue(getTimerValues(diff));

  }, 1000)
};

/**
 *  Функция для запуска видео-плеера
 */

const handelVideo = ({ target }) => {
  const info = target.parentElement;
  console.log(info)

  isPlay = !isPlay;
  info.classList.toggle(classes.hidden, isPlay);
  target.innerText = isPlay ? 'Pause' : 'Play';
  isPlay ? video.play() : video.pause();

}

/***
 *  
 */

const handleCheckbox = ({ currentTarget: { checked, name } }) => {
  const { active } = classes;
  const value = checkboxes[name][Number(checked)];
  const list = document.getElementById(value);
  const tabs = document.querySelectorAll(`[data-${name}]`);
  const siblings = list.parentElement.children;

  for (const item of siblings) {
    item.classList.remove(active);
  }

  for (const tab of tabs) {
    tab.classList.remove(active);
    tab.dataset[name] === value && tab.classList.add(active);
  }

  list.classList.add(active);
};

/**
 * 
 *  Инициализация слайдера
 */

const initSlider = () => {
  new Swiper('.swiper', {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 20,
    initialSlide: 2,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};

/**
 *  Анимация акардиона FAQ
 */

const handleFaqItem = ({ currentTarget: target }) => {
  target.classList.toggle(classes.opened);
  const isOpened = target.classList.contains(classes.opened);
  const height = target.querySelector('p').clientHeight;
  const content = target.querySelector('.faq-item__content');

  content.style.height = `${isOpened ? height : 0}px`;
};

/***
 * 
 * Анимация секций
 */

const handleScroll = () => {
  const { scrollY: y, innerHeight: h } = window;

  sections.forEach((section) => {

    if (y > section.offsetTop - h / 1.5) {
      section.classList.remove(classes.hidden);
    }

  })
};

/**
 * 
 *  Переключает текст c ru на en
 */

const setTexts = () => {
  const lang = localStorage.getItem('lang') || 'en';
  const content = languages[lang];
  // console.log(content)

  Object.entries(content).forEach(([key, value]) => {
    const items = document.querySelectorAll(`[data-text="${key}"]`);

    items.forEach((item) => (item.innerText = value));
  });

}

const toggleLanguage = ({ target }) => {
  const { lang } = target.dataset;

  if (!lang) return;

  localStorage.setItem('lang', lang);

  setTexts();

};

/***
 * 
 * Вызов модального окна
 * 
 */

const handleBuyButton = ({ currentTarget: target }) => {
  const { value } = target.dataset;

  if (!value) return;

  const { price, title } = values[value];

  modalTitle.innerText = title;
  modalPrice.innerText = price + '$';
  modal.classList.add(classes.opened);
  overlay.classList.add(classes.opened);
};

const closeModal = () => {
  modal.classList.remove(classes.opened);
  overlay.classList.remove(classes.opened);
};


/***
 * 
 * 
 * Слушатели событий и функции
 */
setTexts();
initSlider();
startTimer('November 27, 2023');
window.addEventListener('scroll', handleScroll);
menuButton.addEventListener('click', toggleMenu);
videoButton.addEventListener('click', handelVideo);
menuLink.forEach((link) => link.addEventListener('click', scrollToSection));
checkbox.forEach((box) => box.addEventListener('click', handleCheckbox));
faqItem.forEach((item) => item.addEventListener('click', handleFaqItem));
language.forEach((lang) => lang.addEventListener('click', toggleLanguage));
buyButton.forEach((btn) => btn.addEventListener('click', handleBuyButton));
modalClose.addEventListener('click', closeModal);
/**
 * Реальные данные Almaz Tour с текущего сайта almaztour.kz.
 * Все контакты, график и соцсети — как есть, без изменений.
 */
export const site = {
  name: "Almaz Tour",
  nameRu: "Алмаз Тур",
  slogan: "Влюбляем в путешествия",
  description:
    "Туристическое агентство Almaz Tour в Астане: зарубежные туры по 15 направлениям, горящие путёвки, оздоровительные туры. Подбираем отдых под ваш бюджет.",
  url: "https://almaztour.kz",

  phones: [
    { label: "+7 775 908 90 48", href: "tel:+77759089048" },
    { label: "+7 775 888 97 32", href: "tel:+77758889732" },
  ],
  email: "aliya.trips@gmail.com",

  address: {
    city: "Астана",
    line: "ул. Достык 4, ТЦ «Festival Avenue»",
    full: "г. Астана, ул. Достык 4, ТЦ «Festival Avenue»",
  },

  hours: [
    { days: "Пн–Пт", time: "10:00–20:00" },
    { days: "Сб–Вс", time: "12:00–16:00" },
  ],

  social: {
    facebook: "https://www.facebook.com/almaztour.kz/",
    instagram: "https://www.instagram.com/almaztour.kz/",
    whatsapp: "https://api.whatsapp.com/send?phone=77758889732",
  },

  /* Счётчики с текущего сайта */
  counters: [
    { value: 1340, label: "мест для путешествий" },
    { value: 3065, label: "отелей для пребывания" },
    { value: 1325, label: "довольных клиентов" },
    { value: 100, suffix: "%", label: "безопасность и надёжность" },
  ],
} as const;

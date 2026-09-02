/**
 * Реальные данные Almaz Tour с текущего сайта almaztour.kz.
 * Все контакты, график и соцсети — как есть, без изменений.
 */
export const site = {
  name: "Almaz Tour",
  nameRu: "Алмаз Тур",
  slogan: "Влюбляем в путешествия",
  description:
    "Туристическое агентство Almaz Tour в Астане: туры в любую точку мира, горящие путёвки, оздоровительные туры. Отели проверяем лично и подбираем отдых под ваш бюджет.",
  url: "https://almaztour.kz",

  /* Первый номер — рабочий, он показывается в шапке и на кнопках */
  phones: [
    { label: "+7 706 601 79 44", href: "tel:+77066017944" },
    { label: "+7 775 888 97 32", href: "tel:+77758889732" },
  ],
  email: "aliya.trips@gmail.com",

  address: {
    city: "Астана",
    line: "ул. Достык 4, ТЦ «Festival Avenue»",
    full: "г. Астана, ул. Достык 4, ТЦ «Festival Avenue»",
    /* Прямая ссылка на карточку офиса в 2ГИС */
    map2gis:
      "https://2gis.kz/astana/firm/70000001034461305/71.408133%2C51.127951?m=71.408289%2C51.127873%2F20",
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

  counters: [
    { value: 8, suffix: " лет", label: "подбираем туры из Астаны" },
    { value: "множество", label: "довольных клиентов" },
    { value: "множество", label: "отелей в подборке" },
    { value: 100, suffix: "%", label: "безопасность и надёжность" },
  ],
} as const;

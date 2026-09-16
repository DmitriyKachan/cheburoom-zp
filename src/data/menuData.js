/**
 * ЧЕБУROOM (@cheburoom.zp) — Офіційне меню закладу
 * Повне меню перенесене з актуальних позицій закладу з усіма додатками та категоріями
 */

export const MENU_DATA = {
  categories: [
    { id: "all", name: "Всі страви", icon: "LayoutGrid" },
    { id: "chebureks", name: "Чебуреки", icon: "Flame" },
    { id: "wok", name: "WOK", icon: "CookingPot" },
    { id: "deepfry", name: "Фритюр", icon: "Sparkles" },
    { id: "breakfast", name: "Ранкове меню", icon: "Egg" },
    { id: "salads", name: "Салати", icon: "Salad" },
    { id: "coffee", name: "Кава та напої", icon: "Coffee" },
    { id: "desserts", name: "Десерти", icon: "Cookie" }
  ],

  // Офіційні додатки до чебуреків з меню
  chebOptions: {
    crust: [
      { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
    ],
    extras: [
      { id: "extra-cheese", name: "Сир", price: 25 },
      { id: "extra-4cheese", name: "4 Сири", price: 30 },
      { id: "extra-mushrooms", name: "Гриби", price: 25 },
      { id: "extra-tomato", name: "Томат свіжий", price: 25 },
      { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
      { id: "extra-beef", name: "Фарш телятина", price: 30 },
      { id: "extra-pork", name: "Фарш свинина", price: 25 },
      { id: "extra-chicken", name: "Фарш курка", price: 25 }
    ]
  },

  items: [
    // --- ЧЕБУРЕКИ ---
    {
      id: "cheb-pulled-beef",
      category: "chebureks",
      name: "Чебурек з рваною телятиною",
      shortDesc: "Ніжна тонка яловичина тривалого томління, цибуля та букет спецій у фірмовому пухирчастому тісті.",
      desc: "Фірмовий чебурек Cheburoom. Томлена до найніжнішого стану рвана телятина з соковитим бульйоном та тонким хрустким тістом із золотавими пухирцями.",
      price: 119,
      weight: "180 г",
      badge: "Фірмовий хіт",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/cheb-pulled-beef.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 },
          { id: "extra-4cheese", name: "4 Сири", price: 30 },
          { id: "extra-mushrooms", name: "Гриби", price: 25 },
          { id: "extra-tomato", name: "Томат свіжий", price: 25 },
          { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
          { id: "extra-beef", name: "Фарш телятина", price: 30 },
          { id: "extra-pork", name: "Фарш свинина", price: 25 },
          { id: "extra-chicken", name: "Фарш курка", price: 25 }
        ]
      }
    },
    {
      id: "cheb-four-cheese",
      category: "chebureks",
      name: "Чебурек 4 сири",
      shortDesc: "Багатий вершковий мікс 4 добірних сортів сиру, що тягнуться неймовірними нитками.",
      desc: "Гармонія благородних сирів всередині хрусткого гарячого чебурека. Максимально ніжний вершковий смак для справжніх сироманів.",
      price: 119,
      weight: "170 г",
      badge: "Топ сир",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cheb-four-cheese.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 },
          { id: "extra-4cheese", name: "4 Сири", price: 30 },
          { id: "extra-mushrooms", name: "Гриби", price: 25 },
          { id: "extra-tomato", name: "Томат свіжий", price: 25 },
          { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
          { id: "extra-beef", name: "Фарш телятина", price: 30 },
          { id: "extra-pork", name: "Фарш свинина", price: 25 },
          { id: "extra-chicken", name: "Фарш курка", price: 25 }
        ]
      }
    },
    {
      id: "cheb-salmon",
      category: "chebureks",
      name: "Чебурек з лососем",
      shortDesc: "Преміальне соковите філе лосося з делікатними вершковими відтінками.",
      desc: "Вишукане поєднання соковитої червоної риби та фірмового хрусткого тіста. Один із найпопулярніших гастрономічних експериментів нашої кухні.",
      price: 119,
      weight: "170 г",
      badge: "Преміум",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/cheb-salmon.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 },
          { id: "extra-4cheese", name: "4 Сири", price: 30 },
          { id: "extra-mushrooms", name: "Гриби", price: 25 },
          { id: "extra-tomato", name: "Томат свіжий", price: 25 },
          { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
          { id: "extra-beef", name: "Фарш телятина", price: 30 },
          { id: "extra-pork", name: "Фарш свинина", price: 25 },
          { id: "extra-chicken", name: "Фарш курка", price: 25 }
        ]
      }
    },
    {
      id: "cheb-veal",
      category: "chebureks",
      name: "Чебурек з телятиною",
      shortDesc: "Добірне м'ясо телятини, свіжа цибуля, ароматний перець та море гарячого бульйону.",
      desc: "Еталонний м'ясний чебурек. Натуральна телятина без добавок, тонке тісто, що лускається від соку, ідеально збалансовані спеції.",
      price: 99,
      weight: "180 г",
      badge: "Класика",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/cheb-veal.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 },
          { id: "extra-4cheese", name: "4 Сири", price: 30 },
          { id: "extra-mushrooms", name: "Гриби", price: 25 },
          { id: "extra-tomato", name: "Томат свіжий", price: 25 },
          { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
          { id: "extra-beef", name: "Фарш телятина", price: 30 },
          { id: "extra-pork", name: "Фарш свинина", price: 25 },
          { id: "extra-chicken", name: "Фарш курка", price: 25 }
        ]
      }
    },
    {
      id: "cheb-cheese",
      category: "chebureks",
      name: "Чебурек з сиром",
      shortDesc: "Щедра порція тягучого розплавленого сиру під золотистою скоринкою.",
      desc: "Традиційний сирний чебурек. Велика кількість розплавленого сулугуні з вершковим смаком у гарячому пухирчастому тісті.",
      price: 89,
      weight: "170 г",
      badge: "Сирний",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cheb-cheese.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 },
          { id: "extra-4cheese", name: "4 Сири", price: 30 },
          { id: "extra-mushrooms", name: "Гриби", price: 25 },
          { id: "extra-tomato", name: "Томат свіжий", price: 25 },
          { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
          { id: "extra-beef", name: "Фарш телятина", price: 30 },
          { id: "extra-pork", name: "Фарш свинина", price: 25 },
          { id: "extra-chicken", name: "Фарш курка", price: 25 }
        ]
      }
    },
    {
      id: "cheb-pork",
      category: "chebureks",
      name: "Чебурек зі свининою",
      shortDesc: "Соковитий домашній фарш зі свинини, ароматні спеції та насичений бульйон.",
      desc: "Ситна перевірена класика. Свинячий фарш крупного помолу, свіжа цибулька та чорний перець у хрусткому конвертику.",
      price: 89,
      weight: "180 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/cheb-pork.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 },
          { id: "extra-4cheese", name: "4 Сири", price: 30 },
          { id: "extra-mushrooms", name: "Гриби", price: 25 },
          { id: "extra-tomato", name: "Томат свіжий", price: 25 },
          { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
          { id: "extra-beef", name: "Фарш телятина", price: 30 },
          { id: "extra-pork", name: "Фарш свинина", price: 25 },
          { id: "extra-chicken", name: "Фарш курка", price: 25 }
        ]
      }
    },
    {
      id: "cheb-chicken",
      category: "chebureks",
      name: "Чебурек з куркою",
      shortDesc: "Ніжне подрібнене куряче філе з легкими спеціями у тонкому пухирчастому тісті.",
      desc: "Легкий та ніжний чебурек зі свіжого філе птиці. Ідеальний баланс ніжності, соковитості та хрускоту.",
      price: 89,
      weight: "180 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/cheb-chicken.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 },
          { id: "extra-4cheese", name: "4 Сири", price: 30 },
          { id: "extra-mushrooms", name: "Гриби", price: 25 },
          { id: "extra-tomato", name: "Томат свіжий", price: 25 },
          { id: "extra-chili", name: "Перець Чілі 🌶️", price: 25 },
          { id: "extra-beef", name: "Фарш телятина", price: 30 },
          { id: "extra-pork", name: "Фарш свинина", price: 25 },
          { id: "extra-chicken", name: "Фарш курка", price: 25 }
        ]
      }
    },
    {
      id: "cheb-cherry",
      category: "chebureks",
      name: "Чебурек вишня",
      shortDesc: "Цільні стиглі вишні у солодкому соку під хрусткою цукровою скоринкою.",
      desc: "Справжній десертний шедевр! Велика кількість натуральної української вишні без кісточок, ароматний ягідний сироп і хрустке тісто.",
      price: 89,
      weight: "170 г",
      badge: "Солодкий",
      badgeColor: "rose",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cheb-cherry.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Додати сир", price: 25 }
        ]
      }
    },
    {
      id: "cheb-cherry-cheese",
      category: "chebureks",
      name: "Чебурек вишня сир",
      shortDesc: "Вишуканий контраст соковитої кисло-солодкої вишні та вершкового тягучого сиру.",
      desc: "Один з улюблених десертних фаворитів наших гостей. Тонке тісто, теплий сир і яскрава ягідна начинка створюють незабутній смак.",
      price: 89,
      weight: "180 г",
      badge: "Гурман",
      badgeColor: "rose",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cheb-cherry-cheese.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: []
      }
    },
    {
      id: "cheb-pumpkin",
      category: "chebureks",
      name: "Чебурек з гарбузом",
      shortDesc: "Сезонний печений гарбуз із тонкими східними прянощами та цибулькою.",
      desc: "Автентичний кримськотатарський рецепт. Ніжний карамелізований гарбуз, легкий перчик і хрустке тісто.",
      price: 79,
      weight: "170 г",
      badge: "Сезонне",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cheb-pumpkin.jpg",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (пухирці, хрускіт)", priceDelta: 0, default: true }
        ],
        extras: [
          { id: "extra-cheese", name: "Сир", price: 25 }
        ]
      }
    },
    {
      id: "cheb-set-6",
      category: "chebureks",
      name: "Сет чебуреків 6 шт",
      shortDesc: "Великий комбо-сет із 6 гарячих пухирчастих чебуреків для дружньої компанії.",
      desc: "Найвигідніший сет для перекусу з друзями або родиною. 6 свіжосмажених соковитих чебуреків в асорті.",
      price: 220,
      weight: "6 шт",
      badge: "Суперціна",
      badgeColor: "emerald",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/cheb-set-6.jpg",
      customizable: false
    },

    // --- WOK ---
    {
      id: "wok-pulled-beef",
      category: "wok",
      name: "WOK з рваною телятиною у кисло-солодкому соусі",
      shortDesc: "Яєчна локшина wok, ніжна волокниста телятина, свіжі овочі, кунжут та авторський кисло-солодкий соус.",
      desc: "Фірмова гаряча страва WOK. Швидке обсмаження на розпеченій пательні зберігає соковитість овочів та насичений м'ясний аромат телятини.",
      price: 155,
      weight: "350 г",
      badge: "Хіт WOK",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/wok-pulled-beef.jpg",
      customizable: false
    },
    {
      id: "wok-bacon",
      category: "wok",
      name: "WOK з копченою грудинкою",
      shortDesc: "Смажена локшина з ароматними скибочками копченої свинячої грудинки та хрусткими овочами.",
      desc: "Ситний вок із димним ароматом та глибоким карамелізованим соусом. Прикрашений білим кунжутом і свіжою зеленню.",
      price: 155,
      weight: "350 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/wok-bacon.jpg",
      customizable: false
    },
    {
      id: "wok-chicken-cream",
      category: "wok",
      name: "WOK з куркою та вершковим соусом",
      shortDesc: "Ніжне філе курки, пшенична локшина, печериці та овочі під густим оксамитовим вершковим соусом.",
      desc: "М'який вершковий смак, що огортає кожну локшину. Соковиті шматочки курятини та хрумкий перчик wok.",
      price: 155,
      weight: "350 г",
      badge: "Ніжний",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/wok-chicken-cream.jpg",
      customizable: false
    },
    {
      id: "wok-seafood",
      category: "wok",
      name: "Лапша курка / морепродукти",
      shortDesc: "Локшина швидкої обжарки wok з курячим філе або соковитим коктейлем з морепродуктів.",
      desc: "Преміальний вибір азійської локшини з пікантною соєво-імбирною заправкою, паростками та овочами.",
      price: 175,
      weight: "350 г",
      badge: "Преміум",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/wok-seafood.jpg",
      customizable: false
    },

    // --- ФРИТЮР ---
    {
      id: "fry-fries",
      category: "deepfry",
      name: "Картопля фрі",
      shortDesc: "Золотисті хрусткі брусочки картоплі з легкою морською сіллю.",
      desc: "Класичний гарячий фрі з ідеальним хрускотом ззовні та м'якою серединкою. Ідеально до улюбленого соусу.",
      price: 95,
      weight: "200 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/fry-fries.jpg",
      customizable: true,
      options: {
        extras: [
          { id: "sauce-cheese", name: "Сирний соус", price: 25 },
          { id: "sauce-bbq", name: "Соус Барбекю", price: 25 },
          { id: "sauce-garlic", name: "Часниковий соус", price: 25 },
          { id: "sauce-sweet-sour", name: "Кисло-солодкий", price: 25 },
          { id: "extra-jalapeno", name: "Халапеньйо", price: 20 },
          { id: "extra-cheese", name: "Подвійний сир", price: 25 }
        ]
      }
    },
    {
      id: "fry-mozzarella",
      category: "deepfry",
      name: "Моцарела у фритюрі",
      shortDesc: "Хрусткі палички з ніжного сиру моцарела у сухарній паніровці.",
      desc: "Гарячий сир тягнеться довгими нитками при кожному укусі. Подається гарячим прямо з фритюру.",
      price: 125,
      weight: "150 г",
      badge: "Хіт",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/fry-mozzarella.jpg",
      customizable: true,
      options: {
        extras: [
          { id: "sauce-cheese", name: "Сирний соус", price: 25 },
          { id: "sauce-bbq", name: "Соус Барбекю", price: 25 },
          { id: "sauce-garlic", name: "Часниковий соус", price: 25 },
          { id: "sauce-sweet-sour", name: "Кисло-солодкий", price: 25 },
          { id: "extra-jalapeno", name: "Халапеньйо", price: 20 }
        ]
      }
    },
    {
      id: "fry-wings",
      category: "deepfry",
      name: "Крила кріспі",
      shortDesc: "Курячі крильця в екстрахрусткій золотавій паніровці з легким пряним ароматом.",
      desc: "Неймовірно хрустка скоринка та ніжне м'ясо всередині. Справжнє задоволення для фанатів кріспі.",
      price: 125,
      weight: "200 г",
      badge: "Хруст",
      badgeColor: "amber",
      isHit: true,
      isSpicy: true,
      isVegetarian: false,
      image: "/images/dishes/fry-wings.jpg",
      customizable: true,
      options: {
        extras: [
          { id: "sauce-cheese", name: "Сирний соус", price: 25 },
          { id: "sauce-bbq", name: "Соус Барбекю", price: 25 },
          { id: "sauce-garlic", name: "Часниковий соус", price: 25 },
          { id: "sauce-sweet-sour", name: "Кисло-солодкий", price: 25 },
          { id: "extra-jalapeno", name: "Халапеньйо", price: 20 }
        ]
      }
    },
    {
      id: "fry-nuggets",
      category: "deepfry",
      name: "Нагетси",
      shortDesc: "Шматочки 100% соковитого курячого філе в золотистій паніровці.",
      desc: "Улюблені нагетси для дорослих та дітей. Обсмажені до апетитного золотистого кольору.",
      price: 95,
      weight: "200 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/fry-nuggets.jpg",
      customizable: true,
      options: {
        extras: [
          { id: "sauce-cheese", name: "Сирний соус", price: 25 },
          { id: "sauce-bbq", name: "Соус Барбекю", price: 25 },
          { id: "sauce-garlic", name: "Часниковий соус", price: 25 },
          { id: "sauce-sweet-sour", name: "Кисло-солодкий", price: 25 },
          { id: "extra-jalapeno", name: "Халапеньйо", price: 20 }
        ]
      }
    },

    // --- РАНКОВЕ МЕНЮ ---
    {
      id: "brk-shakshuka",
      category: "breakfast",
      name: "Шакшука",
      shortDesc: "Томлені в пікантному томатному соусі з перцем яйця-глазунья, посипані свіжою зеленню.",
      desc: "Яскравий східний сніданок! Соковиті помідори, солодкий перець, часник, кінза та свіжі яйця з рідким жовтком.",
      price: 95,
      weight: "250 г",
      badge: "Сніданок дня",
      badgeColor: "rose",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/breakfast-shakshuka.jpg",
      customizable: false
    },
    {
      id: "brk-potato-egg",
      category: "breakfast",
      name: "Картопля з яйцем та зеленню",
      shortDesc: "Золотава смажена картопелька, яйця з ніжною скоринкою та багато свіжого кропу.",
      desc: "Ситний домашній сніданок за затишними традиціями. Наповнює енергією на весь день.",
      price: 95,
      weight: "250 г",
      badge: "Домашнє",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/brk-potato-egg.jpg",
      customizable: false
    },
    {
      id: "brk-omelet",
      category: "breakfast",
      name: "Омлет з зеленню",
      shortDesc: "Пишний ніжний омлет на молоці з міксом свіжої подрібненої зелені.",
      desc: "Легкий, збалансований та корисний початок вашого дня. Готується зі свіжих відбірних яєць.",
      price: 95,
      weight: "200 г",
      badge: "Легкий",
      badgeColor: "emerald",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/brk-omelet.jpg",
      customizable: false
    },
    {
      id: "brk-fried-bacon",
      category: "breakfast",
      name: "Яєчня з беконом",
      shortDesc: "Два підсмажені яйця з хрусткими підрум'яненими слайсами копченого бекону.",
      desc: "Класичний енергійний сніданок з гарячим беконом та ідеально просмаженими яйцями.",
      price: 95,
      weight: "220 г",
      badge: "Класика",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/brk-fried-bacon.jpg",
      customizable: false
    },

    // --- САЛАТИ ---
    {
      id: "sal-avocado-shrimp",
      category: "salads",
      name: "Салат з авокадо та креветками",
      shortDesc: "Тигрові креветки швидкого обсмаження, стигле авокадо, томати чері та легка лимонна заправка.",
      desc: "Ніжний та вишуканий свіжий салат. Хрустке листя салату, стигле кремове авокадо та соковиті креветки.",
      price: 185,
      weight: "230 г",
      badge: "Шеф-вибір",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/salad-avocado-shrimp.jpg",
      customizable: false
    },
    {
      id: "sal-avocado-salmon",
      category: "salads",
      name: "Салат з авокадо та лососем",
      shortDesc: "Скибочки слабосоленого лосося, шматочки авокадо, мікс салатної зелені та оливкова заправка.",
      desc: "Розкішний морський салат, багатий на корисні омега-3 жири та вітаміни. Подається охолодженим.",
      price: 185,
      weight: "230 г",
      badge: "Преміум",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/sal-avocado-salmon.jpg",
      customizable: false
    },
    {
      id: "sal-caesar",
      category: "salads",
      name: "Цезар з куркою",
      shortDesc: "Ароматне куряче філе гриль, листя ромен, тертий пармезан, часникові крутони та соус Цезар.",
      desc: "Бездоганно збалансований класичний рецепт Цезаря від нашого шефа з фірмовою насиченою заправкою.",
      price: 155,
      weight: "250 г",
      badge: "Хіт",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/sal-caesar.jpg",
      customizable: false
    },
    {
      id: "sal-vinegret",
      category: "salads",
      name: "Вінегрет",
      shortDesc: "Традиційний салат із запеченого буряка, картоплі, квасолі, солених огірків та пахучої соняшникової олії.",
      desc: "Справжній вітамінний вінегрет за автентичним рецептом. Свіжий, хрумкий і легкий.",
      price: 28,
      weight: "100 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/sal-vinegret.jpg",
      customizable: false
    },
    {
      id: "sal-crab",
      category: "salads",
      name: "Крабовий салат",
      shortDesc: "Соковиті крабові палички, солодка кукурудза, свіжий огірочок, яйце та ніжний соус.",
      desc: "Улюблений свіжий повсякденний салат з дитинства. Легка текстура і солодкуватий кукурудзяний післясмак.",
      price: 34,
      weight: "100 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/sal-crab.jpg",
      customizable: false
    },
    {
      id: "sal-shuba",
      category: "salads",
      name: "Оселедець під шубою",
      shortDesc: "Шари слабосоленого оселедця, цибульки, відвареної картоплі, моркви та солодкого буряка.",
      desc: "Святкова класика, приготована з любов'ю за перевіреною домашньою рецептурою.",
      price: 34,
      weight: "100 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/sal-shuba.jpg",
      customizable: false
    },
    {
      id: "sal-olivie",
      category: "salads",
      name: "Олів'є",
      shortDesc: "Ніжне відварене м'ясо, картопля, зелений горошок, мариновані огірочки та домашня заправка.",
      desc: "Знайомий кожному ситний салат з ідеально рівною нарізкою та гармонійним смаком.",
      price: 34,
      weight: "100 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/sal-olivie.jpg",
      customizable: false
    },
    {
      id: "sal-chicken-pineapple",
      category: "salads",
      name: "Курка з ананасом",
      shortDesc: "Шматочки ніжного курячого філе, соковиті шматочки стиглого ананаса, сир та соус.",
      desc: "Пікантний тропічний салат з гармонійним поєднанням солодкості ананаса та соковитості птиці.",
      price: 34,
      weight: "100 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "/images/dishes/sal-chicken-pineapple.jpg",
      customizable: false
    },

    // --- КАВА ТА НАПОЇ ---
    {
      id: "cof-espresso",
      category: "coffee",
      name: "Еспресо",
      shortDesc: "Класичний насичений шот міцної кави зі стійкою піною crema.",
      desc: "Зерна свіжого обсмаження 100% арабіка з шоколадно-горіховими нотками.",
      price: 36,
      weight: "30 мл",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-espresso.jpg",
      customizable: false
    },
    {
      id: "cof-americano",
      category: "coffee",
      name: "Американо",
      shortDesc: "Ароматний еспресо з гарячою очищеною водою для м'якого кавового смаку.",
      desc: "Ідеальний напій для тих, хто полюбляє довгий кавовий ритуал без зайвої гіркоти.",
      price: 36,
      weight: "150 мл",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-americano.jpg",
      customizable: false
    },
    {
      id: "cof-americano-milk",
      category: "coffee",
      name: "Американо з молоком",
      shortDesc: "Класичний американо зі свіжим ніжним пастеризованим молоком.",
      desc: "Збалансований м'який кавовий смак з легкими вершковими нотками.",
      price: 48,
      weight: "180 мл",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-americano-milk.jpg",
      customizable: false
    },
    {
      id: "cof-cappuccino",
      category: "coffee",
      name: "Капучино",
      shortDesc: "Еспресо зі збитим гарячим молоком та щільною глянцевою пінкою.",
      desc: "Класичний баланс: третина міцного еспресо, третина молока та третина оксамитової пінки.",
      price: 48,
      weight: "200 мл",
      badge: "Популярне",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-cappuccino.jpg",
      customizable: false
    },
    {
      id: "cof-latte",
      category: "coffee",
      name: "Лате",
      shortDesc: "Найніжніший кавовий напій з переважанням теплого збитого молока.",
      desc: "Великий об'єм лагідного молока з додаванням ароматного шоту еспресо.",
      price: 48,
      weight: "250 мл",
      badge: "Хіт",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-latte.jpg",
      customizable: false
    },
    {
      id: "cof-flat-white",
      category: "coffee",
      name: "Флет-вайт",
      shortDesc: "Подвійний шот еспресо та тонкий шар шовковистого молока для яскравого кавового заряду.",
      desc: "Для тих, хто цінує глибокий смак кави у поєднанні з ніжністю молочної текстури.",
      price: 65,
      weight: "200 мл",
      badge: "Подвійний",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-flat-white.jpg",
      customizable: false
    },
    {
      id: "cof-raf",
      category: "coffee",
      name: "Раф кава",
      shortDesc: "Еспресо, вершки та натуральний ванільний цукор, збиті разом до густої кремової піни.",
      desc: "Десертна зігріваюча кава з багатим карамельно-ванільним смаком та шовковистою текстурою.",
      price: 65,
      weight: "250 мл",
      badge: "Десертна",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-raf.jpg",
      customizable: false
    },
    {
      id: "cof-cacao",
      category: "coffee",
      name: "Какао",
      shortDesc: "Густе шоколадне какао на гарячому молоці зі смаком затишку.",
      desc: "Улюблений напій для гарного настрою, приготований з якісних какао-бобів та молока.",
      price: 43,
      weight: "250 мл",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-cacao.jpg",
      customizable: false
    },
    {
      id: "cof-ice-latte",
      category: "coffee",
      name: "Айс лате",
      shortDesc: "Охолоджений шот еспресо, холодне свіже молоко та прозорі кубики льоду.",
      desc: "Чудовий спосіб освіжитися та підбадьоритися в спекотний літній день.",
      price: 65,
      weight: "350 мл",
      badge: "Освіжає",
      badgeColor: "blue",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-ice-latte.jpg",
      customizable: false
    },
    {
      id: "cof-bumble",
      category: "coffee",
      name: "Бамбл",
      shortDesc: "Контрастний освіжаючий мікс свіжого еспресо, натурального апельсинового соку та льоду.",
      desc: "Справжній хіт літнього меню! Цитрусова яскравість і бадьорість кавових зерен у кожному ковтку.",
      price: 75,
      weight: "350 мл",
      badge: "Хіт літа",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/coffee-bumble.jpg",
      customizable: false
    },
    {
      id: "cof-tea-isla",
      category: "coffee",
      name: "Чай Isla",
      shortDesc: "Колекційний листовий чай Isla — чорний, класичний зелений або фруктово-трав'яний.",
      desc: "Високоякісний чай з тонким ароматом та глибоким чистим післясмаком.",
      price: 29,
      weight: "400 мл",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-tea-isla.jpg",
      customizable: false
    },
    {
      id: "cof-tea-maribel",
      category: "coffee",
      name: "Чай Maribel",
      shortDesc: "Преміальний натуральний чай з соковитими ягодами та цілющими травами.",
      desc: "Ароматний чай вищого ґатунку для неквапливого та теплого чаювання.",
      price: 35,
      weight: "400 мл",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-tea-maribel.jpg",
      customizable: false
    },
    {
      id: "cof-latte-lactose-free",
      category: "coffee",
      name: "Лате безлактозне",
      shortDesc: "Улюблене лате, зварене на спеціальному безлактозному молоці вищої якості.",
      desc: "Комфортна кава без лактози зі збереженням ніжних вершкових смакових якостей.",
      price: 65,
      weight: "250 мл",
      badge: "Без лактози",
      badgeColor: "emerald",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-latte-lactose-free.jpg",
      customizable: false
    },
    {
      id: "cof-cappuccino-lactose-free",
      category: "coffee",
      name: "Капучино безлактозне",
      shortDesc: "Ніжний ароматний капучино з густою стійкою пінкою на безлактозному молоці.",
      desc: "Ідеальний вибір для людей з непереносимістю лактози. Насолоджуйтесь улюбленою кавою щодня.",
      price: 65,
      weight: "200 мл",
      badge: "Без лактози",
      badgeColor: "emerald",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-cappuccino-lactose-free.jpg",
      customizable: false
    },
    {
      id: "cof-ice-latte-lactose-free",
      category: "coffee",
      name: "Айс лате безлактозне",
      shortDesc: "Охолоджений кавовий коктейль на натуральному безлактозному молоці з льодом.",
      desc: "Літня свіжість і кавова енергія без лактози.",
      price: 75,
      weight: "350 мл",
      badge: "Без лактози",
      badgeColor: "emerald",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/cof-ice-latte-lactose-free.jpg",
      customizable: false
    },

    // --- ДЕСЕРТИ ---
    {
      id: "des-gorishki-iryska",
      category: "desserts",
      name: "Горішки з ірискою",
      shortDesc: "Хрустке розсипчасте пісочне печиво з начинкою з вареної карамельної іриски.",
      desc: "Той самий легендарний смак дитинства. Ручна робота, тонке пісочне тісто та багато начинки.",
      price: 25,
      weight: "1 шт",
      badge: "Ностальгія",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/dessert-gorishki.jpg",
      customizable: false
    },
    {
      id: "des-gorishki-assorti",
      category: "desserts",
      name: "Горішки в асортименті",
      shortDesc: "Асорті фірмових горішків з різноманітними кремовими, шоколадними та горіховими начинками.",
      desc: "Спробуйте нові смаки улюблених домашніх горішків.",
      price: 30,
      weight: "1 шт",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/des-gorishki-assorti.jpg",
      customizable: false
    },
    {
      id: "des-gorishok-ferrero",
      category: "desserts",
      name: "Горішок Ferrero",
      shortDesc: "Горішок у шоколадному глазуруванні з ніжним кремом Nutella та цільним фундуком всередині.",
      desc: "Преміальний десертний смак для поціновувачів вишуканого молочного шоколаду та лісових горіхів.",
      price: 35,
      weight: "1 шт",
      badge: "Шоколад",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/des-gorishok-ferrero.jpg",
      customizable: false
    },
    {
      id: "des-gorishok-choco-iryska",
      category: "desserts",
      name: "Горішок з ірискою в шоколаді",
      shortDesc: "Традиційний горішок з ірискою, вкритий товстим шаром темного бельгійського шоколаду.",
      desc: "Неперевершене поєднання тягучої вареної карамелі та хрусткої шоколадної глазурі.",
      price: 40,
      weight: "1 шт",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/des-gorishok-choco-iryska.jpg",
      customizable: false
    },
    {
      id: "des-trubochka",
      category: "desserts",
      name: "Трубочка в асортименті",
      shortDesc: "Хрустка тоненька вафельна трубочка, наповнена солодкою начинкою.",
      desc: "Золотисті хрусткі вафлі з ніжним кремом або вареним згущеним молоком.",
      price: 85,
      weight: "1 шт",
      badge: "Хіт",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/des-trubochka.jpg",
      customizable: false
    },
    {
      id: "des-carrot-cake",
      category: "desserts",
      name: "Торт морквяний",
      shortDesc: "Вологий пряний бісквіт з морквою, корицею, волоськими горіхами та ніжним крем-чизом.",
      desc: "Справжній американський морквяний торт. Неймовірно м'який, насичений прянощами та вершковим кремом.",
      price: 65,
      weight: "100 г",
      badge: "Ніжний",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/des-carrot-cake.jpg",
      customizable: false
    },
    {
      id: "des-madlen",
      category: "desserts",
      name: "Печиво мадлен",
      shortDesc: "Французьке ніжне бісквітне печиво у формі мушлі з тонким цитрусовим ароматом.",
      desc: "Повітряний бісквіт, що тане в роті. Бездоганне доповнення до чашки кави або чаю.",
      price: 30,
      weight: "1 шт",
      badge: "Франція",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "/images/dishes/des-madlen.jpg",
      customizable: false
    }
  ],

  info: {
    name: "ЧЕБУROOM",
    slogan: "Гастрономічний street food",
    city: "Запоріжжя",
    address: "вулиця Олександрівська, 75, Запоріжжя",
    phone: "+380 (95) 199 15 99",
    phoneRaw: "+380951991599",
    hours: "Щодня з 9:00 до 20:00",
    instagram: "https://www.instagram.com/cheburoom.zp/",
    instagramUsername: "cheburoom.zp",
    estimatedCookTime: "7-12 хв"
  }
};

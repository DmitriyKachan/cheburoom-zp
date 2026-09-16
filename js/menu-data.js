/**
 * ЧЕБУROOM (@cheburoom.zp) - Меню та база даних страв
 */
const MENU_DATA = {
  categories: [
    { id: "all", name: "Всі страви", icon: "layout-grid" },
    { id: "chebureks", name: "Фірмові чебуреки", icon: "flame" },
    { id: "yantyks", name: "Янтики (без олії)", icon: "sparkles" },
    { id: "combos", name: "Сети & Комбо", icon: "package" },
    { id: "snacks", name: "Снеки & Фрі", icon: "utensils" },
    { id: "sauces", name: "Авторські соуси", icon: "droplet" },
    { id: "drinks", name: "Напої", icon: "coffee" }
  ],

  items: [
    // ЧЕБУРЕКИ
    {
      id: "cheb-beef",
      category: "chebureks",
      name: "Чебурек «Класичний з яловичиною»",
      shortDesc: "Рубана соковита яловичина, цибуля та ароматні спеції у хрусткому пухирчастому тісті.",
      desc: "Наш головний бестселер! Тонке хрустке тісто з фірмовими пухирцями, соковитий фарш із добірної української яловичини, запашна кінза та багато гарячого м'ясного бульйону всередині.",
      price: 95,
      weight: "180 г",
      badge: "Хіт продажу",
      badgeColor: "red",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (хрустка скоринка)", priceDelta: 0, default: true },
          { name: "Янтик (на сухій пательні + вершкове масло)", priceDelta: 0 }
        ],
        extras: [
          { id: "extra-cheese", name: "Подвійний сир сулугуні", price: 30 },
          { id: "extra-jalapeno", name: "Гострий перець халапеньйо", price: 20 },
          { id: "extra-greens", name: "Свіжа зелень (кінза + кріп)", price: 15 }
        ]
      }
    },
    {
      id: "cheb-pork-beef",
      category: "chebureks",
      name: "Чебурек «Домашній Свинина-Яловичина»",
      shortDesc: "Традиційне поєднання ніжної свинини та яловичини з цибулькою та перцем.",
      desc: "Максимально соковитий та ситний чебурек за класичним рецептом. Насичений бульйон, тонке золотисте тісто та пряний аромат.",
      price: 90,
      weight: "180 г",
      badge: "Популярне",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр (хрустка скоринка)", priceDelta: 0, default: true },
          { name: "Янтик (на сухій пательні)", priceDelta: 0 }
        ],
        extras: [
          { id: "extra-cheese", name: "Подвійний сир сулугуні", price: 30 },
          { id: "extra-jalapeno", name: "Халапеньйо 🌶️", price: 20 }
        ]
      }
    },
    {
      id: "cheb-four-cheese",
      category: "chebureks",
      name: "Чебурек «Чотири Сири»",
      shortDesc: "Сулугуні, моцарела, гауда та ніжний дорблю з нотками трав.",
      desc: "Для справжніх поціновувачів сиру: неймовірно тягучий мікс із чотирьох якісних сирів у гарячому хрусткому конвертику.",
      price: 110,
      weight: "170 г",
      badge: "Сирний кайф",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр", priceDelta: 0, default: true },
          { name: "Янтик (на сухій пательні)", priceDelta: 0 }
        ],
        extras: [
          { id: "extra-tomatoes", name: "В'ялені томати", price: 25 },
          { id: "extra-truffle", name: "Крапля трюфельної олії", price: 30 }
        ]
      }
    },
    {
      id: "cheb-suluguni-tomato",
      category: "chebureks",
      name: "Чебурек «Сулугуні та Томати»",
      shortDesc: "Тягучий сир сулугуні, соковиті солодкі томати та свіжий базилік.",
      desc: "Легкий та освіжаючий смак. Ніжний сир сулугуні тане разом із томатами, створюючи гармонійний соковитий тандем.",
      price: 95,
      weight: "175 г",
      badge: "Вегетаріанське",
      badgeColor: "emerald",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр", priceDelta: 0, default: true },
          { name: "Янтик (на сухій пательні)", priceDelta: 0 }
        ],
        extras: [
          { id: "extra-cheese", name: "Додатковий сир", price: 30 }
        ]
      }
    },
    {
      id: "cheb-chicken-mushrooms",
      category: "chebureks",
      name: "Чебурек «Курка з Печерицями»",
      shortDesc: "Ніжне філе курки, обсмажені гриби у вершковому соусі та сир.",
      desc: "М'який вершково-грибний смак. Соковите філе курки в поєднанні з підсмаженими печерицями та розтопленим сиром.",
      price: 95,
      weight: "185 г",
      badge: "Новинка",
      badgeColor: "purple",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр", priceDelta: 0, default: true },
          { name: "Янтик (на сухій пательні)", priceDelta: 0 }
        ],
        extras: [
          { id: "extra-cheese", name: "Подвійний сир", price: 30 }
        ]
      }
    },
    {
      id: "cheb-spicy-jalapeno",
      category: "chebureks",
      name: "Чебурек «Вогонь з Халапеньйо»",
      shortDesc: "Добірна яловичина, гострий перець халапеньйо та соус чілі.",
      desc: "Для любителів гострого! Пікантна соковита яловичина з шматочками халапеньйо, що запалює смакові рецептори.",
      price: 105,
      weight: "185 г",
      badge: "Гостре 🌶️",
      badgeColor: "red",
      isHit: false,
      isSpicy: true,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        crust: [
          { name: "Класичний фритюр", priceDelta: 0, default: true },
          { name: "Янтик (на сухій пательні)", priceDelta: 0 }
        ],
        extras: [
          { id: "extra-cheese", name: "Пом'якшити сиром сулугуні", price: 30 }
        ]
      }
    },
    {
      id: "cheb-sweet-cherry",
      category: "chebureks",
      name: "Солодкий Чебурек «Вишня & Шоколад»",
      shortDesc: "Стигла вишня з легкою кислинкою та гарячий бельгійський шоколад.",
      desc: "Незвичайний десертний чебурек! Гаряча ягідна начинка тане разом з темним шоколадом у тонкому хрусткому тісті, посипаному цукровою пудрою.",
      price: 85,
      weight: "160 г",
      badge: "Десерт",
      badgeColor: "pink",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },

    // ЯНТИКИ (БЕЗ ОЛІЇ)
    {
      id: "yant-beef",
      category: "yantyks",
      name: "Янтик Кримський «Яловичина & Кінза»",
      shortDesc: "Випікається на сухій пательні без краплі олії, змащується вершковим маслом.",
      desc: "Традиційна кримськотатарська страва. Без фритюру! Ніжне сухе тісто з легким підпалом, змащене справжнім фермерським маслом, усередині — вибух соку та м'яса.",
      price: 95,
      weight: "175 г",
      badge: "Без фритюру",
      badgeColor: "emerald",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        extras: [
          { id: "extra-cheese", name: "Додати сулугуні", price: 30 },
          { id: "extra-greens", name: "Більше кінзи", price: 15 }
        ]
      }
    },
    {
      id: "yant-brynza-greens",
      category: "yantyks",
      name: "Янтик «Карпатська Бринза & Зелень»",
      shortDesc: "Солонувата ніжна бринза, шпинат, зелена цибулька та кріп.",
      desc: "Неймовірно запашний та легкий янтик. Тісто без зайвого жиру, багато зелені та якісна бринза. Ідеально під фірмовий айран.",
      price: 90,
      weight: "170 г",
      badge: "Легкий вибір",
      badgeColor: "emerald",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=700&q=80",
      customizable: true,
      options: {
        extras: [
          { id: "extra-butter", name: "Подвійне вершкове масло", price: 15 }
        ]
      }
    },

    // СЕТИ & КОМБО
    {
      id: "combo-friends",
      category: "combos",
      name: "Сет «ЧЕБУ-ДРУЗІ» (4 шт + Фрі + 2 Соуси)",
      shortDesc: "4 хітові чебуреки на вибір, велика порція картоплі фрі та 2 авторські соуси.",
      desc: "Ідеальний вибір для компанії або сімейної вечері! У наборі: 2 чебуреки з яловичиною, 1 чотири сири, 1 зі свининою, велика картопля фрі з паприкою, фірмовий часниковий соус та сирний соус.",
      price: 399,
      weight: "950 г",
      badge: "Економія 70 ₴",
      badgeColor: "red",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "combo-lunch",
      category: "combos",
      name: "Комбо «Швидкий Ланч»",
      shortDesc: "Чебурек з м'ясом на вибір + Картопля фрі + Напій (Морс або Айран).",
      desc: "Повноцінний гарячий обід у швидкому форматі. Свіжий чебурек з пилу з жару, хрустка картопелька та освіжаючий фірмовий напій.",
      price: 185,
      weight: "520 г",
      badge: "Вигідний ланч",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },

    // СНЕКИ & ФРІ
    {
      id: "snack-fries",
      category: "snacks",
      name: "Картопля фрі «Gold Crispy»",
      shortDesc: "Хрумка зовні, ніжна всередині картопля з морською сіллю та паприкою.",
      desc: "Золотисті картопляні скибочки зі спеціального сорту картоплі, обсмажені до ідеального хрусту. Подаються гарячими.",
      price: 65,
      weight: "150 г",
      badge: "Хрустке",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "snack-cheese-balls",
      category: "snacks",
      name: "Сирні кульки у хрусткій паніровці",
      shortDesc: "6 кульок із ніжного тягучого сиру моцарела з пряними травами.",
      desc: "Хрустка золотава паніровка та гаряче рідке сирне серце. Найкраще смакують з ягідним соусом або тартаром.",
      price: 95,
      weight: "160 г (6 шт)",
      badge: "Тягучий сир",
      badgeColor: "amber",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da410?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "snack-nuggets",
      category: "snacks",
      name: "Курячі нагетси з філе",
      shortDesc: "Шматочки 100% курячого філе в паніровці з хрусткими сухарями панко.",
      desc: "Справжнє соковите біле м'ясо без консервантів та домішок у супер-хрусткому клярі.",
      price: 89,
      weight: "150 г (6 шт)",
      badge: "100% м'ясо",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: false,
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },

    // СОУСИ
    {
      id: "sauce-garlic",
      category: "sauces",
      name: "Фірмовий Часниковий з зеленню",
      shortDesc: "Ніжний вершковий соус з молодим часником, кропом та чорним перцем.",
      desc: "Ідеальний партнер до кожного чебурека. Баланс вершковості та пікантності.",
      price: 25,
      weight: "40 г",
      badge: "Топ вибір",
      badgeColor: "emerald",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "sauce-spicy-chili",
      category: "sauces",
      name: "Соус «Гострий Чілі & Томат»",
      shortDesc: "Справжній вогонь з копченої паприки, червоного перцю та томатів.",
      desc: "Для тих, хто любить гостріше! Чудово підкреслює м'ясні страви.",
      price: 25,
      weight: "40 г",
      badge: "Гострий 🌶️",
      badgeColor: "red",
      isHit: false,
      isSpicy: true,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "sauce-cheese",
      category: "sauces",
      name: "Ніжний Сирний Чеддер",
      shortDesc: "Густий соус з насиченим смаком витриманого сиру чеддер.",
      desc: "Особливо гарний у поєднанні з гарячою картоплею фрі та сирними кульками.",
      price: 25,
      weight: "40 г",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },

    // НАПОЇ
    {
      id: "drink-ayran",
      category: "drinks",
      name: "Айран Домашній з м'ятою та огірком",
      shortDesc: "Освіжаючий кисломолочний напій власного виробництва з крихтою льоду.",
      desc: "Ідеальний супутник для гарячих чебуреків та янтиків. Покращує травлення, дарує свіжість та бадьорість.",
      price: 45,
      weight: "330 мл",
      badge: "Власне виробництво",
      badgeColor: "emerald",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "drink-mors",
      category: "drinks",
      name: "Морс із лісових ягід",
      shortDesc: "Натуральний ягідний морс із журавлини, смородини та малини.",
      desc: "Варимо щоранку з натуральних ягід. Освіжаючий, кисло-солодкий смак.",
      price: 45,
      weight: "400 мл",
      badge: "100% натурально",
      badgeColor: "red",
      isHit: true,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "drink-lemonade",
      category: "drinks",
      name: "Лимонад «Цитрус & Імбир»",
      shortDesc: "Освіжаючий крафтовий лимонад із соком лайма, лимона та свіжим імбиром.",
      desc: "Газований, терпкий і неймовірно освіжаючий у будь-яку погоду.",
      price: 50,
      weight: "400 мл",
      badge: "Крафт",
      badgeColor: "amber",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1523371067107-85ecb00d72ef?auto=format&fit=crop&w=700&q=80",
      customizable: false
    },
    {
      id: "drink-cola",
      category: "drinks",
      name: "Coca-Cola (скло)",
      shortDesc: "Класична крижана Coca-Cola у скляній пляшці.",
      desc: "Улюблений класичний газований напій.",
      price: 40,
      weight: "330 мл",
      badge: "",
      badgeColor: "",
      isHit: false,
      isSpicy: false,
      isVegetarian: true,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=80",
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
    minOrderDelivery: 200,
    freeDeliveryThreshold: 450,
    deliveryCost: 50,
    estimatedCookTime: "7-12 хв"
  }
};

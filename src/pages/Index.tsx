import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/cd711bd3-47d4-454e-9ef0-51697f57ca6f/files/8e200190-853d-41e9-96d4-8edede8efd2a.jpg";

const NAV_LINKS = [
  { id: "about", label: "О здании" },
  { id: "apartments", label: "Квартиры" },
  { id: "infrastructure", label: "Инфраструктура" },
  { id: "gallery", label: "Галерея" },
  { id: "news", label: "Новости" },
  { id: "contacts", label: "Контакты" },
];

const PLAN_IMAGE = "https://cdn.poehali.dev/projects/cd711bd3-47d4-454e-9ef0-51697f57ca6f/bucket/99c301db-bffe-497f-b6ac-cf8e09b72015.PNG";

const PLAN_TYPES = [
  {
    id: "type1",
    name: "Тип 1",
    label: "1-комнатная · с гардеробом",
    totalArea: 41.05,
    rooms: [
      { name: "Кухня-столовая", area: 20.45 },
      { name: "Жилая комната", area: 10.5 },
      { name: "Санузел", area: 3.65 },
      { name: "Гардероб", area: 1.35 },
      { name: "Коридор", area: 5.6 },
    ],
    features: ["Гардеробная комната", "Просторная кухня-столовая", "Раздельный санузел"],
  },
  {
    id: "type2",
    name: "Тип 2",
    label: "1-комнатная · с балконом",
    totalArea: 46.25,
    rooms: [
      { name: "Кухня-столовая", area: 20.0 },
      { name: "Жилая комната", area: 10.5 },
      { name: "Санузел", area: 3.65 },
      { name: "Коридор", area: 5.6 },
      { name: "Балкон", area: 6.0 },
    ],
    features: ["Балкон 6 м² с панорамным видом", "Просторная кухня-столовая", "Раздельный санузел"],
  },
];

const APARTMENTS = [
  { id: 1, type: "1-комнатная", planType: "Тип 1", rooms: 1, area: 41.05, floor: 3, price: 6200000, status: "available", view: "Двор" },
  { id: 2, type: "1-комнатная", planType: "Тип 2", rooms: 1, area: 46.25, floor: 5, price: 7100000, status: "available", view: "Парк" },
  { id: 3, type: "1-комнатная", planType: "Тип 1", rooms: 1, area: 41.05, floor: 8, price: 6500000, status: "sold", view: "Город" },
  { id: 4, type: "1-комнатная", planType: "Тип 2", rooms: 1, area: 46.25, floor: 10, price: 7400000, status: "available", view: "Город" },
  { id: 5, type: "1-комнатная", planType: "Тип 1", rooms: 1, area: 41.05, floor: 13, price: 6800000, status: "available", view: "Панорама" },
  { id: 6, type: "1-комнатная", planType: "Тип 2", rooms: 1, area: 46.25, floor: 15, price: 7800000, status: "reserved", view: "Панорама" },
  { id: 7, type: "1-комнатная", planType: "Тип 1", rooms: 1, area: 41.05, floor: 18, price: 7100000, status: "available", view: "Панорама" },
  { id: 8, type: "1-комнатная", planType: "Тип 2", rooms: 1, area: 46.25, floor: 20, price: 8200000, status: "available", view: "360°" },
];

const INFRA = [
  { icon: "Car", title: "Паркинг", desc: "Подземный паркинг на 220 машино-мест с видеонаблюдением" },
  { icon: "Dumbbell", title: "Фитнес-зал", desc: "Оснащённый тренажёрный зал на 1-м этаже для жителей" },
  { icon: "TreePine", title: "Парковая зона", desc: "Закрытый благоустроенный двор с зонами отдыха" },
  { icon: "ShieldCheck", title: "Охрана 24/7", desc: "Консьерж-сервис и круглосуточная охрана периметра" },
  { icon: "Wifi", title: "Умный дом", desc: "Управление освещением, климатом и доступом с телефона" },
  { icon: "Baby", title: "Детская площадка", desc: "Безопасная игровая зона с современным оборудованием" },
];

const NEWS = [
  { date: "15 мая 2026", tag: "Строительство", title: "Завершены работы по остеклению верхних этажей", text: "Монтажники установили последние панели панорамного остекления на 20–22 этажах." },
  { date: "02 мая 2026", tag: "Продажи", title: "Открыты продажи квартир в секции B", text: "Секция B предлагает квартиры с видом на парк и реку. Специальные условия для первых покупателей." },
  { date: "18 апреля 2026", tag: "Инфраструктура", title: "Начато озеленение придомовой территории", text: "Ландшафтные дизайнеры приступили к высадке деревьев и кустарников во внутреннем дворе." },
];

const formatPrice = (p: number) =>
  p >= 1000000
    ? `${(p / 1000000).toFixed(1)} млн ₽`
    : `${(p / 1000).toFixed(0)} тыс ₽`;

const statusLabel: Record<string, { label: string; color: string }> = {
  available: { label: "Свободна", color: "text-emerald-400 bg-emerald-400/10" },
  reserved: { label: "Бронь", color: "text-amber-400 bg-amber-400/10" },
  sold: { label: "Продана", color: "text-red-400 bg-red-400/10" },
};

export default function Index() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filterType, setFilterType] = useState("Все");
  const [filterPrice, setFilterPrice] = useState([0, 8500000]);
  const [filterArea, setFilterArea] = useState([0, 50]);
  const [selectedApt, setSelectedApt] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map((l) => document.getElementById(l.id));
      const current = sections.findLast((s) => s && s.getBoundingClientRect().top <= 120);
      if (current) setActiveSection(current.id);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const types = ["Все", "Тип 1", "Тип 2"];

  const filtered = APARTMENTS.filter((a) => {
    const typeOk = filterType === "Все" || a.planType === filterType;
    const priceOk = a.price >= filterPrice[0] && a.price <= filterPrice[1];
    const areaOk = a.area >= filterArea[0] && a.area <= filterArea[1];
    return typeOk && priceOk && areaOk;
  });

  return (
    <div className="bg-obsidian text-white font-body min-h-screen overflow-x-hidden">
      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-obsidian/95 backdrop-blur-md border-b border-gold/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-display text-2xl font-light tracking-[0.15em] text-gold">
            АРХИ<span className="font-semibold">ТЕКТ</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                  activeSection === link.id ? "text-gold" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("contacts")}
            className="hidden lg:block bg-gold text-obsidian text-sm font-semibold px-6 py-2.5 tracking-wider uppercase hover:bg-gold-light transition-colors duration-300"
          >
            Связаться
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white">
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-obsidian-light border-t border-gold/10 px-6 py-6 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-white/70 hover:text-gold uppercase tracking-widest text-sm transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative h-screen min-h-[680px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            animation: "heroZoom 20s ease-in-out infinite alternate",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 to-transparent" />

        <div className="absolute top-1/3 right-12 hidden xl:block">
          <div className="w-px h-48 bg-gradient-to-b from-transparent via-gold/40 to-transparent animate-float" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <div className="max-w-3xl" style={{ animation: "fadeUp 1s ease-out forwards" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold/80 text-xs tracking-[0.3em] uppercase">Жилой комплекс · Москва</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-light leading-none tracking-tight mb-6">
              Живите
              <br />
              <em className="not-italic text-gold">выше</em> облаков
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light max-w-xl leading-relaxed mb-10">
              22 этажа современной архитектуры. Панорамные виды. Продуманная инфраструктура для жизни нового уровня.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("apartments")}
                className="bg-gold text-obsidian font-semibold px-10 py-4 text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300 hover:scale-105"
              >
                Смотреть квартиры
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="border border-white/30 text-white px-10 py-4 text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-all duration-300"
              >
                О проекте
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {[
              { num: "22", label: "Этажа" },
              { num: "186", label: "Квартир" },
              { num: "2026", label: "Год сдачи" },
              { num: "5 мин", label: "До метро" },
            ].map((s) => (
              <div key={s.label} className="bg-obsidian/80 backdrop-blur-sm px-6 py-5 text-center">
                <div className="font-display text-3xl text-gold font-light">{s.num}</div>
                <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold/70 text-xs tracking-[0.3em] uppercase">О здании</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-tight mb-8">
              Архитектура,<br />
              <em className="not-italic text-gold">вдохновлённая</em><br />
              совершенством
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              АРХИТЕКТ — это жилой комплекс премиум-класса, спроектированный с вниманием к каждой детали. Высококачественные материалы, продуманная планировка и современные технологии создают пространство для настоящей жизни.
            </p>
            <p className="text-white/50 leading-relaxed mb-10">
              Монолитный железобетонный каркас, вентилируемый фасад, тройное остекление — здание построено на десятилетия вперёд. Закрытая благоустроенная территория создаёт ощущение уединённости в центре мегаполиса.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Высота", value: "78 м" },
                { label: "Площадь территории", value: "1.4 га" },
                { label: "Квартир", value: "186" },
                { label: "Потолки", value: "от 3.1 м" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-gold/30 pl-4">
                  <div className="font-display text-2xl text-gold">{s.value}</div>
                  <div className="text-white/40 text-xs tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={HERO_IMAGE} alt="Здание" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gold text-obsidian p-6 w-40">
              <div className="font-display text-4xl font-semibold">III</div>
              <div className="text-xs tracking-wider mt-1 font-body font-semibold uppercase">Класс</div>
            </div>
          </div>
        </div>
      </section>

      {/* APARTMENTS */}
      <section id="apartments" className="py-28 bg-obsidian-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold/70 text-xs tracking-[0.3em] uppercase">Каталог</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <h2 className="font-display text-5xl font-light">Квартиры</h2>
            <div className="text-white/40 text-sm">
              Найдено: <span className="text-gold font-semibold">{filtered.length}</span> из {APARTMENTS.length}
            </div>
          </div>

          {/* Plan types visual */}
          <div className="mb-12">
            <div className="text-white/40 text-xs tracking-widest uppercase mb-6">Типы планировок</div>
            <div className="grid md:grid-cols-2 gap-6">
              {PLAN_TYPES.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setFilterType(plan.name)}
                  className={`border cursor-pointer transition-all duration-300 overflow-hidden ${
                    filterType === plan.name ? "border-gold" : "border-white/10 hover:border-gold/30"
                  }`}
                >
                  <div className="relative bg-white/5 overflow-hidden">
                    <img
                      src={PLAN_IMAGE}
                      alt={plan.name}
                      className="w-full h-56 object-cover"
                      style={{
                        objectPosition: plan.id === "type1" ? "0% center" : "50% center",
                        objectFit: "cover",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="font-display text-2xl text-white">{plan.name}</div>
                      <div className="text-gold/80 text-xs tracking-wider mt-0.5">{plan.label}</div>
                    </div>
                    {filterType === plan.name && (
                      <div className="absolute top-3 right-3 bg-gold text-obsidian text-xs font-semibold px-2.5 py-1">
                        Выбран
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                      {plan.rooms.map((r) => (
                        <div key={r.name} className="flex justify-between items-center text-sm border-b border-white/5 pb-1.5">
                          <span className="text-white/50">{r.name}</span>
                          <span className="text-white font-medium">{r.area} м²</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center text-sm col-span-2 pt-1">
                        <span className="text-white/60 font-medium">Итого</span>
                        <span className="text-gold font-display text-lg">{plan.totalArea} м²</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((f) => (
                        <span key={f} className="text-xs text-white/40 border border-white/10 px-2.5 py-1">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-obsidian border border-white/5 p-6 mb-10 space-y-6">
            <div>
              <div className="text-white/40 text-xs tracking-widest uppercase mb-3">Планировка</div>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 text-sm tracking-wide transition-all duration-200 ${
                      filterType === t
                        ? "bg-gold text-obsidian font-semibold"
                        : "border border-white/10 text-white/50 hover:border-gold/40 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-white/40 text-xs tracking-widest uppercase mb-3">
                  Цена: до <span className="text-gold">{formatPrice(filterPrice[1])}</span>
                </div>
                <input
                  type="range"
                  min={6000000}
                  max={8500000}
                  step={100000}
                  value={filterPrice[1]}
                  onChange={(e) => setFilterPrice([0, +e.target.value])}
                  className="w-full accent-gold"
                />
              </div>

              <div>
                <div className="text-white/40 text-xs tracking-widest uppercase mb-3">
                  Площадь: до <span className="text-gold">{filterArea[1]} м²</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={50}
                  step={1}
                  value={filterArea[1]}
                  onChange={(e) => setFilterArea([0, +e.target.value])}
                  className="w-full accent-gold"
                />
              </div>
            </div>
          </div>

          {/* Apartment cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                onClick={() => setSelectedApt(selectedApt === apt.id ? null : apt.id)}
                className={`border cursor-pointer transition-all duration-300 ${
                  selectedApt === apt.id
                    ? "border-gold bg-obsidian-mid"
                    : "border-white/5 bg-obsidian hover:border-gold/30"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-display text-2xl font-light">{apt.planType}</div>
                      <div className="text-white/40 text-sm mt-0.5">{apt.area} м² · {apt.floor} этаж</div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${statusLabel[apt.status].color}`}>
                      {statusLabel[apt.status].label}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="font-display text-xl text-gold">{formatPrice(apt.price)}</div>
                    <div className="flex items-center gap-1.5 text-white/30 text-xs">
                      <Icon name="Eye" size={12} />
                      {apt.view}
                    </div>
                  </div>

                  {selectedApt === apt.id && (
                    <div className="mt-5 pt-5 border-t border-white/5 space-y-3">
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="text-white/40">Комнат</div>
                        <div>{apt.rooms === 0 ? "— (студия)" : apt.rooms}</div>
                        <div className="text-white/40">Этаж</div>
                        <div>{apt.floor} из 22</div>
                        <div className="text-white/40">Площадь</div>
                        <div>{apt.area} м²</div>
                        <div className="text-white/40">Вид</div>
                        <div>{apt.view}</div>
                      </div>
                      <button className="w-full mt-3 bg-gold text-obsidian text-sm font-semibold py-3 tracking-wider uppercase hover:bg-gold-light transition-colors">
                        Оставить заявку
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <Icon name="Search" size={40} className="mx-auto mb-4 opacity-30" />
              <div>По вашим фильтрам квартир не найдено</div>
            </div>
          )}
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section id="infrastructure" className="py-28 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="text-gold/70 text-xs tracking-[0.3em] uppercase">Инфраструктура</span>
        </div>
        <h2 className="font-display text-5xl font-light mb-16">Всё для жизни</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INFRA.map((item) => (
            <div
              key={item.title}
              className="group border border-white/5 p-8 hover:border-gold/30 transition-all duration-300 hover:bg-obsidian-light"
            >
              <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                <Icon name={item.icon} size={22} className="text-gold" />
              </div>
              <div className="font-display text-xl mb-3">{item.title}</div>
              <div className="text-white/40 text-sm leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-28 bg-obsidian-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold/70 text-xs tracking-[0.3em] uppercase">Галерея</span>
          </div>
          <h2 className="font-display text-5xl font-light">Фотографии</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 max-w-7xl mx-auto px-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <img
                src={HERO_IMAGE}
                alt={`Фото ${i + 1}`}
                className={`w-full object-cover hover:scale-105 transition-transform duration-700 ${
                  i === 0 ? "h-96" : "h-44"
                } ${i % 2 === 0 ? "grayscale" : ""}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="py-28 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="text-gold/70 text-xs tracking-[0.3em] uppercase">Новости</span>
        </div>
        <h2 className="font-display text-5xl font-light mb-16">Последние события</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {NEWS.map((n, i) => (
            <article
              key={n.title}
              className={`border border-white/5 p-8 hover:border-gold/20 transition-all duration-300 ${
                i === 0 ? "lg:border-gold/20 bg-obsidian-light" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-gold text-xs px-2.5 py-1 border border-gold/30 tracking-wider">
                  {n.tag}
                </span>
                <span className="text-white/30 text-xs">{n.date}</span>
              </div>
              <h3 className="font-display text-xl font-light mb-3 leading-snug">{n.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{n.text}</p>
              <button className="mt-6 flex items-center gap-2 text-gold text-xs tracking-wider uppercase hover:gap-3 transition-all duration-200">
                Читать далее <Icon name="ArrowRight" size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-28 bg-obsidian-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold" />
                <span className="text-gold/70 text-xs tracking-[0.3em] uppercase">Контакты</span>
              </div>
              <h2 className="font-display text-5xl font-light mb-8">Свяжитесь с нами</h2>
              <p className="text-white/50 mb-10 leading-relaxed">
                Наши специалисты готовы ответить на любые вопросы, организовать показ квартиры и помочь с оформлением.
              </p>

              <div className="space-y-6">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (495) 000-00-00" },
                  { icon: "Mail", label: "Email", value: "info@architekt.ru" },
                  { icon: "MapPin", label: "Адрес", value: "Москва, ул. Примерная, 1" },
                  { icon: "Clock", label: "Режим работы", value: "Ежедневно 9:00 – 21:00" },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} size={16} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-white/30 text-xs tracking-wider uppercase mb-0.5">{c.label}</div>
                      <div className="text-white">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-obsidian border border-white/5 p-8">
              <h3 className="font-display text-2xl font-light mb-6">Оставить заявку</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    className="w-full bg-obsidian-light border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Телефон</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-obsidian-light border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Интересует</label>
                  <select className="w-full bg-obsidian-light border border-white/10 px-4 py-3 text-white/70 focus:outline-none focus:border-gold/40 transition-colors">
                    <option value="">Выберите тип квартиры</option>
                    {types.slice(1).map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">Сообщение</label>
                  <textarea
                    rows={3}
                    placeholder="Ваши пожелания..."
                    className="w-full bg-obsidian-light border border-white/10 px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                  />
                </div>
                <button className="w-full bg-gold text-obsidian font-semibold py-4 text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-300">
                  Отправить заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-display text-xl font-light tracking-[0.15em] text-gold">
            АРХИ<span className="font-semibold">ТЕКТ</span>
          </div>
          <div className="text-white/20 text-xs tracking-wider">
            © 2026 ЖК АРХИТЕКТ. Все права защищены.
          </div>
          <div className="flex gap-6">
            {NAV_LINKS.slice(0, 4).map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-white/30 text-xs hover:text-gold transition-colors tracking-wider"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.0); }
          to { transform: scale(1.08); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type=range] {
          -webkit-appearance: none;
          height: 2px;
          background: rgba(255,255,255,0.1);
          outline: none;
          border-radius: 0;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #C9A84C;
          cursor: pointer;
          border-radius: 0;
        }
        select option {
          background: #12121A;
          color: white;
        }
      `}</style>
    </div>
  );
}
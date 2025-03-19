const menuConfig = [
  {
    title: "Dashboard",
    path: "/dashboard",
    subItems: [], // Pagina principală, fără submeniuri
  },
  {
    title: "Clienți",
    path: "/clients",
    subItems: [], // Gestionarea clienților (persoane fizice și juridice)
  },
  {
    title: "Furnizori",
    path: "/suppliers",
    subItems: [], // Gestionarea furnizorilor
  },
  {
    title: "Depozit",
    path: "/warehouse",
    subItems: [
      { title: "Stocuri", path: "/warehouse/stocks" },
      { title: "Comenzi în așteptare", path: "/warehouse/pending-orders" },
      { title: "Produse în tranzit", path: "/warehouse/in-transit" },
    ],
  },
  {
    title: "Catalog Produse",
    path: "/catalog",
    subItems: [], // Catalog detaliat de produse
  },
  //   {
  //     title: "Comenzi Online",
  //     path: "/online-orders",
  //     subItems: [], // Gestionarea comenzilor online
  //   },
  {
    title: "Documente",
    path: "/documents",
    subItems: [
      { title: "Receptie", path: "/documents/receptie" },
      { title: "Comandă", path: "/documents/comanda" },
      { title: "Livrare", path: "/documents/livrare" },
      { title: "Retururi", path: "/documents/retururi" },
    ],
  },
  {
    title: "Rapoarte",
    path: "/rapoarte",
    subItems: [
      { title: "Vânzări", path: "/rapoarte/vanzari" },
      { title: "Încasări", path: "/rapoarte/incasari" },
      { title: "Profit", path: "/rapoarte/profit" },
    ],
  },
  {
    title: "Notificări",
    path: "/notifications",
    subItems: [], // Notificări și remindere în timp real (WebSocket/Sochet.io)
  },
  {
    title: "Setări",
    path: "/settings",
    subItems: [], // Configurări generale și preferințe
  },
  {
    title: "Admin",
    path: "/admin",
    subItems: [],
  },
];

export default menuConfig;

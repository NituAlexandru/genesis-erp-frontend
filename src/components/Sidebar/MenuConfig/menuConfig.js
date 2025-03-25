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
    path: "/products",
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
      { title: "Receptie", path: "/documents/reception" },
      { title: "Comandă", path: "/documents/order" },
      { title: "Livrare", path: "/documents/delivery" },
      { title: "Retururi", path: "/documents/returns" },
    ],
  },
  {
    title: "Rapoarte",
    path: "/reports",
    subItems: [
      { title: "Vânzări", path: "/reports/sales" },
      { title: "Încasări", path: "/reports/collections" },
      { title: "Profit", path: "/reports/profit" },
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

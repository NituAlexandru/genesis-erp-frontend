const menuConfig = [
  // --- Secțiunea Admin ---
  {
    title: "Admin",
    subItems: [
      {
        title: "Statistici Generale",
        path: "/admin/dashboard",
        subItems: [],
      },
      {
        title: "Rapoarte",
        path: "/admin/reports",
        subItems: [
          { title: "Vânzări", path: "/admin/reports/sales" },
          { title: "Încasări", path: "/admin/reports/collections" },
          { title: "Profit", path: "/admin/reports/profit" },
          { title: "Cheltuieli", path: "/admin/reports/expenses" },
          { title: "Agenți Vânzare", path: "/admin/reports/sales-agents" },
          { title: "Produse", path: "/admin/reports/products" },
          { title: "Clienți", path: "/admin/reports/clients" },
          { title: "Magazin Online", path: "/admin/reports/online-store" },
        ],
      },
      {
        title: "Management Produse",
        path: "/admin/manage-products",
        subItems: [],
      },
      {
        title: "Management Utilizatori",
        path: "/admin/users",
        subItems: [],
      },
      {
        title: "Management Flota",
        path: "/admin/users",
        subItems: [],
      },
      {
        title: "Seteaza Marja Profit",
        path: "/admin/manage-markup",
        subItems: [],
      },
      {
        title: "Setări Generale",
        path: "/admin/settings",
        subItems: [],
      },
    ],
  },
  // -------------- restul sectiunilor
  {
    title: "Dashboard",
    path: "/dashboard",
    subItems: [],
  },
  {
    title: "Notificări",
    path: "/notifications",
    subItems: [],
  },
  {
    title: "Clienți",
    path: "/clients",
    subItems: [],
  },
  {
    title: "Furnizori",
    path: "/suppliers",
    subItems: [],
  },
  {
    title: "Catalog Produse",
    path: "/products",
    subItems: [],
  },
  {
    title: "Documente",
    subItems: [
      { title: "Receptie", path: "/documents/reception" },
      { title: "Comandă", path: "/documents/order" },
      { title: "Livrare", path: "/documents/delivery" },
      { title: "Retururi", path: "/documents/returns" },
    ],
  },
  {
    title: "Gestiune Stocuri",
    path: "/warehouse/stocks-overview",
    subItems: [],
  },

  {
    title: "Comenzi Online",
    path: "/online-orders",
    subItems: [],
  },
  {
    title: "Comenzi Preferențiale",
    path: "/Preferential-orders",
    subItems: [],
  },
];

export default menuConfig;

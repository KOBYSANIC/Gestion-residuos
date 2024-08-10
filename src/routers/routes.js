// icons
import {
  faBoxesStacked,
  faCartShopping,
  faMoneyBillTransfer,
  faSliders,
  faTags,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faRectangleList } from "@fortawesome/free-regular-svg-icons";

// constants
import { ADMINISTRADOR, CLIENTE, TRANSPORTISTA } from "../Utils/constants";

// pages
// private
import { ProductosList } from "../pages/private/Productos";
import { CategoriasList, MarcasList } from "../pages/private/CategoriasMarcas";
import { MonedasList, BancosList } from "../pages/private/GestionMonedas";
import { VentasList, TokensList } from "../pages/private/Ventas";
import { CodigosList } from "../pages/private/Codigos";
import { CarruselList, PreguntasList } from "../pages/private/Ajustes";
import { UsuarioList, SolicitudList } from "../pages/private/Usuarios";

// public
import LoginScreen from "../pages/public/LoginScreen";

export const routes = [
  // private routes
  {
    name: "Residuos",
    icon: faBoxesStacked,
    path: "/residuos",
    component: ProductosList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR, CLIENTE],
  },
  {
    name: "Recolecciones",
    icon: faTags,
    path: "/recolecciones",
    component: VentasList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR, TRANSPORTISTA],
  },
  {
    name: "Rutas",
    icon: faMoneyBillTransfer,
    path: "/conf_financiera",
    component: MonedasList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
  },
  {
    name: "Vehículos",
    icon: faCartShopping,
    path: "/ventas",
    component: VentasList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR, TRANSPORTISTA],
  },

  {
    name: "Reportes",
    icon: faRectangleList,
    path: "/control_codigos",
    component: CodigosList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
  },
  {
    name: "Ajustes",
    icon: faSliders,
    path: "/ajustes",
    component: CarruselList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
    subMenu: [
      {
        name: "Imagenes Carrusel",
        path: "/ajustes/carrusel",
        component: CarruselList,
      },
    ],
  },
  {
    name: "Usuarios",
    icon: faUsers,
    path: "/control_usuarios",
    component: UsuarioList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
  },
  // public routes
  {
    path: "/",
    component: LoginScreen,
    isPrivate: false,
    showSidebar: false,
    accessValidate: false,
  },
];

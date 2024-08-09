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
import { ADMINISTRADOR, VENDEDOR } from "../Utils/constants";

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
import { PlataformasList } from "../pages/private/CategoriasMarcas/Plataformas";
import { MetodosPago } from "../pages/private/GestionMonedas/MetodosPago";

export const routes = [
  // private routes
  {
    name: "Residuos",
    icon: faBoxesStacked,
    path: "/control_productos",
    component: ProductosList,
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
  },
  {
    name: "Recolecciones",
    icon: faTags,
    path: "/configuraciones",
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
    subMenu: [
      {
        name: "Categorias",
        path: "/configuraciones/categorias",
        component: CategoriasList,
      },
      {
        name: "Marcas",
        path: "/configuraciones/marcas",
        component: MarcasList,
      },
      {
        name: "Plataformas",
        path: "/configuraciones/plataformas",
        component: PlataformasList,
      },
    ],
  },
  {
    name: "Rutas",
    icon: faMoneyBillTransfer,
    path: "/conf_financiera",
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
    subMenu: [
      {
        name: "Conversión de Monedas",
        path: "/conf_financiera/conversion_monedas",
        component: MonedasList,
      },
      {
        name: "Bancos",
        path: "/conf_financiera/bancos",
        component: BancosList,
      },
      {
        name: "Métodos de Pago",
        path: "/conf_financiera/metodos_pago",
        component: MetodosPago,
      },
    ],
  },
  {
    name: "Vehículos",
    icon: faCartShopping,
    path: "/ventas",
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR, VENDEDOR],
    subMenu: [
      {
        name: "Productos",
        path: "/ventas/productos",
        component: VentasList,
      },
      {
        name: "Tokens",
        path: "/ventas/tokens",
        component: TokensList,
      },
    ],
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
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
    subMenu: [
      {
        name: "Imagenes Carrusel",
        path: "/ajustes/carrusel",
        component: CarruselList,
      },
      {
        name: "Preguntas Frecuentes",
        path: "/ajustes/preguntas_frecuentes",
        component: PreguntasList,
      },
    ],
  },
  {
    name: "Usuarios",
    icon: faUsers,
    path: "/control_usuarios",
    isPrivate: true,
    showSidebar: true,
    accessValidate: [ADMINISTRADOR],
    subMenu: [
      {
        name: "Usuarios",
        path: "/control_usuarios/usuarios",
        component: UsuarioList,
      },
      {
        name: "Soliciudes",
        path: "/control_usuarios/solicitudes",
        component: SolicitudList,
      },
    ],
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

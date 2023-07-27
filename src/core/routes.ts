import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "vuefire";

const OverviewComponent = () => import("../pages/Overview.vue");
const CinemaComponent = () => import("../pages/Cinema/Cinema.vue");
const WatchlistComponent = () => import("../pages/Watchlist/Watchlist.vue");
const MyPartnerComponent = () => import("../pages/MyPartner/MyPartner.vue");

const LoginComponent = () => import("../pages/Login.vue");

const routes = [
  {
    path: "/",
    component: OverviewComponent,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        component: CinemaComponent,
      },
      {
        path: "/watchlist",
        component: WatchlistComponent,
      },
      {
        path: "/my-partner",
        component: MyPartnerComponent,
      },
    ],
  },
  {
    path: "/login",
    component: LoginComponent,
    meta: { requiresAuth: false },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
    meta: { requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const currentFirebaseUser = await getCurrentUser();

  if (to.path === "/login" && currentFirebaseUser) return next({ path: "/" });

  if (to.meta.requiresAuth) {
    if (!currentFirebaseUser) return next({ path: "/login" });
    return next();
  }
});

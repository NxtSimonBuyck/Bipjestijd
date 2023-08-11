import { User } from "./user/user.interface";
import { createStore } from "vuex";
import modules from './modules';
import { Cinema } from "./cinema/cinema.interface";

export interface StoreState {
  user: User;
}

export const store = createStore<StoreState>({
  state: {
    user: {} as User,
    partner: {} as Cinema,
  },
  getters: {},
  mutations: {
    SET_USER(state, user: User) {
      state.user = user;
    },
  },
  actions: {},
  modules
});

import { User } from "./user/user.interface";
import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

interface storeState {
  user: User;
}

export const key: InjectionKey<Store<storeState>> = Symbol();
export const store = createStore<storeState>({
  state: {
    user: {} as User,
  },
  getters: {},
  mutations: {
    SET_USER(state, user: User) {
      state.user = user;
    },
  },
  actions: {
    update(context) {
      context.commit("increment");
    },
  },
  modules: {},
});

export function useStore() {
  return baseUseStore(key);
}

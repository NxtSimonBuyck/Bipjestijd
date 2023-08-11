import { useStore as useGlobalStore } from 'vuex';
import { StoreState } from '../store/store';

/**
 * UseStore() is a function that returns the useGlobalStore() function, which returns the StoreState
 * object.
 * @returns The useGlobalStore hook is being returned.
 */
export const useStore = () => {
   return useGlobalStore<StoreState>();
};
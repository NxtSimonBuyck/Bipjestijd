import { ModuleTree } from 'vuex';
import { StoreState } from './store';

/* Importing all the files in the collections folder and subfolders that end with .store.ts */
const requireModules = import.meta.globEager('../collections/*/*.store.ts');

/* Return the first character of the string, capitalized, followed by the rest of the string */
function capitalize(s: string) {
   return s[0].toUpperCase() + s.slice(1);
}

/* Creating a module tree for the store. */
const modules: ModuleTree<StoreState> = Object.entries(requireModules).reduce((acc, cur) => {
   const path: string = cur[0];
   const module: any = cur[1];

   const dotSeparated = path.split('.').filter((dot) => !!dot);
   const slashSeparated = dotSeparated?.[0]?.split('/').filter((slash) => !!slash);
   const storePath = slashSeparated[slashSeparated.length - 1]
      ?.split('-')
      ?.reduce((acc, cur, index) => (index > 0 ? (acc += capitalize(cur)) : (acc += cur)), '');

   return { ...acc, [storePath!]: module.default };
}, {});

export default modules;
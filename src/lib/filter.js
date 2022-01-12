import { useSelector } from "@store";

const GetFilterDataFromStore = (route) => {
  const filter = useSelector((state) => state.filter);
  if (filter.path !== undefined && filter.path.indexOf(route) !== -1) {
    return Object.assign({}, filter.params);
  }
  return {};
};

const GetFilterPageFromStore = (route) => {
  const filter = useSelector((state) => state.filter);

  if (filter.path !== undefined && filter.path.indexOf(route) !== -1) {
    return filter.page;
  }
  return 0;
};

export { GetFilterDataFromStore, GetFilterPageFromStore };

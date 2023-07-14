const context = import.meta.globEager("./*.ts");
const apisList={} as any;
Object.keys(context).forEach((apis:any) => {
  const name = apis.replace(/(^\.\/|\.ts$)/g, '');
  const api = context[apis].default;
  apisList[name] = api;
  return apis;
}, {});

export default {
  ...apisList,
};

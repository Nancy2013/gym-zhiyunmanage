import { mapActions, createNamespacedHelpers } from 'vuex'
import { useMapper } from './useMapper'

export function useAction(moduleName: any, mapper?: any) {
  const mapName = 'mapActions'
  let mapperFn = mapActions
  if (moduleName && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapActions
  } else {
    mapper = moduleName
  }

  return useMapper(mapper, mapperFn, mapName)
}

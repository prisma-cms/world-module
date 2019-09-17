
import Module from "./modules";


import MapModule from "./modules/Map";


import ImportModule, {
  ImportProcessor,
} from "./modules/Import";

export {
  ImportModule,
  ImportProcessor,
}


import GeoMapModule, {
  GeoMapProcessor,
} from "./modules/GeoMap";

export {
  GeoMapModule,
  GeoMapProcessor,
}


export const Modules = [
  MapModule,
  ImportModule,
  GeoMapModule,
]

export default Module

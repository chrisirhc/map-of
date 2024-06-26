export interface MapData {
  data_map: Location[];
}

export interface Location {
  kioskId: null | string;
  popstationName: null | string;
  distance: string;
  // extensionFieldsList: any[];
  outletId: string;
  outletName: string;
  outletType: string;
  ediCode: string;
  buildingName: string | null;
  houseBlockNumber: string | null;
  storey: null | string;
  unitNumber: string | null;
  streetName: string;
  town_suburb: string;
  city: string;
  postCode: string | null;
  latitude: string;
  longitude: string;
  operatingHours: string | null;
  phoneNumber: string;
  // availableDelivery: string;
  // availableDropoff: string;
  notes: string;
  account: string;
  locationDescription: null | string;
  sortCode: string;
  email: string;
  dimension: string;
  service: null | string;
  location: null | string;
  state: string;
  // country: string;
  region: string;
}

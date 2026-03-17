export type LoginCredentials = {
  username: string;
  password: string;
  role?: string;
};
export type RoomResDTO = {
  id: string;
  roomNumber: string;
  propertyName?: string;
  typeRoom?: string;
  price?: string;
  tenantName?: string;
  tenantIdCardNumber?: string;
  statusRoom?: string;
};
export type GetPropertiesParams = {
  nameProperty?: string;
  tenantName?: string;
  statusRoom?: string;
  priceRoom?: string;
  typeRoom?: string;
  page?: number;
  size?: number;
  search?: string;
};
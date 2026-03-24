export type RoomManagerCreateReqDTO = {
  propertiesId: string;
  area: string;
  floor?: string;
  roomNumber: string;
  type: string;
  price: number;
  roomAssetCreateReqDTOS: RoomAssetCreateReqDTO[];
};

export type RoomAssetCreateReqDTO = {
    roomId: string;
    name: string;
    brand?: string;
    serialNumber?: string;
    status?: string;
};

export type RoomAssetRespDTO = {
  id: string;
  name: string;
  brand: string;
  serialNumber: string;
  status: string;
};

export type RoomServiceRespDTO = {
  serviceId: string;
  serviceName: string;
  unitType: string;
  unitPrice: number;
};

export type RoomDetailData = {
  roomId: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  tenantId: string | null;
  tenantFullName: string | null;
  area: number;
  floor: number;
  price: string;
  roomNumber: string;
  status: string;
  type: string | null;
  assets: RoomAssetRespDTO[];
  services: RoomServiceRespDTO[];
};

export type RoomDetailRespDTO = {
  status: number;
  message: string;
  data: RoomDetailData;
  timestamp: string;
};
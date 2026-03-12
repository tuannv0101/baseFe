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
}
export type TenantResponse = {
    id: number;
    fullName: string;
    phone?: string;
    email?: string;
    idCardNumber?: string;
    portraitImageId?: number;
    portraitImageUrl?: string;
    temporaryResidenceDeclared?: boolean;
    temporaryResidenceDeclaredAt?: string;
}
export type GetTenantsParams = {
  size?: number;
  page?: number;
  textSearch?: string;
};
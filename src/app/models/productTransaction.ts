import { Product } from './product';

export class ProductTransaction {
  public product: Product;
  public canRedeem: boolean;
  public code: string;
  public createdAt: any;
  public email: string;
  public enoughPoints: boolean;
  public eventId: string;
  public expirationDate: any;
  public productFolio: string;
  public productUploadedAt: any;
  public sku: string;
  public status: string; // pending
  public userId: string;
  public yearRedeem: number;
  public aurisNumber: number;
  public origin?: string;
}

export class UserTransactions {
  category: string;
  createdAt: any;
  fullName: string;
  points: number;
  status: string;
  aurisNumber: number;
  executedBy: string;
  productFolio: string;
  origin?: string;
  code: string;

  constructor(t: any) {
    this.category = t.category;
    this.createdAt = !!t.createdAt ? new Date(t.createdAt) : null;
    this.fullName = t.fullName;
    this.points = t.points;
    this.status = this.mapStatus(t.status);
    this.aurisNumber = t.aurisNumber;
    this.executedBy = t.executedBy;
    this.productFolio = t.productFolio;
    this.origin = t.origin;
    this.code = t.code;
  }

  /* eslint-disable */
  public mapStatus(status) {
    const statuses = {
      completed: 'completado',
      'out-of-codes': 'error: sin stock',
      'unknow-error': 'error desconocido',
      'already-processed': 'canje duplicado',
      'limit-exceeded': 'limite excedido',
      'redeem-points-service-response-error': 'error: servicio de puntos'
    };
    return statuses[status] ? statuses[status] : status;
  }
}

import { StoreItemResponse } from "../api/types/apiTypes";

export class StoreItem {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly imageUrl: string
  ) {}

  static fromResponse(response: StoreItemResponse): StoreItem {
    return new StoreItem(
      response.id,
      response.title,
      response.price,
      response.stock,
      response.imageUrl
    );
  }

  toResponse(): StoreItemResponse {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      stock: this.stock,
      imageUrl: this.imageUrl
    };
  }

  // Проверка доступности товара
  isAvailable(): boolean {
    return this.stock > 0;
  }

  // Проверка достаточности средств
  canAfford(userMana: number): boolean {
    return userMana >= this.price;
  }

  // Получить информацию о товаре
  getInfo(): string {
    return `${this.title} - ${this.price} маны (остаток: ${this.stock})`;
  }

  // Проверка на низкий остаток
  isLowStock(threshold: number = 5): boolean {
    return this.stock <= threshold;
  }
}

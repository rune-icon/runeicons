export function getProductIdForAmount(amount: number): string | undefined {
  switch (amount) {
    case 5:
      return process.env.NEXT_PUBLIC_CREEM_PRODUCT_5;
    case 10:
      return process.env.NEXT_PUBLIC_CREEM_PRODUCT_10;
    case 25:
      return process.env.NEXT_PUBLIC_CREEM_PRODUCT_25;
    case 50:
      return process.env.NEXT_PUBLIC_CREEM_PRODUCT_50;
    case 100:
      return process.env.NEXT_PUBLIC_CREEM_PRODUCT_100;
    case 200:
      return process.env.NEXT_PUBLIC_CREEM_PRODUCT_200;
    case 500:
      return process.env.NEXT_PUBLIC_CREEM_PRODUCT_500;
    default:
      return undefined;
  }
}

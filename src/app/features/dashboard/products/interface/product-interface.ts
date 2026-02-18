export interface product {
    id: string,
    status: boolean,
    basic_info: {
        product_name: string,
        product_category: string,
        product_price: number,
        product_company: string
    },
    detail_info: {
        product_expiry: string,
        product_regno: string,
        product_mfg: string,
        product_stock: number
    }
}
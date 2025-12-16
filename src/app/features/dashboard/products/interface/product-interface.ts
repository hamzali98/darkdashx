export interface product {
    id: string,
    status: string,
    basic_info: {
        product_name: string,
        product_category: string,
        product_price: string,
        product_company: string
    },
    detail_info: {
        product_expiry: string,
        product_regno: string,
        product_mfg: string,
        product_stock: string
    }
}
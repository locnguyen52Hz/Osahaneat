const API_BASE_URL = import.meta.env.VITE_API_URL;

const endpoints = {
    auth:{
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        logout: `${API_BASE_URL}/auth/logout`,
        role: `${API_BASE_URL}/auth/get-role`,
    },
    image : {
        food : `${API_BASE_URL}/food/image`,
        shop:  `${API_BASE_URL}/shops/avatar`,
    },
    shop : {
        top6Shop :`${API_BASE_URL}/shops/top-6-shops`,
        shopId:`${API_BASE_URL}/shops`
    },
    category:{
        categories: `${API_BASE_URL}/categories/shop-category?shopID`
    },
    order:{
        create : `${API_BASE_URL}/orders/create-orders`,
        get_orders: `${API_BASE_URL}/orders`
    },
 

    
}
export default endpoints
import DOMPurify from "dompurify";


export const formatCurrency = (value) =>{
    if(!value) return "0 ₫"
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency : 'VND',
    }).format(value)
}

export const sanitizeInput = (input) =>{
    return DOMPurify.sanitize(input, {USE_PROFILES: {html: false}})
}
import { defineStore } from "pinia"
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
})

const useBasketStore = defineStore('basketStore', {
    state: () => ({
        products: [],
        loading: false
    }),
    actions: {
        async addProduct(product) {
            this.loading = true

            this.products.push(product)
            
            await axiosInstance.post('/products', product)
            
            this.loading = false
        },
        async removeProduct(id) {
            this.loading = true

            this.products.filter(p => {
                return p.id !== id
            })

            await axiosInstance.delete('/products/' + id)

            this.loading = false
        }
    }
})

export default useBasketStore
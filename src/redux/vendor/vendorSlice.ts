import { createSlice } from "@reduxjs/toolkit";
import { fetchVendorProducts, deleteVendorProduct, updateVendorProduct, fetchVendorOrders, fetchOrderDetail, updateVendorOrderStatus, updateVendorProfile, fetchVendorReturnOrders } from "./vendorThunk";
import { AllProductData, GetOrdersData, OrderDetailData, GetReturnOrderData } from "@/src/types/vendor.types";

interface VendorState {
    products: AllProductData[];
    orders: GetOrdersData[];
    currentOrder: OrderDetailData | null;
    loading: boolean;
    orderLoading: boolean;
    error: string | null;
    deleting: string | null;
    updating: string | null;
    updatingStatus: boolean;
    profileLoading: boolean;
    returnOrders: GetReturnOrderData[];
}

const initialState: VendorState = {
    products: [],
    orders: [],
    currentOrder: null,
    loading: false,
    orderLoading: false,
    error: null,
    deleting: null,
    updating: null,
    updatingStatus: false,
    profileLoading: false,
    returnOrders: [],
};

export const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch products
        builder.addCase(fetchVendorProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchVendorProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.data || [];
        });
        builder.addCase(fetchVendorProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete product
        builder.addCase(deleteVendorProduct.pending, (state, action) => {
            state.deleting = action.meta.arg;
        });
        builder.addCase(deleteVendorProduct.fulfilled, (state, action) => {
            state.deleting = null;
            // Remove the deleted product from the list
            state.products = state.products.filter(
                (product) => product.id.toString() !== action.payload.productId
            );
        });
        builder.addCase(deleteVendorProduct.rejected, (state, action) => {
            state.deleting = null;
            state.error = action.payload as string;
        });

        // Update product
        builder.addCase(updateVendorProduct.pending, (state, action) => {
            state.updating = action.meta.arg.productId;
        });
        builder.addCase(updateVendorProduct.fulfilled, (state, action) => {
            state.updating = null;
            // Update the specific product in the list if response contains updated data
            if (action.payload.success && action.payload.data) {
                const updatedProduct = action.payload.data;
                const index = state.products.findIndex(
                    (p) => p.id === updatedProduct.id
                );
                if (index !== -1) {
                    // Map UpdateProductData to AllProductData if they differ, 
                    // or just update common fields. 
                    // Since AllProductData usually has the list view structure.
                    // Map UpdateProductData to AllProductData
                    state.products[index] = {
                        ...state.products[index],
                        ...updatedProduct,
                        // Convert string fields from API to the numbers expected by local state
                        brand_id: Number(updatedProduct.brand_id),
                        category_id: Number(updatedProduct.category_id),
                        subcategory_id: updatedProduct.subcategory_id ? Number(updatedProduct.subcategory_id) : null,
                        hot_deals: Number(updatedProduct.hot_deals),
                        featured: updatedProduct.featured ? Number(updatedProduct.featured) : 0,
                        special_offer: updatedProduct.special_offer ? Number(updatedProduct.special_offer) : 0,
                        special_deals: Number(updatedProduct.special_deals),
                        status: Number(updatedProduct.status)
                    };
                }
            }
        });
        builder.addCase(updateVendorProduct.rejected, (state, action) => {
            state.updating = null;
            state.error = action.payload as string;
        });

        // Fetch vendor orders
        builder.addCase(fetchVendorOrders.pending, (state) => {
            state.orderLoading = true;
            state.error = null;
        });
        builder.addCase(fetchVendorOrders.fulfilled, (state, action) => {
            state.orderLoading = false;
            state.orders = action.payload.data || [];
        });
        builder.addCase(fetchVendorOrders.rejected, (state, action) => {
            state.orderLoading = false;
            state.error = action.payload as string;
        });

        // Fetch order detail
        builder.addCase(fetchOrderDetail.pending, (state) => {
            state.orderLoading = true;
            state.error = null;
            state.currentOrder = null;
        });
        builder.addCase(fetchOrderDetail.fulfilled, (state, action) => {
            state.orderLoading = false;
            state.currentOrder = action.payload.data;
        });
        builder.addCase(fetchOrderDetail.rejected, (state, action) => {
            state.orderLoading = false;
            state.error = action.payload as string;
        });

        // Update order status
        builder.addCase(updateVendorOrderStatus.pending, (state) => {
            state.updatingStatus = true;
            state.error = null;
        });
        builder.addCase(updateVendorOrderStatus.fulfilled, (state, action) => {
            state.updatingStatus = false;
            // Update current order if it matches
            if (state.currentOrder && state.currentOrder.order.id === action.payload.data.id) {
                state.currentOrder.order.status = action.payload.data.status;
            }
            // Update in list view as well
            const orderInList = state.orders.find(o => o.id === action.payload.data.id);
            if (orderInList) {
                orderInList.status = action.payload.data.status;
            }
        });
        builder.addCase(updateVendorOrderStatus.rejected, (state, action) => {
            state.updatingStatus = false;
            state.error = action.payload as string;
        });

        // Update vendor profile
        builder.addCase(updateVendorProfile.pending, (state) => {
            state.profileLoading = true;
            state.error = null;
        });
        builder.addCase(updateVendorProfile.fulfilled, (state) => {
            state.profileLoading = false;
        });
        builder.addCase(updateVendorProfile.rejected, (state, action) => {
            state.profileLoading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchVendorReturnOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchVendorReturnOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.returnOrders = action.payload.data || [];
        });
        builder.addCase(fetchVendorReturnOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default vendorSlice.reducer;

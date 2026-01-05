import api from "../lib/axios";
import { ContractRequestPayload, ContractRequestResponse, ContractProductResponse } from "../types/contract.types";


export const contractApi = {
    reqContracts: async (data: ContractRequestPayload) => {
        const res = await api.post<ContractRequestResponse>("/user/contract/request", data);
        return res.data;
    },

    getContractProducts: async () => {
        const res = await api.get<ContractProductResponse>("/user/contract-products");
        return res.data;
    },
}


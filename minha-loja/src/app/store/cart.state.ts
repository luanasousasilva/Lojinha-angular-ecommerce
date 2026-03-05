import {CartItem} from "../../types";

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
}

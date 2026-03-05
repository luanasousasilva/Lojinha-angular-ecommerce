import { createReducer, on } from "@ngrx/store";
import { addProductToCart, removeProductFromCart, clearCart, increaseQuantity, decreaseQuantity } from "./cart.actions";
import { initialState } from "./cart.state";

export const cartReducer = createReducer(
  initialState,

  on(addProductToCart, (state, { product }) => {
    const existingItem = state.items.find(item => item.id === product.id);
    let newItems;

    if (existingItem) {
      newItems = state.items.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...state.items, { ...product, quantity: 1 }];
    }

    return {
      ...state,
      items: newItems,
      total: calculateTotal(newItems),
      itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }),

  on(removeProductFromCart, (state, { productId }) => {
    const newItems = state.items.filter(item => item.id !== productId);
    return {
      ...state,
      items: newItems,
      total: calculateTotal(newItems),
      itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }),

  on(increaseQuantity, (state, { productId }) => {
    const newItems = state.items.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    return {
      ...state,
      items: newItems,
      total: calculateTotal(newItems),
      itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }),

  on(decreaseQuantity, (state, { productId }) => {
    const newItems = state.items.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity - 1;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as any[];

    return {
      ...state,
      items: newItems,
      total: calculateTotal(newItems),
      itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }),

  on(clearCart, state => initialState)
);


function calculateTotal(items: any[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

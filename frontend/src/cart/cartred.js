import { ADD_TO_CART, REMOVE_ITEM, EMPTY_CART } from "./actionTypes";

const initState = {
  addedItems: [],
  total: 0,
};
const cartReducer = (state = initState, action) => {

  if (action.type === ADD_TO_CART) {
    console.log("acion", action);
    let addedItem = action.item.product;
    let itemAmount = action.item.amount;
    
    //check if the action id exists in the addedItems
    let existed_item = state.addedItems.find(
      (item) => addedItem._id === item._id
    );
    
    if (existed_item) {
      let updatedItem = { ...existed_item };
      updatedItem.quantity =
        parseInt(updatedItem.quantity) + parseInt(itemAmount);

      // Create a new array for the modified addedItems
      let updatedAddedItems = state.addedItems.map((item) =>
        item._id === existed_item._id ? updatedItem : item
      );
      
      return {
        ...state,
        addedItems: updatedAddedItems,
        total: state.total + addedItem.price * itemAmount,
      };
    } else {
      addedItem.quantity = parseInt(itemAmount);
      
      //calculating the total
      let newTotal = state.total + addedItem.price * itemAmount;
      
      return {
        ...state,
        addedItems: [...state.addedItems, addedItem],
        total: newTotal,
      };
    }
  } else if (action.type === REMOVE_ITEM) {
    
    let existed_item = state.addedItems.find((item) => action.id === item._id);
    if (existed_item.quantity > 1) {
      let updatedItem = { ...existed_item };
      updatedItem.quantity -= 1;

      // Create a new array for the modified addedItems
      let updatedAddedItems = state.addedItems.map((item) =>
        item._id === existed_item._id ? updatedItem : item
      );
      
      return {
        ...state,
        addedItems: updatedAddedItems,
        total: state.total - existed_item.price,
      };
    } else {
      let existed_item = state.addedItems.find(
        (item) => action.id === item._id
      );
      let new_items = state.addedItems.filter((item) => action.id !== item._id);

      //calculating the total
      let newTotal = state.total - existed_item.price * existed_item.quantity;

      return {
        ...state,
        addedItems: new_items,
        total: newTotal,
      };
    }
  } else if (action.type === EMPTY_CART) {
    return {
      ...state,
      addedItems: [],
      total: 0,
    };
  }
    return state;
  };

export default cartReducer;

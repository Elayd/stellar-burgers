import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface IBuilderState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: IBuilderState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    addBunBuilder(state, action: PayloadAction<TIngredient | null>) {
      state.constructorItems.bun = action.payload;
    },

    resetBuilder(state) {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },

    addItemBuilder: {
      prepare: (payload: TConstructorIngredient) => ({
        payload: { ...payload, id: crypto.randomUUID() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.constructorItems.bun = item;
        } else {
          state.constructorItems.ingredients.push(item);
        }
      }
    },

    deleteItemBuilder(
      state,
      action: PayloadAction<{ id: string; type: string }>
    ) {
      const { id, type } = action.payload;

      if (type !== 'bun') {
        state.constructorItems.ingredients =
          state.constructorItems.ingredients.filter((item) => item.id !== id);
      }
    },

    moveItems(
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) {
      const { index, direction } = action.payload;
      const { ingredients } = state.constructorItems;
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= ingredients.length) return;

      [ingredients[index], ingredients[newIndex]] = [
        ingredients[newIndex],
        ingredients[index]
      ];
    }
  }
});

export const selectConstructorItems = (state: { builder: IBuilderState }) =>
  state.builder.constructorItems;

export const {
  addBunBuilder,
  addItemBuilder,
  deleteItemBuilder,
  moveItems,
  resetBuilder
} = builderSlice.actions;

export default builderSlice.reducer;

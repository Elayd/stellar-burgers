import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderNumber,
  orderDataSelector
} from '../../services/slices/orderSlice';

type TIngredientsWithCount = {
  [id: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const { number = '' } = useParams<{ number: string }>();

  const dispatch = useDispatch();
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const orderData = useSelector(orderDataSelector(number));

  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderNumber(Number(number)));
    }
  }, [dispatch, orderData, number]);

  const ingredientsMap = useMemo(
    () =>
      ingredients.reduce(
        (acc, ingredient) => {
          acc[ingredient._id] = ingredient;
          return acc;
        },
        {} as Record<string, TIngredient>
      ),
    [ingredients]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, ingredientId: string) => {
        const ingredient = ingredientsMap[ingredientId];
        if (ingredient) {
          if (!acc[ingredientId]) {
            acc[ingredientId] = { ...ingredient, count: 1 };
          } else {
            acc[ingredientId].count++;
          }
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredientsMap]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

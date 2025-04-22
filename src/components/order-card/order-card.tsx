import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(selectIngredients);

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
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients
      .map((ingredientId) => ingredientsMap[ingredientId])
      .filter(Boolean);

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredientsMap]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});

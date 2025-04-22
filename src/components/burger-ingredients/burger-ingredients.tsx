import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';
import { TTabMode } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { BurgerIngredientsUI } from '@ui';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(selectIngredients);

  const categorizedIngredients = {
    bun: ingredients.filter((ingredient) => ingredient.type === 'bun'),
    main: ingredients.filter((ingredient) => ingredient.type === 'main'),
    sauce: ingredients.filter((ingredient) => ingredient.type === 'sauce')
  };

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const refs = {
    bun: useRef<HTMLHeadingElement>(null),
    main: useRef<HTMLHeadingElement>(null),
    sauce: useRef<HTMLHeadingElement>(null)
  };

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewMains] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewMains) setCurrentTab('main');
    else if (inViewSauces) setCurrentTab('sauce');
  }, [inViewBuns, inViewMains, inViewSauces]);

  const onTabClick = (tab: TTabMode) => {
    setCurrentTab(tab);
    refs[tab]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={categorizedIngredients.bun}
      mains={categorizedIngredients.main}
      sauces={categorizedIngredients.sauce}
      titleBunRef={refs.bun}
      titleMainRef={refs.main}
      titleSaucesRef={refs.sauce}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={(tab: string) => onTabClick(tab as TTabMode)}
    />
  );
};

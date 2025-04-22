import { ProfileUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserData, updateUser } from '../../services/slices/userSlice';
import { useProfileForm } from './hooks/useProfileForm';

export const Profile: FC = () => {
  const user = useSelector(selectUserData);
  const dispatch = useDispatch();

  const {
    formValue,
    isFormChanged,
    handleSubmit,
    handleCancel,
    handleInputChange
  } = useProfileForm({
    user,
    onSubmit: (formValue) => {
      dispatch(updateUser(formValue));
    }
  });

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

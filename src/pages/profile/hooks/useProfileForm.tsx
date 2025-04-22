import { useState, useEffect, useCallback, useMemo } from 'react';
import { TUser } from '@utils-types';

interface UseProfileFormProps {
  user: TUser | null;
  onSubmit: (formValue: {
    name: string;
    email: string;
    password: string;
  }) => void;
}

export const useProfileForm = ({ user, onSubmit }: UseProfileFormProps) => {
  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      !!formValue.password,
    [formValue, user]
  );

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      onSubmit(formValue);
    },
    [onSubmit, formValue]
  );

  const handleCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
      });
    },
    [user]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValue((prevState) => ({
        ...prevState,
        [name]: value
      }));
    },
    []
  );

  return {
    formValue,
    isFormChanged,
    handleSubmit,
    handleCancel,
    handleInputChange
  };
};

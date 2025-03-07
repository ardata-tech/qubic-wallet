
import { toast, Slide } from 'react-toastify';

const toastOption: any = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  transition: Slide,
};

const toastSuccess: any = {
  position: 'top-right',
  autoClose: 60000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: 'colored',
  transition: Slide,
};

 export const toastSuccessMessage = (message: string) =>
    toast.success(message, toastSuccess);

export const toastErrorMessage = (message: string) =>
    toast.error(message, toastOption);
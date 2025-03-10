
import { toast, Slide } from 'react-toastify';
import type { ToastOptions } from 'react-toastify'; 


const toastOption: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: 0,
  theme: 'colored',
  transition: Slide,
};


const toastSuccess: ToastOptions = {
  position: 'top-right',
  autoClose: 60000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: 0,
  theme: 'colored',
  transition: Slide,
};

 export const toastSuccessMessage = (message: string): number | string =>
   toast.success(message, toastSuccess);

export const toastErrorMessage = (message: string): number | string =>
  toast.error(message, toastOption);
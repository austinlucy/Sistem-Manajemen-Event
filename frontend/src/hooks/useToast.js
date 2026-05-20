import toast from 'react-hot-toast'

export const useToast = () => {
  return {
    success: (message) => toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#F3F3F3',
        color: '#000000',
        border: '1px solid #E5E5E5',
        borderRadius: '8px',
      }
    }),
    error: (message) => toast.error(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#F3F3F3',
        color: '#000000',
        border: '1px solid #E5E5E5',
        borderRadius: '8px',
      }
    }),
    loading: (message) => toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#F9F9F9',
        color: '#000000',
        border: '1px solid #E5E5E5',
        borderRadius: '8px',
      }
    }),
    promise: (promise, messages) => toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred'
      },
      {
        position: 'top-right',
        style: {
          background: '#F9F9F9',
          color: '#000000',
          border: '1px solid #E5E5E5',
        }
      }
    ),
    dismiss: toast.dismiss
  }
}

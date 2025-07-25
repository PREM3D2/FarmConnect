import Toast from 'react-native-toast-message';

export const showToast = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
  });
};
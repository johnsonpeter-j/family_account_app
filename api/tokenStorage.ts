import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'ACCESS_TOKEN';

const tokenStorage = {
  async setItem(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  },
  async getItem(key: string) {
    return AsyncStorage.getItem(key);
  },
  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  },
  async clear() {
    await AsyncStorage.clear();
  },
};

export default tokenStorage;



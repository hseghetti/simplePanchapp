import { encrypt, decrypt } from 'react-native-simple-encryption';
import firebaseData from './firebase-data';
import key from './private-key';

var data = decrypt(key, firebaseData);

export default JSON.parse(data);
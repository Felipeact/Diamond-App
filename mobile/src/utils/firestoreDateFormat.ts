import { FirebaseFirestoreTypes} from '@react-native-firebase/firestore'

export function dateFormat(timestamp: FirebaseFirestoreTypes.Timestamp){

  if(timestamp) {
    const date = new Date(timestamp.toDate())

    const day = date.toLocaleDateString('en-CA');
    const hour = date.toLocaleTimeString('en-CA');

    return `${day} at ${hour}`
  }
} 
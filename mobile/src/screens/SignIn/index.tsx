import { useState } from 'react';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import auth from '@react-native-firebase/auth'
import { Input } from '../../components/Input';

import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../../assets/logo_primary.svg'
// import Logo from "../../assets/logo_primary.svg";
import { Button } from '../../components/Button';
import { Alert } from 'react-native';

export function SignIn() {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ email, setEmail ] = useState('')
  const [ password , setPassword ] = useState('')

  const { colors } = useTheme()

  function handleSignIn() {
    
    if (!email || !password) {
      return Alert.alert('Danger', 'fill it up email and password')
    }

    setIsLoading(true);

    auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error)
      setIsLoading(false)

      if( error.code === 'auth/invalid-email')
        return Alert.alert('Sig in', 'Invalid Email or password')

      if( error.code === 'auth/wrong-password')
        return Alert.alert('Sig in', 'Invalid Email or password')
      
      if( error.code === 'auth/user-not-found')
        return Alert.alert('Sig in', 'User not found it')
    })

  }

  return (
    <VStack flex={1} alignItems='center' bg="gray.500" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Log in

      </Heading>  


      <Input 
      mb={4}
      placeholder="E-mail"
      InputLeftElement={<Icon as={<Envelope color={colors.gray[300]}/>} ml={4} />}
      onChangeText={setEmail}
      />
      <Input 
      mb={8}
      placeholder="Senha"
      InputLeftElement={<Icon as={<Key color={colors.gray[300]}/>} ml={4} />}
      secureTextEntry
      onChangeText={setPassword}
      />

      <Button 
      title='Log In' 
      w="full" 
      onPress={handleSignIn}
      isLoading={isLoading}
      />

    </VStack>
  );
}
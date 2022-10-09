import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { Platform } from 'react-native';
import Device from 'expo-device';
import * as Location from 'expo-location';

import Logo from "../../assets/logo_secondary.svg";
import { SignOut } from 'phosphor-react-native';
import { Filter } from '../../components/Filter';
import { MyLocation, LocationProps  } from '../../components/MyLocation';
import { Button } from '../../components/Button';

export function Home() {
  const [ statusSelected, setStatusSelected ] = useState<'open' | 'closed'>('open')
  const [isMylocation, setIsMyLocation] = useState<LocationProps | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, this will not work on Snack in an Android Emulator. Try it on your device!');
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setIsMyLocation({
        id: '1',
        latitude, 
        longitude,
        when: '18/07/2022',
         status: 'open'
      });
    })();
  }, []);
  

  const navigation = useNavigation()
  const { colors } = useTheme()

  function handleNewOrder(){
    navigation.navigate('location')
  }

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton 
          icon={<SignOut size={26} color={colors.gray[300]}/>}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
          <Heading color="gray.100">
            My Location
          </Heading>
          <Text color="gray.200">
            My Locations
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
        <Filter 
          type="open"
          title="Ongoing"
          onPress={() => setStatusSelected('open')}
          isActive={statusSelected === "open"}
        />

        <Filter 
          type="closed"
          title="Finished "
          onPress={() => setStatusSelected('closed')}
          isActive={statusSelected === "closed"}
        />
      </HStack> 

        <MyLocation
        flex={1}
        id={isMylocation?.id} 
        latitude={isMylocation?.latitude} 
        longitude={isMylocation?.longitude} 
        when={isMylocation?.when} 
        status={isMylocation?.status}
        />

        <Button title="Location" onPress={handleNewOrder}/>
      </VStack>


    </VStack>
  );
}
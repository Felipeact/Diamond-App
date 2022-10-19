import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import * as Location from 'expo-location';


import Logo from "../../assets/logo_secondary.svg";
import { SignOut } from 'phosphor-react-native';
import { Filter } from '../../components/Filter';
import { MyLocation, LocationProps } from '../../components/MyLocation';
import { Button } from '../../components/Button';
import { dateFormat } from '../../utils/firestoreDateFormat';
import { Loading } from '../../components/Loading';

export function Home() {
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [isLoading, setIsLoading] = useState(false)
  const [isMylocation, setIsMyLocation] = useState<LocationProps | null>({
    latitude: 49.2070497,
    longitude: -123.0454389
  });
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>()

  const navigation = useNavigation()
  const { colors } = useTheme()



  function handleNewOrder() {
    navigation.navigate('location')
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch(error => {
        console.log(error);
        return Alert.alert('Log out', 'Try again later')
      })
  }

  

  function updateLocation(lat: number, lng: Number) {
      firestore()
      .collection("users-gps")
      .doc(user?.uid)
      .set({
        id: user?.uid,
        email: user?.email,
        layerStyle: {
          id: user?.uid,
          type: 'circle',
          paint: {
            circleRadius: 10, 
            circleColor: '#007cbf'
          },
        },
        geojson: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              }
            }
          ]
        },
        status: 'open', 
        created_at: firestore.FieldValue.serverTimestamp()
      });
  }



  useEffect(() => {
    (async () => {

      const subscriber = auth()
        .onAuthStateChanged(response => {
          setUser(response)
          setIsLoading(false)
        })

        
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const { status } = await Location.getBackgroundPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert('Permission to access location was denied');
      }
    } else {
      return alert('Need Permission to access')
    }
  

      const { coords } = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = coords
      setIsMyLocation({latitude, longitude})

      
      await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 2,
        timeInterval: 3000 
      }, 
      (loc) => { 
        setIsMyLocation(loc.coords) 
        console.log(loc.coords)
      });
      updateLocation(latitude, longitude)
      

      return subscriber
      

    })()
  }, [isMylocation])



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
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
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


        {isLoading ?
          <Loading />
          :
          <MyLocation
            flex={1}
            id={isMylocation?.id}
            latitude={isMylocation?.latitude}
            longitude={isMylocation?.longitude}
            when={isMylocation?.when}
            status={isMylocation?.status}
          />
        }


        <Button title="Location" onPress={handleNewOrder} />
      </VStack>


    </VStack>
  );
}
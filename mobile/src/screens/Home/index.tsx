import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';


import Logo from "../../assets/logo_secondary.svg";
import { SignOut } from 'phosphor-react-native';
import { Filter } from '../../components/Filter';
import { MyLocation, LocationProps } from '../../components/MyLocation';
import { dateFormat } from '../../utils/firestoreDateFormat';
import { Loading } from '../../components/Loading';

export function Home() {
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [isLoading, setIsLoading] = useState(false)
  const [isMylocation, setIsMyLocation] = useState<LocationProps | null>({
    latitude: 0,
    longitude: 0
  });
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>()

  const { colors } = useTheme()


  async function handleLogout() {
    await auth()
      .signOut()
      .then( async () => {
        await updateLocation(0, 0, 'false')
      })
      .catch(error => {
        console.log(error);
        return Alert.alert('Log out', 'Try again later')
      })
  }

  

  async function updateLocation(lat: any, lng: any, status: string) {
     await  firestore()
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
        status: status, 
        created_at: firestore.FieldValue.serverTimestamp()
      });
  }



  useEffect(() => {
    (async () => {

      const subscriber = await auth()
        .onAuthStateChanged(response => {
          setUser(response)
          setIsLoading(false)
        })

    const LOCATION_TASK_NAME = 'background-location-task';
    const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });
      }

      TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
        if (error) {
          return;
        }
        if (data) {
          const { locations } = data;
          const openStatus = 'open'
          setIsMyLocation(locations) 
          await updateLocation(locations.latitude, locations.longitude, openStatus)
          console.log(locations)
        }
      });
      
    return subscriber   

      

    })()
  }, [])



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
            when={dateFormat(isMylocation?.when)}
            status={isMylocation?.status}
          />
        }


        {/* <Button title="Location" /> */}
      </VStack>


    </VStack>
  );
}


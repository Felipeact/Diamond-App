import { useEffect, useState } from 'react';

import Map, { Layer, NavigationControl, Source, useMap } from 'react-map-gl'
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from '../services/firebase';

const token = 'pk.eyJ1IjoiZmVsaXBlYWN0IiwiYSI6ImNrZzhzYnBwODBrY3cyeW8yc2d0aHh2NGoifQ.rAlvtsT_62ncvlPEaiLlIA'

interface LayerProps {
  id: string;
  type: string | any;
  paint: {},
}

interface GeojsonProps {
  type: string;
  features: [{
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number]
    }
  }]
}

interface UserData {
  id: string;
  board: string;
  name: string;
  layerStyle: LayerProps,
  geojson: GeojsonProps | any;

}


export default function Maps() {

  const [users, setUsers] = useState<any>([])


  useEffect(() => {

    (async () => {

      setInterval(async () => {
        const q = query(collection(db, "users-gps"), where("status", "==", "open"));
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => {
          const { id, email, layerStyle, geojson, status, created_at } = doc.data()

          console.log()
          return {
            id,
            email,
            layerStyle: {
              id: layerStyle.id,
              type: layerStyle.type,
              paint: {
                'circle-radius': layerStyle.paint.circleRadius,
                'circle-color': `${layerStyle.paint.circleColor}`,
              },
            },
            geojson,
            status,
            created_at
          }
        })

        setUsers(data)
      }, 2000)



    })()
  }, [])


  return (
    <Map
      id="usersMap"
      initialViewState={{
        longitude: -122.6898,
        latitude: 49.1422,
        zoom: 9.88,
        bearing: 0,
        pitch: 0
      }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      mapboxAccessToken={token}
    >

      {users.map((user: UserData) => (
        <Source key={user.id} id={user.layerStyle.id} type="geojson" data={user.geojson} >
            <Layer {...user.layerStyle} />
        </Source>
      ))}


      <NavigationControl />
    </Map>
  )
} 

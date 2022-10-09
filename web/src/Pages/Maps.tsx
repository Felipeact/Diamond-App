import { useEffect, useState } from 'react';

import Map, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl'

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

  const [showPopup, setShowPopup] = useState(true);



  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  console.log(latitude)
  console.log(longitude)

  useEffect(() => {
    const LOCATION = setInterval(
      async function getLocation() {

        const response = await fetch(
          'https://api.wheretheiss.at/v1/satellites/25544',
          { method: 'GET' }
        );

        const { latitude, longitude } = await response.json();

        setLatitude(latitude);
        setLongitude(longitude)


      }, 2000)


  })


  const users: UserData[] = [
    {
      id: 'name1',
      board: 'board 1',
      name: 'Felipe',
      layerStyle: {
        id: 'name1',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf'
        },
      },
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates:
                [latitude, longitude]
            }
          }
        ]
      }

    },

    {
      id: 'name2',
      board: 'Board 3',
      name: 'test2',
      layerStyle: {
        id: 'name2',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#cc8899'
        },
      },
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates:
                [-122.6666, 49.2222]
            },
            properties: {
              name: "Dinagat Islands"
            }
          }
        ]
      }

    },


  ]


  return (
    <Map
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
          <Source key={user.id} id={user.layerStyle.id} type="geojson" data={user.geojson}>
            <Layer {...user.layerStyle} />
          </Source>
        ))}


      <NavigationControl />
    </Map>
  )
} 

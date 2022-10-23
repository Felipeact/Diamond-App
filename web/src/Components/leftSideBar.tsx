import { query, collection, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import { db } from "../services/firebase";
import { Boards } from "./Boards";


export function LeftSideBar() {
  const [users, setUsers] = useState<any>([])
  const { usersMap } = useMap();
  console.log(users)

  function handleLocationDriver( longitude: any, latitude: any) {


    usersMap?.flyTo({center: [longitude, latitude]})
  }

  useEffect(() => {

    (async () => {

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
     
    })()
  }, [])


  return (
    <aside className="none md:w-72 h-screen shadow-md bg-white absolute z-10" >
      <div className="pt-4 pb-2 px-6">
        <a href="#!">
          <div className="flex items-center mt-10">
            <div className="shrink-0">
              <img src="https://mdbcdn.b-cdn.net/img/new/avatars/8.webp" className="rounded-full w-10" alt="Avatar" />
            </div>
            <div className="grow ml-3">
              <p className="text-sm font-semibold text-blue-600">Felipe Viana</p>
            </div>
          </div>
        </a>
      </div>

      { users.map( (user: any)  => (
        <Boards key={user.email} title={user.email} handleLocationDriver={() => handleLocationDriver(user.geojson.features[0].geometry.coordinates[0], user.geojson.features[0].geometry.coordinates[1])}/>
      ))}

    </aside>
  )
}




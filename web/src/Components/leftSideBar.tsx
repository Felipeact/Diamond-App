import { Boards } from "./Boards";







export function LeftSideBar() {



  return (
    <aside className="w-72 h-screen shadow-md bg-white absolute z-10" >
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

      <Boards title='Board 1' />

    </aside>
  )
}




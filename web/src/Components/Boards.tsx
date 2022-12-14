
interface BoardProps {
  title: string;
  handleLocationDriver: () => void
 }


export function Boards( { title, handleLocationDriver}: BoardProps ) {
  return (
      <ul className="relative">
        <li className="relative" >
          <div 
            className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" 
            onClick={handleLocationDriver}
            >
            <span>
              {title}
            </span>
          </div>
        </li>
      </ul>
  )
}

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-y-auto px-4 items-center">
      <div className="max-w-4xl w-full">navbar</div>
      <div className="max-w-4xl w-full flex-1">Messages</div>
      <div className="max-w-4xl w-full pb-4 flex">
        <input type="text" placeholder="Enter message here" className="border rounded flex-1 p-2"/>
        <button className="border rounded p-2 w-20 ml-2 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 border-blue-600">Send</button>
      </div>
    </div>
  )
}
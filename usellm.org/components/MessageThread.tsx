'use client';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

interface MessageProps {
  role: string;
  content: string;
}

function Message({role, content}: MessageProps) {
  return <div className="my-4">
    <div className="font-semibold text-gray-800">{capitalize(role)}</div>
    <div className="text-gray-600">{content}</div>
  </div>
}


export default function MessageThread() {
  const [history, setHistory] = useState([{role: 'system', content: "Your name is Jobot"}]);
  const [inputText, setInputText] = useState('');

  function handleSend() {
    if (!inputText) {
      return;
    }

    setHistory([...history, {role: 'user', content: inputText}]);
    setInputText('');
  }

  return (
    <div className="h-screen flex flex-col items-center">
      <Navbar />
      <div className="max-w-4xl w-full flex-1 overflow-y-auto px-4">
        {history.map(message => <Message {...message} key={message.content} />)}
      </div>
      <div className="max-w-4xl w-full pb-4 flex px-4">
        <Input type="text" placeholder="Enter message here" value={inputText} onChange={e => setInputText(e.target.value)} />
        <Button variant="default" className="ml-2" onClick={handleSend}>Send</Button>
      </div>
    </div>
  )
}
import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-2 p-4 border-r-2 border-black">
      <h1 className="text-3xl font-black uppercase tracking-wider border-b-2 border-black pb-3 mb-2">X<br/></h1>
      <Button className="comic-btn justify-start" variant="outline">HOME</Button>
      <Button className="comic-btn justify-start" variant="outline">PROFILE</Button>
      <Button className="comic-btn justify-start" variant="outline">NOTIFICATIONS</Button>
      <Button className="comic-btn justify-start bg-black text-white mt-4" variant="outline">LOGOUT</Button>
    </div>
  );
}
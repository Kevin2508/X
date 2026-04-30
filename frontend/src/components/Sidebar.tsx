import { Button } from "./ui/button";

export function Sidebar() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-blue-500">X Clone</h1>
      <Button variant="ghost">Home</Button>
      <Button variant="ghost">Profile</Button>
      <Button variant="ghost">Notifications</Button>
      <Button variant="ghost" className="text-red-500">Logout</Button>
    </div>
  );
}
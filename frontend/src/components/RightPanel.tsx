import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function RightPanel() {
  return (
    <div className="p-4 space-y-4">
      <Input placeholder="Search" />
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Trends</h2>
        <p className="text-sm text-gray-500">#React</p>
        <p className="text-sm text-gray-500">#Flutter</p>
        <p className="text-sm text-gray-500">#AI</p>
      </Card>
    </div>
  );
}
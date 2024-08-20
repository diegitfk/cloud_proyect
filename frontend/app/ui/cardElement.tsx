import { Card, CardHeader, CardContent } from "@/app/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/app/ui/dropdown-menu"

export default function CardElement() {
  return (
    <Card className="group">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileIcon className="h-6 w-6" />
          <div className="text-sm font-medium">Document.docx</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoveHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Download</DropdownMenuItem>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Move to</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
        <img
          src="/placeholder.svg"
          width="100"
          height="100"
          alt="Document"
          className="rounded"
          style={{ aspectRatio: "100/100", objectFit: "cover" }}
        />
        <div className="text-sm text-muted-foreground">Last modified 2 days ago</div>
      </CardContent>
    </Card>
  );
}
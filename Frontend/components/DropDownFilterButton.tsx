import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ListFilter } from "lucide-react";
import { PlaceUtility } from "@/types/PlaceUtility";




export default function DropDownFilterButton({utilities, handleChange}: {utilities: PlaceUtility[] | null, handleChange: Function}) {   
    return <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button className="bg-primary" size="icon"><ListFilter /></Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" side="left" sideOffset={10}>
            <DropdownMenuLabel>Bekvämligheter</DropdownMenuLabel>
            {utilities?.map((util) => (
                <div key={util.name} className="flex justify-between gap-10 px-5">
                    <h1>{util.name}</h1>
                    <input 
                        type="checkbox"
                        onChange={() => handleChange(util.name)}
                    />
                </div>
                ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Kategorier</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
}
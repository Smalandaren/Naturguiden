import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ListFilter } from "lucide-react";
import { PlaceAttribute } from "@/types/PlaceAttribute";




export default function DropDownFilterButton({utilities, categories, handleChange}: {utilities: PlaceAttribute[] | null, categories: PlaceAttribute[] | null, handleChange: Function}) {   
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
            {categories?.map((category) => (
                <div key={category.name} className="flex justify-between gap-10 px-5">
                    <h1>{category.name}</h1>
                    <input 
                        type="checkbox"
                        onChange={() => handleChange(category.name)}
                    />
                </div>
                ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
}
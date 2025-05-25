import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ListFilter } from "lucide-react";
import { PlaceAttribute } from "@/types/PlaceAttribute";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function DropDownFilterButton({utilities, categories, handleChange}: {utilities: PlaceAttribute[] | null, categories: PlaceAttribute[] | null, handleChange: Function}) {   
    const [filterVisible, setFilterVisible] = useState(Boolean);
    
    function HandleClick() {
        setFilterVisible(!filterVisible);
    }

    return <>
      <div className="relative">
        <Button onClick={HandleClick}><ListFilter/>Filter</Button>

        {filterVisible === true ? (
        <div className="absolute top-0 right-25 w-75">
            <Card>
                <CardHeader>
                    <CardTitle>Filter</CardTitle>
                </CardHeader>

                <Separator />

                <CardContent>
                    <div className="space-y-2">
                    <CardTitle>Bekvämligheter</CardTitle>
                    {utilities?.map((util) => (
                        <div key={util.name} className="flex justify-between gap-10 px-5">
                            <h1>{util.name}</h1>
                            <input 
                                type="checkbox"
                                onChange={() => handleChange(util.name)}
                            />
                        </div>
                    ))}

                    <Separator />

                    <CardTitle>Kategorier</CardTitle>
                    {categories?.map((category) => (
                        <div key={category.name} className="flex justify-between gap-10 px-5">
                            <h1>{category.name}</h1>
                            <input 
                                type="checkbox"
                                onChange={() => handleChange(category.name)}
                            />
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </div>) : (<></>)}
      </div>
    </>
}
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { DraggableStory } from "./DraggableStory";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const SVGPlayground = () => {
  const [color, setColor] = useState("green");
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button >Color <div style={{backgroundColor:color}} className="w-5 h-5 rounded-lg m-4"></div></Button>
        </PopoverTrigger>
        <PopoverContent>
          <HexColorPicker color={color} onChange={setColor} />
        </PopoverContent>
      </Popover>
      <div className="w-full" style={{ backgroundColor: color }}>
        <DraggableStory />
      </div>
    </>
  );
};

export default SVGPlayground;

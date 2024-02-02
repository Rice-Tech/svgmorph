import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { DraggableStory } from "./DraggableStory";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { processDropFile, processFileInput } from "@/lib/manageFiles";
import { Input } from "./ui/input";
import { ChangeEvent } from "react";
const SVGPlayground = () => {
  const [color, setColor] = useState("rgba(100,100,100,.5)");
  const divRef = useRef<HTMLDivElement>(null);
  const [urls, setURLs] = useState<string[]>([]);

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const fileContent = await processDropFile(event);
    const blob = new Blob([fileContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setURLs((prev) => [...prev, url]);
    return;
  };
  const handleFileInput = async (event: ChangeEvent) => {
    const fileContent = await processFileInput(event);
    setURLs((prev) => [...prev, fileContent]);
  };

  return (
    <>
      <div
        id="dragAreaDrop"
        onDrop={(event) => handleDrop(event as unknown as DragEvent)}
        ref={divRef}
        className="w-full"
      >
        <div className="absolute z-10 flex">
          <Popover>
            <PopoverTrigger>
              <div className=" bg-black m-3">
                <div
                  style={{ backgroundColor: color }}
                  className="w-5 h-5 rounded-lg m-4 top-0 left-0"
                ></div>{" "}
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <HexColorPicker color={color} onChange={setColor} />
            </PopoverContent>
          </Popover>
          <Button onClick={() => divRef.current?.requestFullscreen()}>
            Fullscreen
          </Button>
          <Input type="file" onChange={handleFileInput} />
        </div>
        <div
          className="w-full h-5/6 rounded-lg"
          style={{ backgroundColor: color }}
          onDrop={(event) => handleDrop(event as unknown as DragEvent)}
        >
          <DraggableStory urls={urls} />
        </div>
      </div>
    </>
  );
};

export default SVGPlayground;

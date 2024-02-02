import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import { Draggable, OverflowWrapper, Wrapper } from "./dnd";

export default {
  title: "Core/Draggable/Hooks/useDraggable",
};

const defaultCoordinates = {
  x: 0,
  y: 0,
  id: "",
  width: 200,
};
type Coordinates = {
  x: number;
  y: number;
  id: string;
  width: number;
};

interface Props {
  urls?: string[];
  activationConstraint?: PointerActivationConstraint;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
}

export function DraggableStory({
  urls = [],
  activationConstraint,
  handle,
  label = "",
  modifiers,
  style,
  buttonStyle,
}: Props) {
  const [coords, setCoords] = useState<Coordinates[]>([]);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event) => {
        const currCoords =
          coords.filter((item) => item.id === event.active.id)[0] ||
          defaultCoordinates;
        const newCoords = {
          x: currCoords.x + event.delta.x,
          y: currCoords.y + event.delta.y,
          id: event.active.id.toString(),
          width: currCoords.width,
        };

        setCoords((prev) => [
          ...prev.filter((item) => item.id !== event.active.id),
          newCoords,
        ]);
      }}
      modifiers={modifiers}
    >
      <Wrapper>
        {urls.map((url, index) => (
          <DraggableItem
            label={label + index}
            handle={handle}
            top={
              coords.filter((item) => item.id === "draggable" + index)[0]?.y ||
              0
            }
            left={
              coords.filter((item) => item.id === "draggable" + index)[0]?.x ||
              0
            }
            style={style}
            buttonStyle={buttonStyle}
            onScroll={(delta) => {
              const currCoords =
                coords.filter((item) => item.id === "draggable" + index)[0] ||
                defaultCoordinates;
              const newCoords = {
                x: currCoords.x,
                y: currCoords.y,
                id: "draggable" + index,
                width: currCoords.width + delta,
              };
              console.log(newCoords);
              setCoords((prev) => [
                ...prev.filter((item) => item.id !== "draggable" + index),
                newCoords,
              ]);
            }}
          >
            <img
              src={url}
              style={{
                width:
                  coords.filter((item) => item.id === "draggable" + index)[0]
                    ?.width + "px" || "100px",
              }}
            ></img>
            {/* <div dangerouslySetInnerHTML={{ __html: svg || "" }} /> */}
          </DraggableItem>
        ))}
      </Wrapper>
    </DndContext>
  );
}

interface DraggableItemProps {
  label: string;
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  top?: number;
  left?: number;
  children?: React.ReactElement;
  onScroll: (delta: number) => void;
}

function DraggableItem({
  label,
  style,
  top,
  left,
  handle,
  buttonStyle,
  children,
  onScroll,
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: "draggable" + label,
    });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (isHovering) {
        //setScrollOffset((prev) => prev + event.deltaY);
        event.preventDefault();
        onScroll(event.deltaY);
      }
    }
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isHovering, onScroll]);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Draggable
        ref={setNodeRef}
        dragging={isDragging}
        handle={handle}
        label={label}
        listeners={listeners}
        style={{ ...style, top, left }}
        buttonStyle={buttonStyle}
        transform={transform}
        {...attributes}
      >
        {children}
      </Draggable>
    </div>
  );
}

export const BasicSetup = () => <DraggableStory />;

export const DragHandle = () => (
  <DraggableStory label="Drag with the handle" handle />
);

export const RestrictToWindowEdges = () => (
  <OverflowWrapper>
    <DraggableStory
      label="I'm only draggable within the window bounds"
      modifiers={[restrictToWindowEdges]}
    />
  </OverflowWrapper>
);

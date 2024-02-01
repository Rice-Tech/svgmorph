import React, { useState } from "react";
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
import type { Coordinates } from "@dnd-kit/utilities";

import { Draggable, OverflowWrapper, Wrapper } from "./dnd";

export default {
  title: "Core/Draggable/Hooks/useDraggable",
};

const defaultCoordinates = {
  x: 0,
  y: 0,
};

interface Props {
  activationConstraint?: PointerActivationConstraint;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
}

export function DraggableStory({
  activationConstraint,
  handle,
  label = "",
  modifiers,
  style,
  buttonStyle,
}: Props) {
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const svg = document.getElementById("morph")?.outerHTML;
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
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      }}
      modifiers={modifiers}
    >
      <Wrapper>
        <DraggableItem
          label={label}
          handle={handle}
          top={y}
          left={x}
          style={style}
          buttonStyle={buttonStyle}
        >
          <div dangerouslySetInnerHTML={{ __html: svg || "" }} />
        </DraggableItem>
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
}

function DraggableItem({
  label,
  style,
  top,
  left,
  handle,
  buttonStyle,
  children,
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: "draggable",
    });

  return (
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

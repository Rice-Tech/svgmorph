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
          <svg
            id="morph"
            fill="none"
            stroke="black"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 239.65 78.223"
          >
            <path
              d="M44.78,34.67c0,-6.2 -1.91,-16.14 0.32,-21.95c0.66,-1.71 5.53,-7.7 7.63,-7.69c2.11,0.02 6.91,6.04 7.55,7.78c1.47,3.97 0.28,10.43 0.28,14.63c0,11 0,21.99 0,32.99c0,3.4 1.52,11.7 -0.07,14.66c-1.93,3.56 -14.56,2.8 -15.7,-1c-1.51,-5.05 0,-13.02 0,-18.33c0,-2.44 1.64,-5.52 0,-7.33c-0.22,-0.24 -7.04,-0.18 -7.15,-0.18c-4.89,0 -9.77,0 -14.66,0c-0.09,0 -7.01,-0.05 -7.19,0.14c-1.66,1.79 0,4.89 0,7.33c0,5.34 1.49,13.24 0,18.33c-1.12,3.81 -13.73,4.63 -15.69,1.07c-1.61,-2.92 -0.08,-11.28 -0.08,-14.66c0,-12.22 0,-24.43 0,-36.65c0,-4 -1.33,-10.93 0,-14.66c1.27,-3.54 10.22,-3.32 13.16,-2.4c5.03,1.57 2.61,15.93 2.61,20.28c0,2.44 -1.57,5.46 0,7.33c0.37,0.43 6.8,0.32 7.01,0.32c7.33,0 14.66,0 21.99,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0"
              fill="var(--path-fill)"
              id="morph0"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="M44.78,34.67c0,-6.2 -1.91,-16.14 0.32,-21.95c0.66,-1.71 5.53,-7.7 7.63,-7.69c2.11,0.02 6.91,6.04 7.55,7.78c1.47,3.97 0.28,10.43 0.28,14.63c0,11 0,21.99 0,32.99c0,3.4 1.52,11.7 -0.07,14.66c-1.93,3.56 -14.56,2.8 -15.7,-1c-1.51,-5.05 0,-13.02 0,-18.33c0,-2.44 1.64,-5.52 0,-7.33c-0.22,-0.24 -7.04,-0.18 -7.15,-0.18c-4.89,0 -9.77,0 -14.66,0c-0.09,0 -7.01,-0.05 -7.19,0.14c-1.66,1.79 0,4.89 0,7.33c0,5.34 1.49,13.24 0,18.33c-1.12,3.81 -13.73,4.63 -15.69,1.07c-1.61,-2.92 -0.08,-11.28 -0.08,-14.66c0,-12.22 0,-24.43 0,-36.65c0,-4 -1.33,-10.93 0,-14.66c1.27,-3.54 10.22,-3.32 13.16,-2.4c5.03,1.57 2.61,15.93 2.61,20.28c0,2.44 -1.57,5.46 0,7.33c0.37,0.43 6.8,0.32 7.01,0.32c7.33,0 14.66,0 21.99,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0; M95.65,14.35c-1.4,-2.63 -3.01,-6.72 -6.04,-8.12c-4.99,-2.31 -9.34,4.18 -10.46,8.04c-0.93,3.2 -0.36,6.66 -0.75,9.97c-0.8,6.87 -1.97,13.73 -3.57,20.47c-0.56,2.37 -1.91,7.72 -2.83,10c-0.57,1.42 -0.58,4.38 -2.09,4.09c-0.28,-0.05 -3.48,-9.64 -3.52,-9.78c-3.22,-9.87 -5.85,-19.96 -8.27,-30.06c-0.64,-2.67 -1.01,-7.39 -4.05,-9c-3.56,-1.87 -11.92,-0.81 -14.2,2.81c-0.04,0.07 -2.43,10.03 -2.45,10.1c-2.05,8.41 -4.17,16.82 -6.81,25.07c-0.1,0.32 -3.14,9.56 -3.46,9.8c-0.74,0.56 -1.46,-1.24 -1.85,-2.08c-0.36,-0.78 -2.53,-9.21 -2.74,-10.03c-2.54,-10.11 -3.24,-20.6 -5.57,-30.63c-0.79,-3.41 -5.07,-10.68 -9.73,-9.62c-7.94,1.81 -7.27,11.84 -6.39,17.45c2.12,13.58 5.74,27.28 10.55,40.16c1.46,3.9 3.4,11.21 7.58,13.28c1.54,0.76 3.42,0.42 5.14,0.48c13.63,0.47 16.41,-15.83 19.53,-26.45c1.05,-3.56 1.8,-6.44 2.54,-10.07c0.35,-1.7 0.47,-3.44 0.92,-5.11c0.16,-0.59 0.64,-2.14 0.89,-1.59c1.46,3.14 0.98,6.87 1.76,10.24c1.57,6.72 3.93,13.34 6.5,19.72c1.66,4.1 3.65,10.85 8.2,12.85c10.31,4.52 15.66,-4.19 18.95,-12.09c6.49,-15.59 11.28,-33 12.19,-49.89"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
              <animate
                attributeName="fill"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="rgba(255,255,255,0); rgba(255,255,255,0)"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
            </path>
            <path
              d="M108.5,56.44c-5.55,0 -14.25,-1.69 -19.49,0c-2.17,0.7 -1.13,2.64 -0.54,3.99c1.57,3.61 4.96,5.5 8.71,6.1c7.49,1.19 14.58,-6.24 21.21,-2.7c3.45,1.84 2.24,7 -0.24,9.45c-3.69,3.65 -10.96,4.42 -15.81,4.64c-20.45,0.92 -33.23,-12.14 -29.44,-32.82c2.18,-11.9 11.5,-19.23 23.45,-19.56c13.2,-0.37 26.78,9.02 23.53,23.81c-3.45,15.68 -26.44,-0.57 -30.48,-2.92c-0.8,-0.47 1.86,0 2.78,0c1.86,0 3.71,0 5.57,0c4.71,0 10.73,0.06 7.09,-6.54c-2.75,-4.98 -10.83,-5.34 -14.44,-1.17c-1.88,2.17 -2.42,5 -2.94,7.71"
              fill="var(--path-fill)"
              id="morph1"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="M108.5,56.44c-5.55,0 -14.25,-1.69 -19.49,0c-2.17,0.7 -1.13,2.64 -0.54,3.99c1.57,3.61 4.96,5.5 8.71,6.1c7.49,1.19 14.58,-6.24 21.21,-2.7c3.45,1.84 2.24,7 -0.24,9.45c-3.69,3.65 -10.96,4.42 -15.81,4.64c-20.45,0.92 -33.23,-12.14 -29.44,-32.82c2.18,-11.9 11.5,-19.23 23.45,-19.56c13.2,-0.37 26.78,9.02 23.53,23.81c-3.45,15.68 -26.44,-0.57 -30.48,-2.92c-0.8,-0.47 1.86,0 2.78,0c1.86,0 3.71,0 5.57,0c4.71,0 10.73,0.06 7.09,-6.54c-2.75,-4.98 -10.83,-5.34 -14.44,-1.17c-1.88,2.17 -2.42,5 -2.94,7.71; M109.67,71.44c10.26,8.33 27.78,9.36 38.27,0.66c10.7,-8.88 11.71,-29.85 1.67,-39.59c-14.57,-14.13 -43.72,-7.05 -46.73,13.8c-0.95,6.57 -0.5,14.15 2.8,20.05c0.12,0.21 2.58,4.18 3.04,4.13c9.17,-0.92 19.27,-0.88 27.01,-5.88c6.68,-4.31 6.96,-21.04 0.38,-25.53c-4.92,-3.36 -12.88,-1.98 -15.9,3.24c-5.27,9.12 -1.87,23.01 9.43,23.85c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
              <animate
                attributeName="fill"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="rgba(255,255,255,0); rgba(255,255,255,0)"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
            </path>
            <path
              d="M147.51,73.1c-2.54,1.17 -10.21,6.3 -12.79,4.63c-4.62,-2.99 -3.81,-12.05 -3.81,-16.63c0,-13.44 0,-26.87 0,-40.31c0,-6.61 -1.52,-13.12 3.68,-17.92c0.96,-0.89 2.75,-2.99 4.27,-2.86c2.24,0.2 6.81,5.17 7.4,7.21c1.3,4.5 0.08,11.08 0.08,15.77c0,11.68 0,23.37 0,35.05c0,3.52 2.7,12.85 1.17,15.05c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0"
              fill="var(--path-fill)"
              id="morph2"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="M147.51,73.1c-2.54,1.17 -10.21,6.3 -12.79,4.63c-4.62,-2.99 -3.81,-12.05 -3.81,-16.63c0,-13.44 0,-26.87 0,-40.31c0,-6.61 -1.52,-13.12 3.68,-17.92c0.96,-0.89 2.75,-2.99 4.27,-2.86c2.24,0.2 6.81,5.17 7.4,7.21c1.3,4.5 0.08,11.08 0.08,15.77c0,11.68 0,23.37 0,35.05c0,3.52 2.7,12.85 1.17,15.05c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0; M182.23,32.42c0,1.14 -0.78,2.59 0,3.41c0.67,0.7 0.94,-1.69 1.39,-2.55c0.8,-1.5 1.78,-2.92 3.02,-4.09c1.99,-1.86 10.24,-5.78 12.61,-2.54c1.27,1.73 0.17,8.04 0.17,10.19c0,0.42 0.16,2.87 -0.46,3.24c-0.69,0.41 -4.1,-0.85 -4.98,-0.9c-4.9,-0.28 -8.85,2.14 -10.63,6.76c-2.51,6.51 -1.12,15.16 -1.12,22.02c0,1.9 0.91,6.93 -0.71,8.32c-1.59,1.37 -6.47,0.48 -8.43,0.48c-1.34,0 -3.86,0.43 -5.09,-0.21c-2.33,-1.22 -1.2,-7.54 -1.2,-9.73c0,-8.52 0,-17.04 0,-25.56c0,-2.91 -0.89,-7.5 0.68,-10.06c4.37,-7.13 11.72,-6.9 14.75,1.22"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
              <animate
                attributeName="fill"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="rgba(255,255,255,0); rgba(255,255,255,0)"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
            </path>
            <path
              d="M176.32,73.1c-2.54,1.17 -10.21,6.3 -12.79,4.63c-4.62,-3 -3.81,-12.05 -3.81,-16.62c0,-13.44 0,-26.87 0,-40.31c0,-6.61 -1.52,-13.11 3.68,-17.92c0.96,-0.89 2.75,-2.99 4.27,-2.86c2.24,0.2 6.81,5.17 7.4,7.21c1.3,4.5 0.08,11.08 0.08,15.77c0,11.68 0,23.37 0,35.05c0,3.52 2.7,12.85 1.17,15.05"
              fill="var(--path-fill)"
              id="morph3"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="M176.32,73.1c-2.54,1.17 -10.21,6.3 -12.79,4.63c-4.62,-3 -3.81,-12.05 -3.81,-16.62c0,-13.44 0,-26.87 0,-40.31c0,-6.61 -1.52,-13.11 3.68,-17.92c0.96,-0.89 2.75,-2.99 4.27,-2.86c2.24,0.2 6.81,5.17 7.4,7.21c1.3,4.5 0.08,11.08 0.08,15.77c0,11.68 0,23.37 0,35.05c0,3.52 2.7,12.85 1.17,15.05; M223.29,73.1c-2.54,1.17 -10.21,6.3 -12.79,4.63c-4.62,-2.99 -3.81,-12.05 -3.81,-16.62c0,-13.44 0,-26.87 0,-40.31c0,-6.61 -1.52,-13.12 3.68,-17.92c0.96,-0.89 2.75,-2.99 4.26,-2.86c2.23,0.2 6.81,5.17 7.4,7.21c1.3,4.5 0.08,11.08 0.08,15.77c0,11.68 0,23.37 0,35.05c0,3.52 2.7,12.85 1.17,15.05"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
              <animate
                attributeName="fill"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="rgba(255,255,255,0); rgba(255,255,255,0)"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
            </path>
            <path
              d="M193.02,71.44c10.26,8.33 27.78,9.36 38.27,0.66c10.7,-8.88 11.71,-29.85 1.67,-39.59c-14.57,-14.13 -43.72,-7.05 -46.73,13.8c-0.95,6.57 -0.5,14.15 2.8,20.05c0.12,0.21 2.58,4.18 3.04,4.13c9.17,-0.92 19.27,-0.88 27.01,-5.88c6.68,-4.31 6.96,-21.04 0.38,-25.53c-4.92,-3.36 -12.88,-1.99 -15.9,3.24c-5.27,9.12 -1.87,23.01 9.43,23.85c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0"
              fill="var(--path-fill)"
              id="morph4"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="M193.02,71.44c10.26,8.33 27.78,9.36 38.27,0.66c10.7,-8.88 11.71,-29.85 1.67,-39.59c-14.57,-14.13 -43.72,-7.05 -46.73,13.8c-0.95,6.57 -0.5,14.15 2.8,20.05c0.12,0.21 2.58,4.18 3.04,4.13c9.17,-0.92 19.27,-0.88 27.01,-5.88c6.68,-4.31 6.96,-21.04 0.38,-25.53c-4.92,-3.36 -12.88,-1.99 -15.9,3.24c-5.27,9.12 -1.87,23.01 9.43,23.85c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0c0,0 0,0 0,0; M268.41,26.32c0,-5.49 -1.6,-13.84 0.07,-19.05c2.75,-8.57 13.29,-8.08 15.35,0.65c1.11,4.68 0,11.04 0,15.87c0,10.58 0,21.17 0,31.75c0,5.29 0,10.58 0,15.87c0,2.17 0.71,4.2 -1.96,5.33c-1.53,0.65 -7.96,0.37 -9.44,-0.45c-0.16,-0.09 -3.57,-4.43 -4.12,-4.38c-2.09,0.17 -2.94,3.09 -4.81,4.06c-4.5,2.33 -10.67,2.62 -15.53,1.43c-18.16,-4.46 -19.84,-34.05 -7.71,-45.31c5.5,-5.11 13.42,-6.62 20.68,-6.59c0.1,0 6.26,0.13 6.31,0.57c1.4,10.44 0.72,21.04 1.14,31.56c0.04,1.06 0,-2.12 0,-3.17c0,-1.06 0,-2.12 0,-3.17c0,-2.64 1.31,-10.28 -0.52,-12.4c-3.02,-3.51 -12.14,-1.49 -15,1.06c-5.53,4.92 -6.31,18.26 -0.67,23.4c5.37,4.89 12.85,1.4 16.19,-3.7"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
              <animate
                attributeName="fill"
                dur="10s"
                repeatCount="indefinite"
                begin="0s"
                values="rgba(255,255,255,0); rgba(255,255,255,0)"
                keyTimes="0; 1"
                fill="freeze"
                calcMode="spline"
                keySplines=".50 0 .50  1;"
              ></animate>
            </path>
          </svg>
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

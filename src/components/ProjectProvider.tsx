import { useState, createContext, ReactNode } from "react";
import { hello, world } from "./demos";

interface SavedPath {
  path: string;
  inputPath: string;
  viewBox: string;
  id: string;
  fill: string;
  stroke: string;
}

export type SavedSVG = {
  paths: SavedPath[];
  id: string;
};
type Animation = { svg: SavedSVG; animationPoints: number[] }[];

interface Project {
  addSVG: (newSVG: SavedSVG) => void;
  updateAnimation: (svg: SavedSVG, animationPoints: number[]) => void;
}

interface ProjectContextProps {
  project: Project;
  savedSVGs: SavedSVG[];
  animation: Animation;
  updateProject: (newProject: Partial<Project>) => void;
}
const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

const ProjectProvider = ({ children }: Props) => {
  const [savedSVGs, setSavedSVGs] = useState<SavedSVG[]>([hello,world]);
  const [animation, setAnimation] = useState<Animation>([]);
  const [project, setProject] = useState<Project>({

    addSVG: (newSVG: SavedSVG) => {
      setSavedSVGs((prev) => {
        return [...prev, newSVG];
      });
    },
    updateAnimation: (svg: SavedSVG, animationPoints: number[]) => {
      setAnimation((prev) => {
        return [
          ...prev.filter((svgAnim) => svgAnim.svg.id != svg.id),
          { svg, animationPoints },
        ];
      });
    },
  });

  const updateProject = (newProject: Partial<Project>) => {
    setProject({ ...project, ...newProject });
  };
  return (
    <ProjectContext.Provider
      value={{ project, savedSVGs, animation, updateProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectProvider, ProjectContext };
export type { SavedPath };

import { useState, createContext, ReactNode } from "react";

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

interface Project {
  savedPaths: SavedPath[];
  savedSVGs: SavedSVG[];
  animation: {svg:SavedSVG, animationPoints:number[]}[];
  addPaths: (paths: SavedPath[]) => void;
  removePath: (path: SavedPath) => void;
  addSVG: (newSVG: SavedSVG) => void;
  updateAnimation: (svg: SavedSVG, animationPoints: number[]) => void;
}

interface ProjectContextProps {
  project: Project;
  updateProject: (newProject: Partial<Project>) => void;
}
const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

const ProjectProvider = ({ children }: Props) => {
  const [project, setProject] = useState<Project>({
    savedPaths: [],
    savedSVGs: [],
    animation: [],
    addPaths: (newPaths: SavedPath[]) => {
      setProject((prevProject) => {
        const allPaths = [...prevProject.savedPaths, ...newPaths];
        console.table(allPaths);
        return { ...prevProject, savedPaths: allPaths };
      });
    },
    removePath: (itemToRemove: SavedPath) => {
      updateProject({
        savedPaths: project.savedPaths.filter((item) => item !== itemToRemove),
      });
    },
    addSVG: (newSVG: SavedSVG) => {
      setProject((prevProject) => {
        const allSVGs = [...prevProject.savedSVGs, newSVG];
        console.table(allSVGs);
        return { ...prevProject, savedSVGs: allSVGs };
      });
    },
    updateAnimation: (svg: SavedSVG, animationPoints: number[]) => {

      setProject((prevProject) => {
        const updatedAnimation = [
          ...prevProject.animation.filter((svgAnim) => svgAnim.svg.id != svg.id),
          {svg, animationPoints},
        ];
        console.table(updatedAnimation);
        return { ...prevProject, animation: updatedAnimation };
      });
    },
  });

  const updateProject = (newProject: Partial<Project>) => {
    setProject({ ...project, ...newProject });
  };
  return (
    <ProjectContext.Provider value={{ project, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectProvider, ProjectContext };
export type { SavedPath };

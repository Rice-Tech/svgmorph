import { useState, createContext, ReactNode } from "react";

interface SavedPath {
  path: string;
  viewBox: string;
  id: string;
  fill: string;
  stroke: string;
}


interface Project {
  savedPaths: SavedPath[];
  animations: null;
  addPaths: (paths: SavedPath[]) => void;
  removePath: (path: SavedPath) => void;
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
  const [project, setProject] = useState({
    savedPaths: [] as SavedPath[],
    animations: null,
    addPaths:  (newPaths: SavedPath[]) => {
      setProject(prevProject => {
        const allPaths = [...prevProject.savedPaths, ...newPaths];
        console.table(allPaths);
        return { ...prevProject, savedPaths: allPaths };
      })},
    removePath: (itemToRemove: SavedPath) => {
      updateProject({
        savedPaths: project.savedPaths.filter((item) => item !== itemToRemove),
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
export type {SavedPath};
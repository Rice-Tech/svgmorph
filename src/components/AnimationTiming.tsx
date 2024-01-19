import { SavedSVG } from "./ProjectProvider";
import SVGOptionsRow from "./SVGOptionsRow";

interface Props {
  svgs: SavedSVG[];
}

const AnimationTiming = ({ svgs }: Props) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Preview</th>
          <th scope="col">Paths</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        {svgs.map((svg) => {
          return <SVGOptionsRow svg={svg} />;
        })}
      </tbody>
    </table>
  );
};

export default AnimationTiming;

import { ChangeEvent, useState, useContext } from "react";
import { ProjectContext, SavedSVG } from "./ProjectProvider";

interface Props {
  svg: SavedSVG;
}

const SVGOptionsRow = ({ svg }: Props) => {
  const { project } = useContext(ProjectContext)!;
  const [active, setActive] = useState(false);
  const [percent, setPercent] = useState(0);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setPercent(value);
    project.updateAnimation(svg, [value]);
  };
  return (
    <tr
      onClick={() => !active && setActive(true)}
      className={active ? "activeRow" : "inactiveRow"}
    >
      <td>
        <svg
          className="svgTablePreview"
          fill="none"
          stroke="black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={svg.paths[0].viewBox}
        >
          <>
            {svg.paths.map((path) => {
              return <path key={path.id} d={path.path} fill={path.fill}></path>;
            })}
          </>
        </svg>
      </td>
      <td>{svg.paths.length}</td>
      <td>
        {active ? (
          <>
            <p>{percent}%</p>
            <label htmlFor={"percentSlider" + svg.id} className="form-label">
              Animation Timeline %
            </label>
            <input
              type="range"
              id={"percentSlider" + svg.id}
              className="form-range"
              onChange={handleSliderChange}
            />
            <button
              type="button"
              className="btn-close"
              aria-label="Remove from animation"
              onClick={() => {
                console.log("hello");
                setActive(false);
              }}
            ></button>
          </>
        ) : (
          "Click to Use"
        )}
      </td>
    </tr>
  );
};

export default SVGOptionsRow;

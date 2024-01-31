import { SavedSVG } from "./ProjectProvider";
import SVGOptionsRow from "./SVGOptionsRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

interface Props {
  svgs: SavedSVG[];
}

const AnimationTiming = ({ svgs }: Props) => {
  return (
    <Table className=" table-fixed border-2 rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead scope="col" className=" w-80">Preview</TableHead>
          <TableHead scope="col" className=" w-20">Paths</TableHead>
          <TableHead scope="col">Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {svgs.map((svg) => {
          return <SVGOptionsRow key={svg.id} svg={svg} />;
        })}
      </TableBody>
    </Table>
  );
};

export default AnimationTiming;

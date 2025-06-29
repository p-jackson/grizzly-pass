import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { LabelInfo } from "../../types";
import "./Label.css";

interface LabelProps {
  labelInfo: LabelInfo;
  readonly: boolean;
}

export default function Label({ labelInfo, readonly }: LabelProps) {
  const { initial, colour, title } = labelInfo;
  if (readonly)
    return (
      <div className="Label" title={title} style={{ background: colour }}>
        {initial}
      </div>
    );
  else
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="Label"
            title={title}
            style={{ background: colour }}
            variant="outline"
          >
            {initial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="Apple" onValueChange={() => {}}>
            {renderMenuItems(["Apple", "Orange", "Banana"])}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

function renderMenuItems(labelTitles: string[]) {
  return labelTitles.map((title) => (
    <DropdownMenuRadioItem key={title} value={title} className="Label-menuItem">
      {title}
    </DropdownMenuRadioItem>
  ));
}

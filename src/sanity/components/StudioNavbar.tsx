import { Box } from "@sanity/ui";
import type { NavbarProps } from "sanity";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Sanity's navbar has no insertion slot, so the switcher is positioned over
// it — anchored right, offset to clear the perspective menu and icon group.
export function StudioNavbar(props: NavbarProps) {
  return (
    <Box style={{ position: "relative" }}>
      {props.renderDefault(props)}
      <Box
        style={{
          position: "absolute",
          top: "50%",
          right: "var(--locale-switcher-offset, 350px)",
          transform: "translateY(-50%)",
          zIndex: 200,
        }}
      >
        <LocaleSwitcher />
      </Box>
    </Box>
  );
}

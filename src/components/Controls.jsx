import { forwardRef } from "react";
import { BsChevronDown } from "react-icons/bs";
import theme from "../utils/theme";

// shared look for every floating control on the playground
// read at render time so palette changes apply
const controlStyle = () => ({
  background: theme.surface,
  color: theme.ink,
  border: `1px solid ${theme.line}`,
});

const controlClass =
  "flex h-10 items-center gap-2 rounded-lg px-4 text-sm backdrop-blur-md transition-colors hover:brightness-125";

export const ControlButton = forwardRef(({ children, style, className = "", ...props }, ref) => (
  <button ref={ref} type="button" className={`${controlClass} ${className}`} style={{ ...controlStyle(), ...style }} {...props}>
    {children}
  </button>
));

// dropdown driven by mouse and by pinch (Playground hit-tests dropdownRef / optionsRef,
// so options must stay equal size for the hovered index to line up; data-columns tells it the grid shape)
export function ControlDropdown({
  caption,
  label,
  options,
  onSelect,
  dropdownOpen,
  setDropdownOpen,
  dropdownRef,
  optionsRef,
  hoveredOptionIndex,
  setHoveredOptionIndex,
  minWidth = 180,
  columns = 1,
}) {
  return (
    <div className="relative">
      <div
        ref={dropdownRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`${controlClass} cursor-pointer justify-between`}
        style={{ ...controlStyle(), minWidth }}
      >
        <span className="flex items-baseline gap-2">
          {caption && <span className="text-xs uppercase tracking-wider" style={{ color: theme.accent }}>{caption}</span>}
          <span style={{ fontFamily: theme.font }}>{label}</span>
        </span>
        <BsChevronDown className="transition-transform" style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", color: theme.accent }} />
      </div>

      {dropdownOpen && (
        <div
          ref={optionsRef}
          data-columns={columns}
          className="absolute left-0 z-50 mt-1.5 grid overflow-hidden rounded-lg backdrop-blur-md"
          style={{
            ...controlStyle(),
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            width: columns > 1 ? `${columns * 170}px` : "100%",
            maxHeight: `calc(100vh - ${theme.barHeight + 16}px)`,
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.key}
              onClick={() => {
                onSelect(option);
                setDropdownOpen(false);
              }}
              onMouseEnter={() => setHoveredOptionIndex(index)}
              onMouseLeave={() => setHoveredOptionIndex(null)}
              className="cursor-pointer truncate px-4 py-2 text-sm"
              style={{
                background: hoveredOptionIndex === index ? theme.surfaceHover : "transparent",
                color: option.selected ? theme.accent : theme.ink,
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

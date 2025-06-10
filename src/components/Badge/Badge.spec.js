import { render, screen } from "@testing-library/svelte";
import { expect, describe, test } from "vitest";
import Badge from "./Badge.svelte";

function setupTest(args) {
  const { component } = render(Badge, { ...args });
  return { component };
}

describe("Badge Component Tests", () => {
  test("Renders badge with label", () => {
    setupTest({
      label: "Test Badge",
      size: "medium",
    });
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  test("Applies correct size class", () => {
    setupTest({
      label: "Small Badge",
      size: "small",
    });
    expect(screen.getByText("Small Badge").parentElement).toHaveClass("px-[2px] text-[7px] leading-[7px] rounded-[4px] font-medium");
  });

  test("Applies correct status styles", () => {
    setupTest({
      label: "Success Badge",
      status: "success",
    });
    const badge = screen.getByText("Success Badge").parentElement;
    expect(badge).toHaveStyle("color: #15A033");
    expect(badge).toHaveStyle("background-color: rgba(21, 160, 51, 0.15)");
  });

  test("Applies correct tier styles", () => {
    setupTest({
      tier: 1,
      tierVariation: "red",
    });
    const badge = screen.getByText("1").parentElement;
    expect(badge).toHaveStyle("color: #f66");
    expect(badge).toHaveStyle("background-color: rgba(255, 102, 102, 0.15)");
  });

  test('renders icon if provided', () => {
    setupTest({ label: 'Icon Badge', icon: 'icon.png' });
    const icon = screen.getByAltText('');
    expect(icon).toBeInTheDocument(); // Assuming icon has empty alt text
    expect(icon).toHaveAttribute('src', 'icon.png');
  });

  test("Handles event styles correctly", () => {
    setupTest({
      label: "Event Badge",
      event: "squareEvent",
    });
    const badge = screen.getByText("Event Badge").parentElement;
    expect(badge).toHaveClass("square-event");
  });

  test("Applies custom class name", () => {
    setupTest({
      label: "Custom Class Badge",
      className: "custom-class",
    });
    const badge = screen.getByText("Custom Class Badge").parentElement;
    expect(badge).toHaveClass("custom-class");
  });
});

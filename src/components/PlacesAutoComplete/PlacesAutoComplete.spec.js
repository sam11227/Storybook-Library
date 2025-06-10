import { render, screen, fireEvent } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, test, vi } from "vitest";
import PlaceAutoComplete from "../PlaceAutoComplete.svelte";

describe("PlaceAutoComplete Component", () => {
  test("renders input element with proper styling", () => {
    render(PlaceAutoComplete, { error: false });

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("w-full p-2 border rounded-md");
    expect(input).not.toHaveClass("border-red-500");
    expect(input).toHaveClass("border-gray-300");
  });

  test("applies error styling when error is true", () => {
    render(PlaceAutoComplete, { error: true });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-red-500");
    expect(input).not.toHaveClass("border-gray-300");
  });

  test("emits focus and blur events", async () => {
    const mockFocus = vi.fn();
    const mockBlur = vi.fn();

    render(PlaceAutoComplete, {
      on: { focus: mockFocus, blur: mockBlur },
    });

    const input = screen.getByRole("textbox");
    await fireEvent.focus(input);
    expect(mockFocus).toHaveBeenCalled();

    await fireEvent.blur(input);
    expect(mockBlur).toHaveBeenCalled();
  });

  test("dispatches input and change events with parsed value", async () => {
    const mockInput = vi.fn();
    const mockChange = vi.fn();

    render(PlaceAutoComplete, {
      on: { input: mockInput, change: mockChange },
    });

    const input = screen.getByRole("textbox");

    // Simulate user typing
    await userEvent.type(input, "Lagos");
    expect(input).toHaveValue("Lagos");

    // Simulate Google Places Autocomplete `place_changed` event
    window.google = {
      maps: {
        places: {
          Autocomplete: vi.fn(() => ({
            getPlace: () => ({
              address_components: [
                {
                  long_name: "Lagos",
                  short_name: "LA",
                  types: ["locality"],
                },
                {
                  long_name: "Nigeria",
                  short_name: "NG",
                  types: ["country"],
                },
              ],
              formatted_address: "Lagos, Nigeria",
            }),
            addListener: (event, callback) => {
              if (event === "place_changed") {
                callback();
              }
            },
          })),
        },
      },
    };

    const mockAutocomplete = new window.google.maps.places.Autocomplete(input);
    mockAutocomplete.addListener("place_changed", () => {
      const place = mockAutocomplete.getPlace();
      fireEvent.change(input, { target: { value: place.formatted_address } });
    });

    expect(mockInput).toHaveBeenCalledWith({
      city: "Lagos",
      country: "Nigeria",
      countryCode: "NG",
      postalCode: "",
      state: "",
      city_code: "",
    });

    expect(mockChange).toHaveBeenCalledWith({
      city: "Lagos",
      country: "Nigeria",
      countryCode: "NG",
      postalCode: "",
      state: "",
      city_code: "",
    });
  });
});
